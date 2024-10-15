const User = require("../model/UserSchema");

const UniqueFieldChecker= async (req, res) => {
  try {
    const { email, phoneNumber } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email: email }, { phoneNumber: phoneNumber }],
    }).exec();

    if (existingUser) {
      return res.status(200).json({
        exists: true,
      });
    } else {
      return res.status(200).json({
        exists: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      msg: "Internal Server error",
    });
  }
};

module.exports = UniqueFieldChecker;
