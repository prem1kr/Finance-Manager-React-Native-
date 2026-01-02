import authModel from "../../models/authdb/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export const Singup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await authModel.findOne({ email });
    if (user) {
      console.log("User already present in database. Please login.");
      return res.status(400).json({ message: "User already exists, please login" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = await authModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ email: createUser.email, id: createUser._id },
     process.env.SECRET_KEY,{ expiresIn: "1h" }
    );

    console.log(`User created successfully: ${createUser.email}`);
    res.status(201).json({message: "User successfully created",user: createUser,token});

  } catch (error) {
    console.error("Error during signup process:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existUser = await authModel.findOne({ email });
    if (!existUser) {
      return res.status(400).json({ message: "User not found, please sign up" });
    }

    const isPasswordValid = await bcrypt.compare(password, existUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { email: existUser.email, id: existUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      userId: existUser._id, 
      user: {
        id: existUser._id,
        name: existUser.name,
        email: existUser.email,
      }
    });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



export const Logout = (req, res) => {
  try {
    res.clearCookie("token");

    console.log("User logout successful");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error during logout process:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


export const getUserInfo = async (req, res) => {
  try {
    const userId = req.userId; 

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await authModel.findById(userId).select("-password -__v");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ data: user });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};