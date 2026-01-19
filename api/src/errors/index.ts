// catch-alls for generic error handling
// organize and segregate for complex error handling scenarios

// types
import type { NextFunction, Request, Response } from "express";

// core deps
import path from "path";

// import utils
import { getDistPath } from "../utils/index.js";

const distPath = getDistPath();

// 500 fallback
export function genericServerError(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  //!! refine to not expose the error to the client
  res.status(500).json({ message: "Internal Server Error", error: err });
}

// /api 404s
export function apiNotFound(req: Request, res: Response) {
  res.status(404).json({ error: "Not Found" });
}

// spa fallback for frontend routing
export function spaFallback(req: Request, res: Response) {
  res.sendFile(path.join(distPath, "index.html"));
}