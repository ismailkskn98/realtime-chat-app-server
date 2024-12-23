import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { compare } from "bcrypt";
import fs from "fs";
import path from "path";
import { __dirname } from "../utils/dirnameAndPathname.js";

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
        objectImage: user.objectImage,
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
    const user = await User.findById(id).select("_id email firstName lastName image objectImage color profileSetup");
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
        objectImage: user.objectImage,
        color: user.color,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: "Unauthorized request" });
  }
  try {
    const id = request.user.id;
    const { firstName, lastName, color, objectImage } = request.body;

    if (!firstName || !lastName) {
      return response.status(400).json({ error: "First name and last name are required" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        color,
        objectImage,
        profileSetup: true,
      },
      // new: true güncellenmiş veriyi döndürür
      // runValidators: true güncelleme işlemi sırasında şema doğrulamalarını çalıştırır
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return response.status(404).json({ error: "User not found" });
    }

    response.status(200).json({
      user: {
        id: updatedUser._id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        image: updatedUser.image,
        objectImage: updatedUser.objectImage,
        color: updatedUser.color,
        profileSetup: updatedUser.profileSetup,
      },
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

export const addProfileImage = async (request, response) => {
  /*
    request.file:  {
    fieldname: 'profile-image',
    originalname: '20230331_174935.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    destination: 'C:\\Users\\keskin\\Desktop\\realtime-chat-app\\realtime-chat-app-server\\public\\uploads\\profiles',
    filename: '20230331_174935-1734714413507-812064118.jpg',
    path: 'C:\\Users\\keskin\\Desktop\\realtime-chat-app\\realtime-chat-app-server\\public\\uploads\\profiles\\20230331_174935-1734714413507-812064118.jpg',
    size: 1431368
    }
  */
  if (!request.user) {
    return response.status(401).json({ error: "Unauthorized request" });
  }
  try {
    const id = request.user.id;
    const user = await User.findById(id);
    if (!user || !request.file) {
      return response.status(404).json({ error: "User or image not found" });
    }
    // public/uploads/profiles/WhatsApp Image 2024-06-01 at 18.37.13-1734722512777-737077278.jpeg
    const image = "uploads/profiles/" + request.file.filename;
    const updatedUser = await User.findByIdAndUpdate(id, { image });
    response.status(200).json({ image: updatedUser.image });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeProfileImage = async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: "Unauthorized request" });
  }
  try {
    const id = request.user.id;
    const user = await User.findById(id);
    if (!user || !user.image) {
      return response.status(404).json({ error: "User or image not found" });
    }

    const filePath = path.join(__dirname, "public", user.image);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Dosyayı sil
    }
    const updatedUser = await User.findByIdAndUpdate(id, { image: "" }, { new: true, runValidators: true });
    response.status(200).json({ user: { ...updatedUser } });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};
export const logout = async (request, response) => {
  try {
    response.cookie("token", "", {
      maxAge: 1,
      secure: false,
      samSite: "none",
    });
    response.status(200).json({ message: "Çıkış başarılı" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};
