import { Router } from "express";
import { orders } from "../data/orders.js";

const router = Router();

const authMiddleware = (req, res, next) => {
  req.sessionStore.get(req.sessionID, (error, session) => {
    if (
      error ||
      !session ||
      session.role !== "manager" ||
      session.user_id !== req.params.user_id
    ) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    next();
  });
};

router.get("/:user_id", authMiddleware, (req, res) => {
  res.status(200).send(orders);
});

export default router;
