import jwt from "jsonwebtoken";

export const verifyToken = (request, response, next) => {
  try {
    const token = request.cookies["token"];
    if (!token) {
      return response.status(401).json({ error: "Authentication token not found" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (error, user) => {
      if (error) {
        return response.status(401).json({ error: "Invalid or expired token" });
      }
      request.user = user;
      next();
    });
  } catch (error) {
    return response.status(500).json({ error: "Internal Server Error" });
  }
};
