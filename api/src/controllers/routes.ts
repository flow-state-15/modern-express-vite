import { Router } from "express";
import type { Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";

const routes = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, "../../../frontend/dist");

routes.get("/", (req: Request, res: Response) => {
  console.log("new connection at root route");
  res.sendFile(path.join(distPath, "index.html"));
});

routes.get("/test", (req: Request, res: Response) => {
  res.send("Hello World");
});

routes.get("/path", (req, res) => {
    console.log(path)
    console.log("trying to send path")
    res.json(path)
})

export default routes;
