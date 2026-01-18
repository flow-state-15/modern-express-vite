import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import routes from "./controllers/routes.js";
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../../frontend/dist");
app.use(express.static(distPath));
app.use(morgan("dev", { "immediate": true }));
app.use(express.json());
app.use(routes);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
//# sourceMappingURL=index.js.map