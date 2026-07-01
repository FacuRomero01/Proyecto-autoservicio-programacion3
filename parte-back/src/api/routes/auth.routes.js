import { Router } from "express";
import { destroyLogin, getAdminUser, loginView } from "../controllers/auth.controllers.js";

const router = Router();

router.get("/", loginView);

router.post("/", getAdminUser);

router.post("/destroy", destroyLogin)

export default router