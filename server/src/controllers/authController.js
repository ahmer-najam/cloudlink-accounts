import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "dev-secret-key", {
    expiresIn: "7d"
  });

export const ensureDefaultAdmin = async () => {
  const count = await User.countDocuments();
  if (count > 0) return;

  const email = (process.env.ADMIN_EMAIL || "admin@business.local").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const hash = await bcrypt.hash(password, 10);

  await User.create({
    name: "System Admin",
    email,
    passwordHash: hash,
    role: "admin",
    active: true
  });

  console.log(`Default admin created: ${email}`);
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.active) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken(user);
    return res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, active: user.active }
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const me = async (req, res) => res.json(req.user);

export const updateProfile = async (req, res) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = String(email).toLowerCase();

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Current password is required" });
      }
      const ok = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!ok) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    });
  } catch (error) {
    return res.status(400).json({ message: "Failed to update profile", error: error.message });
  }
};
