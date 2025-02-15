import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import UserModel from "../models/user.model.js";

export const authorized = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decodedToken = jwt.verify(token, JWT_SECRET);

    const user = await UserModel.findById(decodedToken.id);

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Unauthorized",
      error: error.message,
    });
  }
};
