import { Router } from "express";
import usersRouter from "./users.mjs";
const router = Router();

router.use("/auth", usersRouter);

export default router;
