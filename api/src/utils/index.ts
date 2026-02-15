// uncategorized utility and multi-use functions

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * resolveDistPath() anchors the dist path to the api root so we have a stable path to the frontend dist.
 * Walk up from this file to find the api root (the nearest package.json),
 * then resolve ../frontend/dist relative to that.
 *
 * This works regardless of whether we're running:
 *   - Source via tsx:  __dirname = api/src/utils
 *   - Compiled JS:     __dirname = api/dist/src/utils
 *   - Docker:          __dirname = /app/frontend/dist/src/utils
 *
 * In every case, the nearest package.json is at the api/ root,
 * and frontend/dist is always one level above that.
 */

function resolveDistPath(): string {
  let dir = __dirname;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, "package.json"))) {
      return path.resolve(dir, "..", "frontend", "dist");
    }
    dir = path.dirname(dir);
  }
  throw new Error("Could not locate api package.json — cannot resolve frontend dist path");
}

export function getDistPath() {
  return resolveDistPath();
}
