import express from "express";
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(3000, () => {
  console.log("server is on PORT:3000");
});
