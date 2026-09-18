"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * A burst of short lines from wherever the page is clicked.
 *
 * Adapted from React Bits' ClickSpark. Two things differ from the original:
 * the canvas is fixed to the viewport rather than sized to its parent (the
 * original would make a bitmap the height of the whole page and clear it
 * sixty times a second), and the draw loop only runs while there are sparks
 * alive. Under `prefers-reduced-motion` a click is just a click.
 */
type Easing = "linear" | "ease-in" | "ease-out" | "ease-in-out";

type ClickSparkProps = {
  sparkColor?: string;
  sparkSize?: number;
  sparkRadius?: number;
  sparkCount?: number;
  duration?: number;
  easing?: Easing;
  extraScale?: number;
  children?: ReactNode;
};

type Spark = { x: number; y: number; angle: number; startTime: number };

const EASE: Record<Easing, (t: number) => number> = {
  linear: (t) => t,
  "ease-in": (t) => t * t,
  "ease-out": (t) => t * (2 - t),
  "ease-in-out": (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
};

export function ClickSpark({
  sparkColor = "#fff",
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = "ease-out",
  extraScale = 1,
  children,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  /* Set by the effect below; a click asks it to start drawing. */
  const wake = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let frame = 0;

    /* Keep the bitmap the size of the viewport, in device pixels, so the
       lines stay crisp on a high-density screen. */
    const resize = () => {
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * scale);
      canvas.height = Math.round(window.innerHeight * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    };

    const ease = EASE[easing];
    const draw = (timestamp: number) => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      sparks.current = sparks.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime;
        if (elapsed >= duration) return false;
        const eased = ease(elapsed / duration);
        const distance = eased * sparkRadius * extraScale;
        const length = sparkSize * (1 - eased);
        const cos = Math.cos(spark.angle);
        const sin = Math.sin(spark.angle);
        ctx.strokeStyle = sparkColor;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(spark.x + distance * cos, spark.y + distance * sin);
        ctx.lineTo(spark.x + (distance + length) * cos, spark.y + (distance + length) * sin);
        ctx.stroke();
        return true;
      });
      frame = sparks.current.length ? requestAnimationFrame(draw) : 0;
    };

    resize();
    window.addEventListener("resize", resize);
    wake.current = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
      wake.current = () => {};
    };
  }, [duration, easing, extraScale, sparkColor, sparkRadius, sparkSize]);

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const now = performance.now();
    for (let i = 0; i < sparkCount; i += 1) {
      sparks.current.push({ x: event.clientX, y: event.clientY, angle: (2 * Math.PI * i) / sparkCount, startTime: now });
    }
    wake.current();
  };

  return (
    <div className="click-spark" onClick={onClick}>
      <canvas ref={canvasRef} className="click-spark__canvas" aria-hidden="true" />
      {children}
    </div>
  );
}
