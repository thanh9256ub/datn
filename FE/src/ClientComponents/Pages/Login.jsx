import React from 'react';
import './Css/Login.css';
import { Link } from 'react-router-dom';
const Login = () => {
    return (
        <div className='loginsignup'>
            <div className="loginsignup-container">
                <h1>Log In</h1>
                <div className="loginsignup-fields">
                    <input type="text" placeholder="Your Name" />
                    <input type="password" placeholder="Password" />
                </div>

                <button>Continue</button>
                <p className='loginsignup-login'>You don't have an account? <Link to="/signup"><span>Sign Up</span></Link></p>

            </div>
        </div>
    )
};

export default Login;