const express = require("express");
const {
  createUser,
  loggedInUser,
  getUser,
} = require("../controller/UserController");
const UniqueFieldChecker = require("../controller/UniqueFieldChecker");
const authMiddleware = require("../middleware/authMiddleware");
const sendMail = require("../controller/SendOtp");

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loggedInUser);
router.get("/user", authMiddleware, getUser);
router.post("/send-otp", sendMail);
router.post("/check-unique", UniqueFieldChecker);

module.exports = router;
