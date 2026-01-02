import { OAuth2Client } from "google-auth-library";
import authModel from "../../models/authdb/auth.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { token, password } = req.body; 

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub, email, name } = payload;

    let user = await authModel.findOne({ email });

    if (!user) {
      if (!password) {
        return res.status(200).json({
          status: "NEW_USER",
          message: "Please set a password to complete signup",
          email,
          name,
          googleId: sub,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user = await authModel.create({
        name,
        email,
        password: hashedPassword,
        googleId: sub,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "SUCCESS",
      message: "Google login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google auth error:", error.message);
    res.status(500).json({ message: "Google Authentication Failed" });
  }
};
