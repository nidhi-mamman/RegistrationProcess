const nodemailer = require("nodemailer");

// Generate a random OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

const sendMail= async (req, res) => {
  const { email } = req.body;
  const otp = generateOtp(); // Generate OTP

  try {
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'donald92@ethereal.email',
            pass: '1Xnr1Rb3Fr24pUy8ug'
        }
    });
    const mailOptions = {
      from: "Nidhi ", // Sender address
      to: email, // Recipient's email
      subject: "Your OTP Code", // Subject
      text: `Your OTP code is: ${otp}`, // Plain text message
      html: `<b>Your OTP code is: ${otp}</b>`, // HTML message
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully!");

    res.json({ success: true, otp });
  } catch (error) {
    console.error("Error sending OTP email:", error);
    res.status(500).json({ success: false, message: "Error sending OTP" });
  }
};

module.exports=sendMail;