// catch-alls for generic error handling
// organize and segregate for complex error handling scenarios

import type { Request, Response, NextFunction } from "express";
import path from "path";

// 500 fallback
export function genericServerError(err: unknown, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error", error: err });
};

// /api 404s
export function apiNotFound(req: Request, res: Response) {
  res.status(404).json({ error: "Not Found" });
};

// spa fallback
export function createSpaFallback(distPath: string) {
  return (req: Request, res: Response) => {
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) {
        console.error("spa fallback sendFile error", err);
      }
    });
  };
};