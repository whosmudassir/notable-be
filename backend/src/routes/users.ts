import {
  signUp,
  login,
  getAuthenticatedUser,
  logout,
} from "../controllers/users";
import express from "express";
import { requiresAuth } from "../middleware/auth";

const router = express.Router();
router.get("/", requiresAuth, getAuthenticatedUser);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/logout", logout);

export default router;
