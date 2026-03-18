import { SignJWT, jwtVerify } from "jose";

// jose requires a Uint8Array key, not a plain string
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const ALG = "HS256";

// Create a signed JWT with any payload — expires in 7 days
export async function signToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

// Verify JWT — throws if invalid or expired
export async function verifyToken(token) {
  const { payload } = await jwtVerify(token, SECRET);
  return payload; // { id, email, name, iat, exp }
}
