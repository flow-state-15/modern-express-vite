import { Router } from "express";
import type { Request, Response } from "express";

// import controllers
import * as authController from "./authController.js";
import * as featureController from "./featureController.js";
import * as userController from "./userController.js";

// import middleware
import { requireAuth, requireAdmin } from "../middleware/index.js";

// import errors
import { apiNotFound } from "../errors/index.js";

const router = Router();

// debug route
router.get("/test", (req: Request, res: Response) => {
  res.send("Hello World from /api/test");
});

// ─── Auth routes (public) ────────────────────────────────
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);
router.post("/auth/logout", authController.logout);
router.get("/auth/me", authController.me);

// ─── Feature routes ──────────────────────────────────────
router.route("/feature")
  .get(featureController.handleFeature)
  .post(featureController.handleFeature)
  .put(featureController.handleFeature)
  .delete(featureController.handleFeature);

// ─── User routes (protected) ─────────────────────────────
router.route("/users")
  .get(requireAdmin, userController.getUsers)
  .post(requireAdmin, userController.createUser)
  .put(requireAuth, userController.updateUser)
  .delete(requireAdmin, userController.deleteUser);

// handle 404
router.use(apiNotFound);

export default router;
