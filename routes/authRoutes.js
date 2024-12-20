import { Router } from "express";
import { getUserInfo, login, signup, updateProfile, addProfileImage, removeProfileImage } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import upload from "../utils/multer.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/user-info", verifyToken, getUserInfo);
authRouter.patch("/update-profile", verifyToken, updateProfile);
authRouter.patch("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
authRouter.delete("/delete-profile-image", verifyToken, removeProfileImage);

export default authRouter;
