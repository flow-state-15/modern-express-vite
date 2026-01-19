import express from "express";
import morgan from "morgan";

// import utils
import { getDistPath } from "./utils/index.js";

// import routes
import router from "./controllers/routes.js";

// import error handlers
import { genericServerError, spaFallback } from "./errors/index.js";

export const app = express();

const distPath = getDistPath();

app.use(morgan("dev"));
app.use(express.json());
app.use("/api", router);
app.use(express.static(distPath));

// use SPA routing for non-api requests
app.get(/^\/(?!api).*/, spaFallback);

// catchall errors
app.use(genericServerError);

if (process.env.NODE_ENV !== "test") {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}
