const jwt = require("jsonwebtoken");
const User=require("../model/UserSchema")

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      msg: "Unauthorized HTTP Token",
    });
  }
  const jwtToken = token.replace("Bearer", "").trim();
  console.log(jwtToken);
  try {
    const isVerified = jwt.verify(jwtToken,process.env.JWT_SECRET);
    console.log("Token verified, payload:", isVerified); 
    const userData = await User.findOne({ email: isVerified.email }).select({
      password: 0
    });
    req.user=userData
    req.token=token
    req.userId=userData._id
    next();
  } catch (error) {
    console.log(error)
    return res.status(400).json({
      msg: "Unauthorized invalid token",
    });
  }
};

module.exports = authMiddleware;
