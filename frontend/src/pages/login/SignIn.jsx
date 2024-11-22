import React, { useState } from 'react'
import { Button as HeadlessButton } from '@headlessui/react'
import { useNavigate } from 'react-router-dom'
import SignInApple from "../../assets/login/SignInApple.png"
import SignInFacebook from "../../assets/login/SignInFacebook.png"
import SignInGoogle from "../../assets/login/SignInGoogle.png"
import AppleLogo from "../../assets/login/AppleLogo.png"
import FacebookLogo from "../../assets/login/FacebookLogo.png"
import GoogleLogo from "../../assets/login/GoogleLogo.png"
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import "./Login.css";
import { useAuth } from '../../context/AuthContext'
import { GoogleAuthProvider } from 'firebase/auth'
import { useSnackbar } from '../../context/SnackbarContext'

const SignIn = () => {

    const { loginUser, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    const showSnackbar = useSnackbar();

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("")

    // Snackbar state variable declaration
    const [snackSeverity, setSnackSeverity] = useState('info')
    const [snackState, setSnackState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'center',
    });
    const { vertical, horizontal, open } = snackState;

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackState({ ...snackState, open: false });
    };

    const onSubmit = async () => {
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
        // const passwordPattern =
        //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        try {
            if (!email.match(emailPattern)) {
                 showSnackbar(`Invalid Email!`, 'error');
            }
            else {

                await loginUser(email, password)
                    .then((result) => {
                        console.log(result)
                        showSnackbar(`Welcome ${result.user.email}`, 'success')
                        navigate("/")

                    }).catch(() => {
                        showSnackbar(`Invalid credential`, 'warning')
                        
                    });
            }

        } catch (error) {
            showSnackbar(`Error: ${error}`, 'error')
        }

    }

    const handleGoogleAuth = async () => {
        try {
            await signInWithGoogle()
                .then(result => {
                    const credential = GoogleAuthProvider.credentialFromResult(result)
                    const token = credential.accessToken

                    const user = result.user

                    console.log('token:', token)
                    console.log('credential:', credential)
                    console.log('user:', user)
                    
                    showSnackbar(`Welcome ${user.displayName}`, 'error');
                    navigate("/");
                    
                })


        } catch (error) {
            showSnackbar(`Error Occured using Google Auth: ${error}`, 'error');
        }
    }

    const handleFacebookAuth = async () => {
        showSnackbar('This is from facebook!', 'success');
    }

    const handleAppleAuth = async () => {
        showSnackbar('This is from Apple', 'warning')
    }

    return (
        <div className='login'>
            <div className='login-wrapper w-20 flex flex-col items-start'>

                {/* Sign in */}

                <h1 className='login-signin-text font-medium text-xl md:text-3xl py-5'>Sign in</h1>

                {/* Email */}

                <div className='py-10 login-input'>
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        id="hs-leading-icon"
                        name="hs-leading-icon"
                        className="input bg-[#F0EFFF] h-14 text-[#A7A3FF] placeholder-[#A7A3FF] py-3 px-4 ps-5 block rounded-md text-poppins font-normal disabled:opacity-50 disabled:pointer-events-none outline-none"
                        placeholder="Enter email or username" />
                </div>

                {/* Password */}
                <div className="login-input">
                    <div className="relative login-password-input">

                        <input value={password} onChange={(e) => setPassword(e.target.value)} type={`${showPassword ? 'text' : 'password'}`} id="hs-trailing-icon" name="hs-trailing-icon" className="passsword-input h-14 bg-[#F0EFFF] text-[#A7A3FF] placeholder-[#A7A3FF] py-3 px-4 ps-5 block text-poppins font-normal rounded-md disabled:opacity-50 disabled:pointer-events-none outline-none" placeholder="Password" />

                        <div onClick={() => { setShowPassword(!showPassword) }} className="absolute inset-y-0 end-0 flex items-center z-20 pe-4">

                            {
                                showPassword ?
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 shrink-0 text-[#A7A3FF] hover:cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg> :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 shrink-0 text-[#A7A3FF] hover:cursor-pointer">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>

                            }

                        </div>
                    </div>
                </div>


                <div className='login-forgot-password pt-4'>
                    <p className='font-poppins font-light text-[#B5B5B5] text-end text-xs md:text-sm'>Forgot Password?</p>
                </div>

                <div className="login-button text-center pt-10">
                    <HeadlessButton onClick={onSubmit} className="w-full h-14 flex justify-center items-center gap-2 rounded-md bg-[#4D47C3] py-1.5 px-3 font-medium text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-[#3833a0] focus:outline-1 focus:outline-white">
                        <p>Login</p>
                    </HeadlessButton>
                </div>

                {/* O Auth Login Section */}

                <div className='w-full py-10 flex flex-col items-center justify-center'>
                    <p className='font-medium text-[#B5B5B5] text-xs md:text-sm'>or continue with</p>

                    {/* Large Devices */}

                    <div className='o-auth-login-large flex flex-col items-center justify-center'>
                        <button onClick={handleAppleAuth} className='pt-4'>
                            <img src={SignInApple} alt="O Auth Login" className='w-60 object-cover' />
                        </button>
                        <button onClick={handleGoogleAuth} className='pt-4'>
                            <img src={SignInGoogle} alt="O Auth Login" className='w-60 object-cover' />
                        </button>
                        <button onClick={handleFacebookAuth} className='pt-4'>
                            <img src={SignInFacebook} alt="O Auth Login" className='w-60 object-cover' />
                        </button>
                    </div>

                    {/* Mobile Devices */}

                    <div className='o-auth-login-small items-center justify-center pt-5'>
                        <button>
                            <img onClick={handleAppleAuth} src={AppleLogo} alt="O Auth Login" />
                        </button>
                        <button onClick={handleGoogleAuth} className='pl-4'>
                            <img src={GoogleLogo} alt="O Auth Login" />
                        </button>
                        <button onClick={handleFacebookAuth} className='pl-4'>
                            <img src={FacebookLogo} alt="O Auth Login" />
                        </button>
                    </div>

                </div>
            </div>

        </div>
    )
}

export default SignIn