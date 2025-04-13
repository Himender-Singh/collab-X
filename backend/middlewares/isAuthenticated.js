import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log("token", token);

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decoded.userId;
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(401).json({
      message: "Token is invalid or expired",
      success: false,
    });
  }
};

export default isAuthenticated;
