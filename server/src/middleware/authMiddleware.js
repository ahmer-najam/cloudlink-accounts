import jwt from "jsonwebtoken";
import User from "../models/User.js";

const tokenFromHeader = (req) => {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Bearer ")) return null;
  return header.slice(7);
};

export const protect = async (req, res, next) => {
  try {
    const token = tokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret-key");
    const user = await User.findById(payload.id).select("-passwordHash");
    if (!user || !user.active) {
      return res.status(401).json({ message: "Invalid or inactive user" });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const allowRoles = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  return next();
};
