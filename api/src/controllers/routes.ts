import { Router } from "express";
import type { Request, Response } from "express";

// import controllers
import * as featureController from "./featureController.js";

// import errors
import { apiNotFound } from "../errors/index.js";

const router = Router();

// debug route
// note this route is simple and does not use chaining
router.get("/test", (req: Request, res: Response) => {
  res.send("Hello World from /api/test");
});

// define api routes
// route chaining for dev ergonomics
router.route("/feature")
  .get(featureController.handleFeature)
  .post(featureController.handleFeature)
  .put(featureController.handleFeature)
  .delete(featureController.handleFeature);


// handle 404
router.use(apiNotFound);

export default router;
