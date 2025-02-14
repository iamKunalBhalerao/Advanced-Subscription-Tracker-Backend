import express from "express";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(3000, () => {
  console.log("Subscription Tracker API is running on http://localhost:3000");
});

export default app;
 