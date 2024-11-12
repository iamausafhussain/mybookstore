import React from 'react'
import "./Login.css"
import { Link } from 'react-router-dom'
import BookStoreLogoLight from '../../assets/BookStoreLogoLight.png'
import SalyImage from '../../assets/login/SalyImage.png'
import SignIn from './SignIn'

const Login = () => {
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
                        <h1 className='font-semibold text-3xl md:text-5xl'>Sign in to</h1>
                        <p className='font-medium text-xl md:text-3xl py-4'>Start your success story!</p>
                        <p className="font-normal sm:pt-4 md:pt-10">If you don’t have an account,</p>
                        <p className="font-normal py-2">You can <Link to="#" className='text-[#4D47C3]'>Register here!</Link></p>
                    </div>
                </div>

                <img src={SalyImage} alt="" className='saly-image absolute right-0 bottom-0 w-1/2 sm:1/2 md:w-1/2 lg:w-1/3' />
            </div>

            {/* Right Section */}

            <div className="right-login-section md:w-1/2 sm:w-full flex items-center justify-center">
                <SignIn />
            </div>

        </div>
    )
}

export default Login