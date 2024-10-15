import sideimg from './background.jpg'
import { IoEyeOffOutline } from "react-icons/io5";
import { IoEyeOutline } from "react-icons/io5";
import '../../CSS/Login.css'
import { useState} from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../Context/ContextProvider';

const Login = () => {
    const [isVisible, setisVisible] = useState()
    const { USER_URL } = useAuth()
    const navigate = useNavigate()
    const formRef = useRef(null)
    const handleLogin = async (e) => {
        e.preventDefault()
        const form = new FormData(formRef.current)
        const formData = {}
        for (let [key, value] of form.entries()) {
            formData[key] = value;
        }
        const { email, password } = formData
        const emailPattern = /^[a-zA-Z0-9._]+@(gmail\.com|yahoo\.com)$/;
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,12}$/

        if (email.length === 0 || !emailPattern.test(email)) {
            toast("Email is required and must in the correct domain (only .com domain is allowed).")
            return;
        }

        if (password.length === 0 || !passwordPattern.test(password)) {
            toast("Password must be 8-12 characters long and must contain alphanumerics(uppercase or lowercase) or special charaters.")
            return;
        }

        try {
            const user = await axios.post(`${USER_URL}/login`, formData)
            localStorage.setItem('user', user.data.token)
            if (user.status === 200) {
                toast("Signed In successfully")
                navigate('/thankyou')
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast("Invalid Email or Password");
            } else {
                console.log(error);
                toast("Error during Signin");
            }
        }
    }

    return (
        <>
            <div className="container-section">
                <div className="form-sec">
                    <h1 className='text-4xl font-bold text-purple-600 mt-10'>Welcome Back</h1>
                    <h1 className='text-3xl font-bold text-purple-600 mt-5'>Login Form</h1>
                    <form ref={formRef}>
                        <div className='email-input'>
                            <label htmlFor="email" className='text-purple-600 font-semibold'>Email</label>
                            <input type="email" name='email' placeholder='Enter your Registered email' required />
                        </div>
                        <div className='password-input'>
                            <label htmlFor="password" className='text-purple-600 font-semibold'>Password</label>
                            <div className='flex'>
                                <input type={isVisible ? "text" : "password"} name='password' placeholder='Enter your Password' maxLength={12} required />

                                {
                                    isVisible ?
                                        <IoEyeOutline style={{ marginLeft: "-2rem", marginTop: "1rem", cursor: "pointer" }} onClick={() => setisVisible(!isVisible)} />
                                        :
                                        <IoEyeOffOutline style={{ marginLeft: "-2rem", marginTop: "1rem", cursor: "pointer" }} onClick={() => setisVisible(!isVisible)} />
                                }
                            </div>
                        </div>
                        <button className='loginbtn text-purple-600 font-bold' onClick={handleLogin}>Login</button>
                    </form>
                    <p className='text-purple-800 '>Not a user? <Link to='register' className='font-bold'>Register</Link></p>
                </div>
                <div className="img-section"><img src={sideimg} alt="" /></div>
            </div>
        </>
    )
}

export default Login