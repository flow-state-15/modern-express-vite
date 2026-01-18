// uncategorized utility and multi-use functions
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../../../frontend/dist");
export function getDistPath() {
    return distPath;
}
//# sourceMappingURL=index.js.map