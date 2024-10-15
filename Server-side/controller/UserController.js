const bcrypt = require("bcryptjs");
const User = require("../model/UserSchema");
const jwt = require("jsonwebtoken");

const createUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      email,
      gender,
      password,
      confirmPassword,
    } = req.body;

    const namePattern = /^[A-Za-z]+$/;
    const contactPattern = /^\+?[0-9]{10,15}$/;
    const emailPattern = /^[a-zA-Z0-9._]+@(gmail\.com|yahoo\.com)$/;
    const passwordPattern =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,12}$/;

    if (
      !firstName ||
      !lastName ||
      !phoneNumber ||
      !email ||
      !gender ||
      !password ||
      !confirmPassword
    ) {
      return res.status(500).json({
        msg: "Please enter all the fields",
      });
    }

    if (!namePattern.test(firstName)) {
      return res.status(500).json({
        msg: "First name can only contain alphabets!!",
      });
    }

    if (!namePattern.test(lastName)) {
      return res.status(500).json({
        msg: "Last name can only contain alphabets!!",
      });
    }

    if (!contactPattern.test(phoneNumber)) {
      return res.status(500).json({
        msg: "Contact no. should only contain numbers!!",
      });
    }

    if (!emailPattern.test(email)) {
      return res.status(500).json({
        msg: "Email should be in proper format with only .com domain allowed!!",
      });
    }

    if (!passwordPattern.test(password)) {
      return res.status(500).json({
        msg: "Password must contain 8-12 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(500).json({
        msg: "Passwords do not match",
      });
    }

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
      return res.status(500).json({
        msg: "User with this email already exists.",
      });
    }

    const encPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      gender: gender,
      password: encPassword,
      confirmPassword: confirmPassword,
    });

    if (user) {
      return res.status(201).json({
        msg: "SignedUp successfully",
        user: user,
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: error,
    });
  }
};

const loggedInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({
        msg: "Invalid Email or Password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token =jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "999999d" }
      );
      return res.status(200).json({
        msg: "Signed In successfully",
        token:token,
        userId: user._id
      });
    } else {
      return res.status(400).json({
        msg: "Invalid Email or Password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server error",
    });
  }
};

const getUser=async(req,res)=>{
  try {
    const userData=req.user
    console.log(userData)
    return res.status(200).json({
      userData
    })
  } catch (error) {
    console.log(error)
  }
}
module.exports = {
  createUser,
  loggedInUser,
  getUser
};
