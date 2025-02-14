import express from "express";
import { PORT } from "./config/env.js";
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auuth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";

const app = express();
app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);

app.listen(PORT, () => {
  console.log(
    `Subscription Tracker API is running on http://localhost:${PORT}`
  );
});

export default app;
