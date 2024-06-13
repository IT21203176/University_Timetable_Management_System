const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

// Middleware to authenticate token and check if the user is an admin
const authenticateTokenAndAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error(err);
      return res.status(403).json({ message: "Forbidden" });
    }

    // Assuming the token includes the user's role
    if (user.role !== "Admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: You are not an admin." });
    }

    // Pass user data to the request object
    req.user = user;
    next();
  });
};

module.exports = authenticateTokenAndAdmin;
