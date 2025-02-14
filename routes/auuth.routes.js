import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-up", (req, res) => {
  res.send("Sign-In");
});

authRouter.post("/sign-in", (req, res) => {
  res.send("Sign-Up");
});

authRouter.post("/sign-out", (req, res) => {
  res.send("Sign-Out");
});

export default authRouter;
 