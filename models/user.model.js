import mongoose from "mongoose";

const Schema = mongoose.Schema;
const model = mongoose.model;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is Required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "User Email is Required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "User Password is Required"],
      minLength: 6,
    },
  },
  { timestamps: true }
);

const UserModel = model("Users", userSchema);

export default UserModel;
