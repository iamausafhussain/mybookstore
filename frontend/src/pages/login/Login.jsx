import React, { useEffect } from 'react'
import "./Login.css"
import { Link, useNavigate } from 'react-router-dom'
import BookStoreLogoLight from '../../assets/BookStoreLogoLight.png'
import SalyImage from '../../assets/login/SalyImage.png'
import SignIn from './SignIn'
import { useAuth } from '../../context/AuthContext'

const Login = () => {

    const { currentUser } = useAuth();
    const navigate = useNavigate();

    if (currentUser) {
        navigate('/')
    }

    return (
        <div className='main-login font-poppins px-10 py-5'>

            {/* Left Section */}

            <div className="left-login-section relative">
                {/* First */}
                <div className='left-login-image flex'>
                    <img src={BookStoreLogoLight} alt="Logo" className='w-30 h-10' />
                </div>

                {/* Second */}
                <div className="left-login-sign w-full flex flex-col items-center">
                    <div className='left-login-wrapper mx-auto flex flex-col items-start justify-start'>
                        <h1 className='font-semibold text-xl md:text-3xl lg:text-5xl py-5'>Sign in to</h1>
                        <p className='font-medium text-lg sm:text-lg md:text-3xl sm:py-2 md:py-4'>Start your success story!</p>
                        <p className="font-normal sm:pt-4 text-xs md:text-sm md:pt-10">If you don’t have an account,</p>
                        <p className="font-normal py-1 text-xs md:text-sm">You can <Link to="/signup" className='text-[#4D47C3]'>Register here!</Link></p>
                    </div>
                </div>

                <img src={SalyImage} alt="" className='saly-image absolute right-0 bottom-0 sm:w-full md:w-1/2 lg:w-1/3' />
            </div>

            {/* Right Section */}

            <div className="right-login-section md:w-1/2 sm:w-full flex items-center justify-center">
                <SignIn />
            </div>

        </div>
    )
}

export default Login