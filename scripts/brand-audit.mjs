#!/usr/bin/env node
import fs from "fs/promises";
import path from "path";

const OK_TAGLINE = "From Salt Lake, to Everywhere";
const OK_COUNT = "1 Airport * 1000+ Destinations";

const ALLOWED_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".md",
  ".mdx",
  ".html",
  ".css",
  ".scss",
  ".json",
  ".yml",
  ".yaml",
  ".txt",
  ".webmanifest",
]);

const EXCLUDE_DIRS = new Set([
  "node_modules",
  "dist",
  "build",
  "out",
  "AUDIT",
  ".next",
  ".git",
  "logs",
  "coverage",
  ".turbo",
]);

const BAD_PATTERNS = [
  /\bFrom Salt Lake to Everywhere\b/gi,
  /\bfrom salt lake, to everywhere\b/gi,
  /\bFrom SLC,? to Everywhere\b/gi,
  /\b\d{1,3}(?:,\d{3})?\+?\s*destinations\b/gi,
  /\bAdventure Decks?\b/gi,
  /\b52[-\s]?cards?\b/gi,
  /\b206\b/gi,
  /\b700\+\b/gi,
];

const ALLOWLIST = new Set([OK_TAGLINE, OK_COUNT]);

const violations = [];

function isAllowedExact(text) {
  return ALLOWLIST.has(text);
}

async function main() {
  const files = await collectFiles(process.cwd());

  for (const file of files) {
    const raw = await fs.readFile(file, "utf8");

    for (const pattern of BAD_PATTERNS) {
      let match;
      while ((match = pattern.exec(raw))) {
        const value = match[0];
        if (isAllowedExact(value)) continue;
        if (/destinations/i.test(value) && value === OK_COUNT) continue;

        const line = raw.slice(0, match.index).split("\n").length;
        violations.push({
          file: path.relative(process.cwd(), file),
          line,
          match: value,
        });
      }
    }
  }

  if (violations.length > 0) {
    const header = "file,line,match\n";
    const csv =
      header +
      violations
        .map(
          ({ file, line, match }) =>
            `${file},${line},"${String(match).replace(/"/g, '""')}"`
        )
        .join("\n");

    await fs.mkdir("AUDIT", { recursive: true });
    await fs.writeFile("AUDIT/branding-violations.csv", csv, "utf8");

    console.error(
      `\nBrand audit failed with ${violations.length} violation(s). See AUDIT/branding-violations.csv\n`
    );
    process.exit(1);
  } else {
    console.log("Brand audit passed with zero violations.");
  }
}

async function collectFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) {
      if (entry.name !== ".env") continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      results.push(...(await collectFiles(fullPath)));
      continue;
    }

    const ext = path.extname(entry.name);
    if (!ALLOWED_EXTENSIONS.has(ext)) continue;
    results.push(fullPath);
  }

  return results;
}

main().catch((error) => {
  console.error("Brand audit failed to run:", error);
  process.exit(1);
});
