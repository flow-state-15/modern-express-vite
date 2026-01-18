// this folder contains route handler functions for routes defined in ./routes.ts.
// keeps routing logic separate from handler logic.

import type { Request, Response, NextFunction } from "express";

export function handleFeature(req: Request, res: Response, next: NextFunction) {
  console.log("trying to do the thing!")
  res.send("doing the thing!")
}
