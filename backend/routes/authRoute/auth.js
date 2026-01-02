import express from "express";
import { getUserInfo, Login, Logout, Singup } from "../../controllers/authController/auth.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { uploadAvatar } from "../../controllers/multer/profilepicController.js";

const authRouter = express.Router();

authRouter.post("/auth/signup",Singup);
authRouter.post("/auth/login", Login);
authRouter.post("/auth/logout", Logout);
authRouter.get("/auth/user", authMiddleware, getUserInfo);
authRouter.post("/auth/upload-avatar", authMiddleware, uploadAvatar);


export default authRouter;