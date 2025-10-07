#!/usr/bin/env node
import { globby } from "globby";
import fs from "fs/promises";

const OK_TAGLINE = "From Salt Lake, to Everywhere";
const OK_COUNT = "1 Airport * 1000+ Destinations";

const FILE_GLOBS = [
  "**/*.{ts,tsx,js,jsx,md,mdx,html,css,scss,json,yml,yaml,txt}",
  "!node_modules/**",
  "!dist/**",
  "!build/**",
  "!out/**",
  "!AUDIT/**",
  "!.next/**",
];

const BAD_PATTERNS = [
  // Wrong taglines: missing comma, casing, word swaps
  /\bFrom Salt Lake to Everywhere\b/gi,
  /\bfrom salt lake, to everywhere\b/gi,
  /\bFrom SLC,? to Everywhere\b/gi,
  // Any other destination counts like "700+", "739+", "1,057+"
  /\b\d{1,3}(?:,\d{3})?\+?\s*destinations\b/gi,
  // Legacy phrases that imply counts
  /\bAdventure Decks?\b/gi,
  /\b52[-\s]?cards?\b/gi,
  /\b206\b/gi,
  /\b700\+\b/gi,
];

const ALLOWLIST = new Set([OK_TAGLINE, OK_COUNT]);

let violations = [];

function isAllowedExact(text) {
  return ALLOWLIST.has(text);
}

(async () => {
  const files = await globby(FILE_GLOBS, { gitignore: true });
  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");
    for (const pat of BAD_PATTERNS) {
      let m;
      while ((m = pat.exec(raw))) {
        const match = m[0];
        // Skip if the match exactly equals the one allowed pattern
        if (isAllowedExact(match)) continue;

        const line = raw.slice(0, m.index).split("\n").length;
        // Special case: allow the OK destination string
        if (/destinations/i.test(match) && raw.includes(OK_COUNT)) {
          // If this match is not the OK string, treat as violation
          if (match !== OK_COUNT) {
            violations.push({ file, line, match });
          }
        } else {
          violations.push({ file, line, match });
        }
      }
    }
  }

  if (violations.length) {
    const header = "file,line,match\n";
    const csv = header + violations.map(v =>
      `${v.file},${v.line},"${String(v.match).replace(/"/g, '""')}"`
    ).join("\n");

    await fs.mkdir("AUDIT", { recursive: true });
    await fs.writeFile("AUDIT/branding-violations.csv", csv, "utf8");

    console.error("\nBrand audit failed. See AUDIT/branding-violations.csv\n");
    process.exit(1);
  } else {
    console.log("Brand audit passed with zero violations.");
  }
})();
