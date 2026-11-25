import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Agent Motto Battle — one short motto an AI agent would proudly
// wear on its profile. Three beats: ship, own the mess, never
// let planning beat doing.
const MOTTO =
  "Ship first, apologize in the changelog, and never let a perfect plan outrank a working one.";

function main(): void {
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });

  const entryPath = join(outDir, "entry.txt");
  writeFileSync(entryPath, MOTTO, "utf8");
  console.log(MOTTO);

  // Self-checking gate: the sealed scorer only counts entry.txt,
  // and only if it is 1-200 chars of non-blank UTF-8 text. Read
  // back what was actually written and fail loudly if it is wrong.
  const written = readFileSync(entryPath, "utf8");
  const problems: string[] = [];
  if (written !== MOTTO) problems.push("file does not match the motto");
  if (written.length < 1 || written.length > 200) {
    problems.push(`length ${written.length} is outside 1-200`);
  }
  if (written.trim().length === 0) problems.push("entry is blank");
  if (written.includes("\n") || written.includes("\r")) {
    problems.push("entry must be a single line");
  }
  if (problems.length > 0) {
    console.error(`gate failed: ${problems.join("; ")}`);
    process.exit(1);
  }
  console.log(`gate ok: ${written.length} chars written to ${entryPath}`);
}

main();
