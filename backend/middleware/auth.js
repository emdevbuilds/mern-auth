import { verifyToken } from "../lib/jwt.js";

// Attach to any route that requires authentication.
// Reads the httpOnly cookie, verifies it, populates req.user.
export async function protect(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "Not authenticated." });
    }
    const payload = await verifyToken(token);
    req.user = payload; // { id, email, name, iat, exp }
    next();
  } catch {
    return res.status(401).json({ message: "Token invalid or expired." });
  }
}
