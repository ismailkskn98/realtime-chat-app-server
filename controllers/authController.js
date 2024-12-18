import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 gün
const secretKey = process.env.JWT_SECRET_KEY;

const createToken = (email, userId) => {
  return jwt.sign({ email, id: userId }, secretKey, { expiresIn: maxAge });
};

export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and password are required");
    }
    const user = await User.create({ email, password });
    const token = createToken(user.email, user._id);
    console.log(token);
    console.log("token: ", token);
    response.cookie("token", token, {
      maxAge,
      secure: false,
      samSite: "none",
    });
    response.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    response.status(500).send("Internal Server Error");
  }
};
