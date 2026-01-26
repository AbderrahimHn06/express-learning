import { Router } from "express";

import driversRouter from "./drivers.mjs";
import ordersRouter from "./orders.mjs";

const router = Router();

router.use("/drivers", driversRouter);
router.use("/orders", ordersRouter);

export default router;
