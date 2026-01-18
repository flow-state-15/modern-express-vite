import express from "express";
import morgan from "morgan";
// import utils
import { getDistPath } from "./utils/index.js";
// import routes
import router from "./controllers/routes.js";
// import errors
import { genericServerError, spaFallback } from "./errors/index.js";
const app = express();
console.log(getDistPath());
app.use(express.static(getDistPath()));
app.use(morgan("dev"));
app.use(express.json());
app.use("/api", router);
// use SPA routing for non-api requests
app.use(spaFallback);
// catchall errors
app.use(genericServerError);
// start server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map