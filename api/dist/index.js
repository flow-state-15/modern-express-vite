import express from "express";
import morgan from "morgan";
// import utils
import { getDistPath } from "./utils/index.js";
// import routes
import router from "./controllers/routes.js";
// import error handlers
import { spaFallback, genericServerError } from "./errors/index.js";
const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use("/api", router);
app.use(express.static(getDistPath()));
// use SPA routing for non-api requests
app.get(/^\/(?!api).*/, spaFallback);
// catchall errors
app.use(genericServerError);
// start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map