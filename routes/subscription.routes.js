import { Router } from "express";
import { authorized } from "../middlewares/auth.middleware.js";
import { createSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) =>
  res.send({ title: "GET All Subscriptions" })
);

subscriptionRouter.get("/:id", (req, res) =>
  res.send({ title: "GET Subscription Details" })
);

subscriptionRouter.post("/", authorized, createSubscription);

subscriptionRouter.put("/:id", (req, res) =>
  res.send({ title: "UPDATE Subscriptions" })
);

subscriptionRouter.delete("/:id", (req, res) =>
  res.send({ title: "DELETE Subscriptions" })
);

subscriptionRouter.get("/user/:id", (req, res) =>
  res.send({ title: "GET All user Subscriptions" })
);

subscriptionRouter.put("/:id/calcel", (req, res) =>
  res.send({ title: "CANCEL user Subscriptions" })
);

subscriptionRouter.get("/upcoming-renewals", (req, res) =>
  res.send({ title: "GET upcoming renewals" })
);

export default subscriptionRouter;
