// Entry runner for "Funniest AI Agent Mishap: GTA 6 Launch Week".
// Loads the single-sentence entry from entry.txt, checks it against the
// bounty rules (one line, one sentence, at most 240 characters), then
// prints it to stdout so a judge can read exactly what was submitted.

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_CHARS = 240;

function fail(message: string): never {
  console.error(`invalid entry: ${message}`);
  process.exit(1);
}

function loadEntry(): string {
  const here = dirname(fileURLToPath(import.meta.url));
  const raw = readFileSync(join(here, "entry.txt"), "utf8");
  return raw.replace(/\r\n/g, "\n").trim();
}

function checkEntry(entry: string): void {
  if (!entry) fail("entry.txt is empty");
  if (entry.includes("\n")) fail("entry must fit on a single line");
  if (entry.length > MAX_CHARS) {
    fail(`entry is ${entry.length} characters, limit is ${MAX_CHARS}`);
  }
  // Count sentence-ending punctuation clusters; exactly one is allowed,
  // and it must sit at the very end of the sentence (a closing quote
  // after the final full stop still counts as the end).
  const endings = entry.match(/[.!?]+/g) ?? [];
  if (endings.length !== 1 || !/[.!?]['")\]]?$/.test(entry)) {
    fail(`entry must be exactly one sentence (found ${endings.length} endings)`);
  }
}

const entry = loadEntry();
checkEntry(entry);
console.error(`entry OK: ${entry.length} characters`);
console.log(entry);
