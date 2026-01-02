import express from "express";
import { googleAuth } from "../../controllers/authController/googleAuth.js";

const googleRouter = express.Router();

googleRouter.post("/auth/google", googleAuth);

export default googleRouter;