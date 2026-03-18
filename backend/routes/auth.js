import express from "express";
import User from "../models/User.js";
import { signToken } from "../lib/jwt.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password });
    const token = await signToken({
      id: user._id.toString(),
      email: user.email,
    });
    res.cookie("token", token, COOKIE_OPTIONS);
    res.status(201).json({ user });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const match = await user.comparePassword(password);
    if (!match)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = await signToken({
      id: user._id.toString(),
      email: user.email,
    });
    res.cookie("token", token, COOKIE_OPTIONS);
    res.json({ user });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/signout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Signed out" });
});

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
