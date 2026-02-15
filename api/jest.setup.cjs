// Load env before tests run. .env.test overrides .env for test-specific connection (e.g. localhost vs db).
const path = require("path");
// Use config file dir; Jest may run workers from different cwd
const apiDir = path.resolve(__dirname);
require("dotenv").config({ path: path.join(apiDir, ".env") });
require("dotenv").config({ path: path.join(apiDir, ".env.test"), override: true });
