import fs from 'fs/promises';
import path from 'path';
import {libraryFrontmatterJSONSchema} from '../src/lib/frontmatter.mjs';

/*
 * Writes the library's frontmatter rules as JSON Schema, next to the content
 * they describe, for editors and agents. src/lib/frontmatter.mjs is the source;
 * rerun this after changing it (the unit tests fail until you do).
 */
export const SCHEMA_PATH = path.resolve('content/blog/frontmatter.schema.json');

export function renderSchema() {
  return `${JSON.stringify(libraryFrontmatterJSONSchema(), null, 2)}\n`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await fs.writeFile(SCHEMA_PATH, renderSchema());
  console.log(`Wrote ${path.relative(process.cwd(), SCHEMA_PATH)}`);
}
