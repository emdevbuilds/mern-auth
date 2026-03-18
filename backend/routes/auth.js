import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { signToken } from "../lib/jwt.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const COOKIE_OPTS = {
  httpOnly: true, // JS cannot read this cookie
  secure: process.env.NODE_ENV === "production", // HTTPS only in prod
  sameSite: "strict", // blocks CSRF attacks
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required." });
    if (password.length < 6)
      return res.status(400).json({ message: "Password min 6 chars." });
    if (await User.findOne({ email }))
      return res.status(409).json({ message: "Email already registered." });

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed });
    const token = await signToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    res.cookie("token", token, COOKIE_OPTS);
    res.status(201).json({ user }); // password auto-stripped via toJSON()
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/auth/signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required." });

    const user = await User.findOne({ email });
    // Use a generic message to prevent user enumeration attacks
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password." });

    const token = await signToken({
      id: user._id,
      email: user.email,
      name: user.name,
    });
    res.cookie("token", token, COOKIE_OPTS);
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// POST /api/auth/signout
router.post("/signout", (req, res) => {
  res.clearCookie("token", COOKIE_OPTS);
  res.json({ message: "Signed out." });
});

// GET /api/auth/me — protected, requires valid cookie
router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found." });
  res.json({ user });
});

export default router;
