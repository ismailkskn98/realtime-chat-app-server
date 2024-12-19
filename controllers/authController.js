import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { compare } from "bcrypt";

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

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and password are required");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).send("User with the given email not found");
    }
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return response.status(401).send("Email or password is wrong");
    }
    const token = createToken(user.email, user._id);
    response.cookie("token", token, {
      maxAge,
      secure: false,
      samSite: "none",
    });
    response.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    response.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: "Unauthorized request" });
  }

  const id = request.user.id;
  try {
    const user = await User.findById(id).select("_id email firstName lastName image color profileSetup");
    if (!user) {
      return response.status(404).json({ error: "User not found" });
    }

    response.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};
