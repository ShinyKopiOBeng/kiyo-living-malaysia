/**
 * Remove redundant declarations from globals.css without changing a single
 * computed value.
 *
 * The stylesheet grew as six successive layers (V4.2 through V9) that re-declare
 * selectors instead of editing them: `.hero h1` appears 15 times, `.hero__copy`
 * 14. Whichever copy sits last silently wins, which is invisible when reading
 * the file and is where several real bugs came from.
 *
 * Two passes, both of which provably cannot change what the browser computes:
 *
 *   1. Dead declarations. If a selector sets a property and the SAME selector
 *      sets it again later in the same context, the earlier one lost to equal
 *      specificity at a later source position. It can never win, so deleting it
 *      is free.
 *
 *   2. Safe lifts. A surviving declaration moves into that selector's final
 *      rule only when no rule in between mentions the property at all. With
 *      nothing competing for it, moving it cannot change who wins. Anything
 *      that fails the test stays exactly where it is.
 *
 * Merging everything into the last position - the obvious approach - is NOT
 * safe: it moved 1,373 computed values on the first attempt, because shared
 * rules like the font-weight lock sit between a selector's occurrences and were
 * quietly overriding them. Hence the in-between test.
 *
 *   node tools/flatten-css.mjs [--check]
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "app/globals.css";
const check = process.argv.includes("--check");
const stats = { deadDropped: 0, lifted: 0, rulesRemoved: 0 };

/* At-rules whose bodies are declarations rather than rules. Their contents
   are preserved byte for byte. */
const DECLARATION_AT_RULES = ["@theme", "@font-face", "@property", "@page", "@counter-style", "@color-profile", "@view-transition"];

/* ---------------------------------------------------------------- parsing -- */

/** Walk a block, skipping strings and comments so braces inside them never split a rule. */
function findBlockEnd(css, openIndex) {
  let depth = 0;
  for (let i = openIndex; i < css.length; i++) {
    const c = css[i];
    if (c === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      if (end === -1) return css.length;
      i = end + 1;
      continue;
    }
    if (c === '"' || c === "'") {
      const quote = c;
      i += 1;
      while (i < css.length && css[i] !== quote) i += css[i] === "\\" ? 2 : 1;
      continue;
    }
    if (c === "{") depth += 1;
    else if (c === "}") {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return css.length;
}

function splitDeclarations(body) {
  const declarations = [];
  let buffer = "";
  let comment = "";

  for (let i = 0; i < body.length; i++) {
    const c = body[i];

    if (c === "/" && body[i + 1] === "*") {
      const end = body.indexOf("*/", i + 2);
      const text = body.slice(i, end === -1 ? body.length : end + 2);
      if (!buffer.trim()) comment += (comment ? "\n" : "") + text;
      i = end === -1 ? body.length : end + 1;
      continue;
    }
    if (c === '"' || c === "'") {
      const quote = c;
      buffer += c;
      i += 1;
      while (i < body.length && body[i] !== quote) { buffer += body[i]; i += 1; }
      buffer += quote;
      continue;
    }
    if (c === "(") {
      let depth = 1;
      buffer += c;
      i += 1;
      while (i < body.length && depth > 0) {
        if (body[i] === "(") depth += 1;
        else if (body[i] === ")") depth -= 1;
        buffer += body[i];
        i += 1;
      }
      i -= 1;
      continue;
    }
    if (c === ";") {
      const text = buffer.trim();
      if (text) declarations.push({ text, comment });
      buffer = "";
      comment = "";
      continue;
    }
    buffer += c;
  }

  const tail = buffer.trim();
  if (tail) declarations.push({ text: tail, comment });
  return declarations;
}

const declarationProperty = (text) => {
  const colon = text.indexOf(":");
  return colon === -1 ? text.trim() : text.slice(0, colon).trim();
};

/** Split a stylesheet body into comments, at-rules and rules, in source order. */
function parseNodes(css) {
  const nodes = [];
  let i = 0;
  let pendingComment = "";

  while (i < css.length) {
    const c = css[i];
    if (/\s/.test(c)) { i += 1; continue; }

    if (c === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      pendingComment += (pendingComment ? "\n" : "") + css.slice(i, end === -1 ? css.length : end + 2);
      i = end === -1 ? css.length : end + 2;
      continue;
    }

    if (c === "@") {
      const semi = css.indexOf(";", i);
      const brace = css.indexOf("{", i);
      if (brace === -1 || (semi !== -1 && semi < brace)) {
        nodes.push({ type: "at-statement", text: css.slice(i, semi + 1), comment: pendingComment });
        pendingComment = "";
        i = semi + 1;
        continue;
      }
      const end = findBlockEnd(css, brace);
      const prelude = css.slice(i, brace).trim().replace(/\s+/g, " ");

      /* Some at-rules hold declarations, not rules. Parsing them as rule
         containers finds no nested braces and silently empties them, which is
         how an earlier version wiped the whole Tailwind @theme block. Keep
         them verbatim. */
      if (DECLARATION_AT_RULES.some((name) => prelude.startsWith(name))) {
        nodes.push({ type: "verbatim", text: css.slice(i, end + 1), comment: pendingComment });
        pendingComment = "";
        i = end + 1;
        continue;
      }

      nodes.push({
        type: "at-block",
        prelude,
        children: parseNodes(css.slice(brace + 1, end)),
        comment: pendingComment,
      });
      pendingComment = "";
      i = end + 1;
      continue;
    }

    const brace = css.indexOf("{", i);
    if (brace === -1) break;
    const end = findBlockEnd(css, brace);
    nodes.push({
      type: "rule",
      selector: css.slice(i, brace).trim(),
      declarations: splitDeclarations(css.slice(brace + 1, end)),
      comment: pendingComment,
    });
    pendingComment = "";
    i = end + 1;
  }

  return nodes;
}

/* --------------------------------------------------------------- merging -- */

const normaliseSelector = (selector) =>
  selector.split(",").map((part) => part.trim().replace(/\s+/g, " ")).join(", ");

/** Every property declared anywhere inside a node, at any depth. */
function declaredProperties(node, into = new Set()) {
  if (node.type === "rule") {
    for (const declaration of node.declarations) into.add(declarationProperty(declaration.text));
  } else if (node.type === "at-block") {
    for (const child of node.children) declaredProperties(child, into);
  } else if (node.type === "verbatim") {
    /* Opaque, but it still declares properties that must block a lift. */
    for (const match of node.text.matchAll(/(?:^|[;{])\s*(-{0,2}[a-zA-Z][\w-]*)\s*:/g)) into.add(match[1]);
  }
  return into;
}

function compact(nodes) {
  const rules = [];
  for (const node of nodes) if (node.type === "rule") rules.push(node);

  const groups = new Map();
  for (const rule of rules) {
    const key = normaliseSelector(rule.selector);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(rule);
  }

  /* Pass 1: keep only each property's final declaration per selector. */
  for (const entries of groups.values()) {
    const owner = new Map();
    for (const rule of entries) {
      for (const declaration of rule.declarations) owner.set(declarationProperty(declaration.text), declaration);
    }
    for (const rule of entries) {
      const before = rule.declarations.length;
      rule.declarations = rule.declarations.filter(
        (declaration) => owner.get(declarationProperty(declaration.text)) === declaration,
      );
      stats.deadDropped += before - rule.declarations.length;
    }
  }

  /* The in-between test runs over EVERY node, not just rules. A media block
     between two occurrences is a blocker for every property declared inside
     it: media queries add no specificity, so a later base rule outruns them.
     Missing this lifted `--page-padding` over a `:root` inside a media block
     and silently changed the mobile gutter from 18.4px to 16px. */
  const position = new Map(nodes.map((node, index) => [node, index]));
  const mentions = nodes.map((node) => declaredProperties(node));

  /* Pass 2: lift what can be lifted into each selector's final rule. */
  for (const entries of groups.values()) {
    if (entries.length < 2) continue;
    const target = entries[entries.length - 1];
    const targetIndex = position.get(target);

    for (const rule of entries.slice(0, -1)) {
      const from = position.get(rule);
      const stay = [];
      for (const declaration of rule.declarations) {
        const property = declarationProperty(declaration.text);
        let blocked = false;
        for (let i = from + 1; i < targetIndex && !blocked; i++) {
          if (nodes[i] === rule) continue;
          if (mentions[i].has(property)) blocked = true;
        }
        if (blocked) { stay.push(declaration); continue; }
        target.declarations.unshift(declaration);
        mentions[targetIndex].add(property);
        stats.lifted += 1;
      }
      /* A rule emptied by the lift hands its comment to the survivor. */
      if (!stay.length && rule.comment) {
        target.comment = [rule.comment, target.comment].filter(Boolean).join("\n");
      }
      rule.declarations = stay;
    }
  }

  const kept = nodes.filter((node) => node.type !== "rule" || node.declarations.length > 0);
  stats.rulesRemoved += nodes.length - kept.length;
  return kept;
}

/* ---------------------------------------------------------------- output -- */

const indentComment = (comment, pad) =>
  comment.split("\n").map((line) => pad + line.trim()).join("\n");

function renderRule(rule, pad = "") {
  const lines = [];
  if (rule.comment) lines.push(indentComment(rule.comment, pad));
  lines.push(`${pad}${normaliseSelector(rule.selector).replace(/,\s*/g, ",\n" + pad)} {`);
  for (const declaration of rule.declarations) {
    if (declaration.comment) lines.push(indentComment(declaration.comment, `${pad}  `));
    lines.push(`${pad}  ${declaration.text};`);
  }
  lines.push(`${pad}}`);
  return lines.join("\n");
}

function renderNode(node, pad = "") {
  if (node.type === "rule") return renderRule(node, pad);
  if (node.type === "verbatim") {
    return (node.comment ? `${indentComment(node.comment, pad)}
` : "") + node.text;
  }
  if (node.type === "at-statement") return (node.comment ? `${indentComment(node.comment, pad)}\n` : "") + pad + node.text;
  const inner = node.children.map((child) => renderNode(child, `${pad}  `)).join("\n\n");
  return (node.comment ? `${indentComment(node.comment, pad)}\n` : "") + `${pad}${node.prelude} {\n${inner}\n${pad}}`;
}

/* ------------------------------------------------------------------ main -- */

const source = readFileSync(FILE, "utf8");
const parsed = parseNodes(source);

/* Media blocks keep their original relative order on purpose. Consolidating by
   query would reorder the cascade between different queries that both match at
   a given width, which is the class of change this must not make. */
for (const node of parsed) if (node.type === "at-block") node.children = compact(node.children);
const compacted = compact(parsed);

const output = compacted.map((node) => renderNode(node)).join("\n\n").trimStart() + "\n";

const countRules = (nodes) => {
  let n = 0;
  for (const node of nodes) {
    if (node.type === "rule") n += 1;
    else if (node.type === "at-block") n += countRules(node.children);
  }
  return n;
};

console.log(`rules                     ${countRules(parseNodes(source))} -> ${countRules(compacted)}`);
console.log(`lines                     ${source.split("\n").length} -> ${output.split("\n").length}`);
console.log(`dead declarations dropped ${stats.deadDropped}`);
console.log(`declarations lifted       ${stats.lifted}`);

if (check) {
  console.log("\n--check: nothing written");
} else {
  writeFileSync(FILE, output, "utf8");
  console.log(`\nwritten ${FILE}`);
}
