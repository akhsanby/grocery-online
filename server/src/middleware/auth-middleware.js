import { prismaClient } from "../app/database.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const token = req.get("Authorization");
  if (!token) {
    res
      .status(401)
      .json({
        errors: "Unauthorized",
      })
      .end();
  } else {
    const secretKey = "sangatRahasia";
    // Verify the token using jwt.verify method
    const isTokenVerified = jwt.verify(token, secretKey);

    const user = await prismaClient.user.findFirst({
      where: {
        token,
      },
    });
    if (!user || !isTokenVerified) {
      res
        .status(401)
        .json({
          errors: "Unauthorized",
        })
        .end();
    } else if (isTokenVerified) {
      req.user = user;
      next();
    }
  }
};
