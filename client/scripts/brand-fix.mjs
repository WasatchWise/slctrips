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

const REPLACERS = [
  // Tagline variants to the canonical
  { find: /\bFrom Salt Lake to Everywhere\b/gi, repl: OK_TAGLINE },
  { find: /\bfrom salt lake, to everywhere\b/gi, repl: OK_TAGLINE },
  { find: /\bFrom SLC,? to Everywhere\b/gi, repl: OK_TAGLINE },

  // Any count phrasing becomes the canonical string
  { find: /\b\d{1,3}(?:,\d{3})?\+?\s*destinations\b/gi, repl: OK_COUNT },

  // Legacy copy removals
  { find: /\bAdventure Decks?\b/gi, repl: "" },
  { find: /\b52[-\s]?cards?\b/gi, repl: "" },
  { find: /\b206\b/gi, repl: "" },
  { find: /\b700\+\b/gi, repl: "" },
];

(async () => {
  const files = await globby(FILE_GLOBS, { gitignore: true });
  let changed = 0;
  for (const file of files) {
    let raw = await fs.readFile(file, "utf8");
    let next = raw;
    for (const { find, repl } of REPLACERS) next = next.replace(find, repl);
    if (next !== raw) {
      await fs.writeFile(file, next, "utf8");
      changed++;
    }
  }
  console.log(`Brand fixer updated ${changed} file(s).`);
})();
