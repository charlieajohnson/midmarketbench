import { readFile, readdir } from "node:fs/promises";
import { extname, join } from "node:path";

const roots = ["app", "components", "data"];
const allowed = new Set([".ts", ".tsx", ".md"]);
const violations = [];

async function visit(path) {
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const target = join(path, entry.name);
    if (entry.isDirectory()) await visit(target);
    else if (allowed.has(extname(entry.name))) {
      const source = await readFile(target, "utf8");
      if (source.includes("\u2014")) violations.push(`${target}: contains an em dash`);
      if (/<em>|<\/em>|(^|\s)_[^_\n]+_(\s|$)|(^|\s)\*[^*\n]+\*(\s|$)/m.test(source)) {
        violations.push(`${target}: contains italic markup`);
      }
    }
  }
}

await Promise.all(roots.map(visit));
if (violations.length) {
  console.error(violations.join("\n"));
  process.exit(1);
}
console.log("Copy checks passed");
