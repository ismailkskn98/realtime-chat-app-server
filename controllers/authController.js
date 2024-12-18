import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const expiresIn = "3d"; // 3 gün
const secretKey = process.env.JWT_SECRET_KEY;

const createToken = (email, userId) => {
  return jwt.sign({ email, id: userId }, secretKey, { expiresIn });
};

export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) {
      return response.status(400).send("Email and password are required");
    }
    const user = await User.create({ email, password });
    const token = createToken(email, user._id);
    response.cookie("token", token, {
      maxAge: expiresIn,
      secure: true,
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
    response.status(500).send("Internal Server Error: ", error);
  }
};
