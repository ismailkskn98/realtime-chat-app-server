import { Router } from "express";
import { getUserInfo, login, signup, updateProfile } from "../controllers/authController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/user-info", verifyToken, getUserInfo);
authRouter.patch("/update-profile", verifyToken, updateProfile);

export default authRouter;
