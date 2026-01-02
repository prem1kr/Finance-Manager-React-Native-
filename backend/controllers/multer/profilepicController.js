import multer from "multer";
import path from "path";
import fs from "fs";
import authModel from "../../models/authdb/auth.js";

const uploadDir = path.join(process.cwd(), "public/uploads/avatars");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, req.userId + ext);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed!"), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter });

export const uploadAvatar = [
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.userId) return res.status(401).json({ message: "Unauthorized" });
      if (!req.file) return res.status(400).json({ message: "No file uploaded" });

      const avatarUrl = `/uploads/avatars/${req.file.filename}`;

      const updatedUser = await authModel.findByIdAndUpdate(
        req.userId,
        { avatar: avatarUrl },
        { new: true }
      ).select("-password -__v");

      res.json({ message: "Avatar updated", data: updatedUser });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
