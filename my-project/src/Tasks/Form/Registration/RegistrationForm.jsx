import { useRef, useState } from "react";
import register from "./image.jpg";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import PhoneInput from 'react-phone-input-2'
import axios from 'axios'
// import emailjs from '@emailjs/browser';
import 'react-phone-input-2/lib/style.css'
// import { auth } from '../../Firebase/Firebase'
import "../../CSS/Registration.css";
// import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { useAuth } from '../../Context/ContextProvider';

const RegistrationForm = () => {
  const formRef = useRef(null);
  const [isVisible, setisVisible] = useState();
  const [cpassVisible, setcpassVisible] = useState();
  const [email, setEmail] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("")
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  // const [isPhoneNumberVerified] = useState(false)
  // const [phoneOtpInput, setPhoneOtpInput] = useState("")
  const { USER_URL } = useAuth()
  const navigate = useNavigate();
  const checkEmailExists = async (email, phone) => {
    try {
      const response = await axios.post(`${USER_URL}/check-unique`, {
        email: email,
        phoneNumber: phone
      });
      return response.data.exists;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isVerified) {
      toast("Please verify your emai with the OTP.");
      return;
    }

    let form = new FormData(formRef.current);
    form.append('phoneNumber', PhoneNumber);


    let formData = {};

    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }
    console.log("PHONE", PhoneNumber)

    const { firstName, lastName, phoneNumber, email, gender, password, confirmPassword } = formData;
    const namePattern = /^[A-Za-z]+$/;
    const contactPattern = /^[0-9]{10}$/;
    const emailPattern = /^[a-zA-Z0-9._]+@(gmail\.com|yahoo\.com)$/;
    const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,12}$/

    if (firstName.length === 0 || !namePattern.test(firstName)) {
      toast("First Name is required and can only contain letters.");
      return;
    }

    if (lastName.length === 0 || !namePattern.test(lastName)) {
      toast("Last Name is required and can only contain letters.");
      return;
    }

    const phoneNumberOnly = phoneNumber.replace(/\D/g, '').slice(-10);

    // Validate phone number
    if (phoneNumberOnly.length !== 10 || !contactPattern.test(phoneNumberOnly)) {
      toast("Contact number must have exactly 10 digits and contain only numbers.");
      return;
    }

    if (email.length === 0 || !emailPattern.test(email)) {
      toast("Email is required and must be in the  correact format (only .com domains are allowed).");
      return;
    }

    if (!gender) {
      toast("Gender is required");
      return;
    }

    if (password.length === 0 || !passwordPattern.test(password)) {
      toast("Password must be 8-12 characters long, contain uppercase and lowercase letters, a number, and a special character.");
      return;
    }

    if (!confirmPassword) {
      toast("Confirm password is required")
      return;
    }

    if (password !== confirmPassword) {
      toast("Passwords do not match");
      return;
    }

    const checkEmail = await checkEmailExists(email, phoneNumber)
    if (checkEmail) {
      toast('User with this Email or Phone Number already exists.Try using another account.')
      return;
    }

    try {
      const response = await axios.post(`${USER_URL}/signup`, formData)
      console.log(response)
      if (response.status === 201) {
        toast("SignedUp successfully")
        navigate('/')
      }
    } catch (error) {
      if (error.response && error.response.data.code === 11000) {
        if (error.response.data.keyPattern && error.response.data.keyPattern.email) {
          toast("This email is already registered. Please use a different email.");
        }
        if (error.response.data.keyPattern && error.response.data.keyPattern.phoneNumber) {
          toast("This phone number is already registered. Please use a different phone number.");
        }
      } else {
        console.log(error)
      }
    }
  };
  const sendOTP = () => {
    let otp_val = Math.floor(Math.random() * 10000)
    setGeneratedOtp(otp_val);
    let emailBody = `Your OTP is ${otp_val}`
    if (!email) {
      toast("Please enter an email address");
      return;
    }
    window.Email.send({
      SecureToken: "376045d4-d368-49ec-b242-5ebd8b5bd870",
      To: email,
      From: "nidhimamman3@gmail.com",
      Subject: "Email Verification with OTP",
      Body: emailBody
    }).then(() => {
      toast('Your OTP has been sent');
      setOtpModalVisible(true)
    }).catch((error) => {
      toast("Failed to send OTP. Please try again.");
      console.error(error);
    });

  }
  const verifyOTP = () => {
    if (otpInput === String(generatedOtp)) {
      setIsVerified(true);
      setOtpModalVisible(false);
      toast("OTP verified successfully!");
    } else {
      toast("Invalid OTP. Please try again.");
    }
  };

  // const captchaVerify = () => {

  //   if (!window.recaptchaVerifier) {
  //     window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
  //       size: "invisible",
  //       callback: () => {
  //         console.log("Recaptcha Verified");
  //       },
  //       "expired-callback": () => {
  //         console.error("Recaptcha expired, please refresh.");
  //       }
  //     })
  //   }
  // };

  // const sendOTPonPhone = async () => {
  //   if (!PhoneNumber) {
  //     toast("Please enter your phone number");
  //     return;
  //   }

  //   console.log("raw number:", PhoneNumber)

  //   captchaVerify()

  //   const appVerifier = window.recaptchaVerifier;

  //   try {
  //     const formattedPhoneNumber = `+${PhoneNumber.replace(/\D/g, '')}`;
  //     console.log("Formatted Phone Number:", formattedPhoneNumber);
  //     const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
  //     setPhoneOtpModalVisible(true)
  //     console.log(confirmationResult)
  //   } catch (error) {
  //     console.error("Error during signInWithPhoneNumber", error);
  //     toast("Error sending OTP. Please try again.");
  //   }
  // }


  return (
    <>
      <div className="p-10">
        <div className="container border-2 flex">
          <div className="image-section">
            <img src={register} alt="A man sitting in front of computer" />
          </div>
          <div className="form-section bg-slate-200 p-6">
            <form ref={formRef} onSubmit={handleSubmit} method="POST">
              <h1 className="text-2xl font-bold text-purple-800">
                Registration Form
              </h1>
              <div className="name flex gap-10 items-center justify-center  mt-8">
                <div className="firstName flex flex-col text-left">
                  <label htmlFor="firstName" className="text-purple-800">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    pattern="^[A-Za-z ]+$"
                    title="First name should only contain letters and spaces"
                    required
                  />
                </div>
                <div className="lastName flex flex-col text-left">
                  <label htmlFor="lastName" className="text-purple-800">
                    Last Name*
                  </label>
                  <input type="text" name="lastName" id="lastName" required />
                </div>
              </div>
              <div className="mobile flex flex-col text-left">
                <label htmlFor="phoneNumber" className="text-purple-800">
                  Contact no.*
                </label>
                <div className="flex items-center justify-between">
                  <PhoneInput
                    country={'in'}
                    value={PhoneNumber}
                    onChange={(value) => setPhoneNumber(value)}
                    name="phoneNumber"
                  />
                </div>
              </div>
              <div id="recaptcha"></div>
              <div className="email flex flex-col text-left">
                <label htmlFor="email" className="text-purple-800">
                  Email*
                </label>
                <div className="flex items-center gap-10 justify-between">
                  <input type="email" name="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  <button className="verify" onClick={sendOTP}>Verify</button>
                </div>
              </div>
              <div className="gender flex items-center justify-evenly text-left">
                <div>
                  <input type="radio" name="gender" value="male" />
                  <label htmlFor="male" className="text-purple-800">
                    Male
                  </label>
                </div>
                <div>
                  <input type="radio" name="gender" value="female" />
                  <label htmlFor="female" className="text-purple-800">
                    Female
                  </label>
                </div>
                <div>
                  <input type="radio" name="gender" value="prefernot" />
                  <label htmlFor="prefernot" className="text-purple-800">
                    Prefer not to say
                  </label>
                </div>
              </div>
              <div className="passw flex gap-10 items-center justify-center  mt-8">
                <div className="password flex flex-col text-left">
                  <label htmlFor="password" className="text-purple-800">
                    Password*
                  </label>
                  <div className="flex">
                    <input
                      type={isVisible ? "text" : "password"}
                      name="password"
                      id="password"
                      maxLength={12}
                      required
                    />
                    {isVisible ? (
                      <IoEyeOutline
                        style={{
                          marginLeft: "-2rem",
                          marginTop: "1rem",
                          cursor: "pointer",
                        }}
                        onClick={() => setisVisible(!isVisible)}
                      />
                    ) : (
                      <IoEyeOffOutline
                        style={{
                          marginLeft: "-2rem",
                          marginTop: "1rem",
                          cursor: "pointer",
                        }}
                        onClick={() => setisVisible(!isVisible)}
                      />
                    )}
                  </div>
                </div>
                <div className="cpassword flex flex-col text-left">
                  <label htmlFor="confirmPassword" className="text-purple-800">
                    Confirm Password*
                  </label>
                  <div className="flex">
                    <input
                      type={cpassVisible ? "text" : "password"}
                      name="confirmPassword"
                      id="cpassword"
                      maxLength={12}
                      required
                    />
                    {cpassVisible ? (
                      <IoEyeOutline
                        style={{
                          marginLeft: "-2rem",
                          marginTop: "1rem",
                          cursor: "pointer",
                        }}
                        onClick={() => setcpassVisible(!cpassVisible)}
                      />
                    ) : (
                      <IoEyeOffOutline
                        style={{
                          marginLeft: "-2rem",
                          marginTop: "1rem",
                          cursor: "pointer",
                        }}
                        onClick={() => setcpassVisible(!cpassVisible)}
                      />
                    )}
                  </div>
                </div>
              </div>
              <button
                className="submitbtn text-purple-800 font-bold"
                type="submit"
              >
                Submit
              </button>
            </form>
            <p className="text-purple-800 mt-3">
              Already a user?{" "}
              <Link to="/" className="font-bold">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      {otpModalVisible && (
        <div className="otp-modal fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="otp-box bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Enter OTP</h2>
            <input
              type="text"
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              className="border p-2 mb-4 w-full"
              placeholder="Enter the OTP"
            />
            <button className="bg-purple-800 text-white p-2 rounded" onClick={verifyOTP}>
              Verify OTP
            </button>
          </div>
        </div>
      )}
      {/* {phoneOtpModalVisible && (
        <div className="otp-modal fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="otp-box bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Enter Phone OTP</h2>
            <input
              type="text"
              value={phoneOtpInput}
              onChange={(e) => setPhoneOtpInput(e.target.value)}
              className="border p-2 mb-4 w-full"
              placeholder="Enter the OTP"
            />
            <button className="bg-purple-800 text-white p-2 rounded" >Verify Phone OTP</button>
          </div>
        </div>
      )} */}
    </>
  );
};

export default RegistrationForm;
