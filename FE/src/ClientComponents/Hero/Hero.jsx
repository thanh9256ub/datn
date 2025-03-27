import React, { useState } from 'react'
import './Hero.css'

import hand_icon from '../Assets/hand_icon.png'
import arrow_icon from '../Assets/arrow.png'
import hero_icon from '../Assets/hero_image.png'

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Alert } from 'bootstrap'
import { Spinner } from 'react-bootstrap'

const Hero = () => {
    
    const [successMessage, setSuccessMessage] = useState("");

    const [error, setError] = useState(null);



    // Thông báo thành công
    const message = localStorage.getItem("successMessage");
    if (message) {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
        localStorage.removeItem("successMessage");
    }

    return (
        <div className='hero'>
            {successMessage && (
                <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
                    {successMessage}
                </Alert>
            )}
            {error ? (
                <div className="text-danger">{error}</div>
            ) : (
                <div className="hero-left">
                    <h2>NEW ARRIVALS ONLY</h2>
                    <div>
                        <div className="hero-hand-icon">
                            <p>new</p>
                            <img src={hand_icon} alt="" />
                        </div>
                        <p>collections</p>
                        <p>for everyone</p>
                    </div>
                    <div className="hero-latest-btn">
                        <div>
                            Latest Collections
                        </div>
                        <img src={arrow_icon} alt="" />
                    </div>
                </div>
            )}
            <div className="hero-right">
                <img src={hero_icon} alt="" />
            </div>
            <ToastContainer />
        </div>
    )
}
export default Hero
