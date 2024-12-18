import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  color: {
    type: Number,
    required: false,
  },
  profileSetup: {
    type: Boolean,
    required: false,
  },
});

userSchema.pre("save", async function (next) {
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
