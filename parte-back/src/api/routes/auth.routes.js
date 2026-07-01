import { Router } from "express";
import { getAdminUser, loginView } from "../controllers/auth.controllers.js";

const router = Router();

router.get("/", loginView);

router.post("/", getAdminUser);

export default router