import express from "express";
import morgan from "morgan";

//remove dupes later
import fs from "fs";
import path from "path";

// import utils
import { getDistPath } from "./utils/index.js";

// import routes
import router from "./controllers/routes.js";

// import errors
import { createSpaFallback, genericServerError } from "./errors/index.js";

const app = express();

// debug static files
const distPath = getDistPath();
console.log(distPath);
console.log(`distPath exists: ${fs.existsSync(distPath)}`);
console.log(`index.html exists: ${fs.existsSync(path.join(distPath, "index.html"))}`);

if (process.env.DEBUG_STATIC === "1") {
  app.use((req, res, next) => {
    if (req.method === "GET") {
      const filePath = path.join(distPath, req.path);
      const exists = fs.existsSync(filePath);
      console.log(`[static] ${req.path} -> ${filePath} ${exists ? "exists" : "missing"}`);
    }
    next();
  });
}

app.use(morgan("dev"));
app.use(express.json());
app.use("/api", router);
app.use(express.static(distPath));

// use SPA routing for non-api requests
app.get(/^\/(?!api).*/, createSpaFallback(distPath));

// catchall errors
app.use(genericServerError);

// start server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
