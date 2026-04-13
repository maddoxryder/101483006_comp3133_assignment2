import jwt from "jsonwebtoken";

export function getUserFromReq(req) {
    const auth = req.headers.authorization || "";
    if (!auth.startsWith("Bearer ")) return null;

    const token = auth.replace("Bearer ", "").trim();
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch {
        return null;
    }
}
