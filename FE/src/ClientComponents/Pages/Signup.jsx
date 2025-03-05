import React from 'react'
import { Link } from 'react-router-dom';
import './Css/Signup.css'
const Signup = () => {
    return (
        <div className='signup'>
            <div className="signup-container">
                <h1>Sign Up</h1>
                <div className="signup-fields">
                    <input type="text" placeholder="Your Name" />
                    <input type="email" placeholder="Email Address" />
                    <input type="text" placeholder="Phone Number" />
                    <div className="gender-selection">
                        <select name="gender">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <input type="password" placeholder="Password" />
                </div>

                <button>Continue</button>
                <p className='signup-login'>Already have an account?  <Link to="/login"><span>Login</span></Link></p>

            </div>
        </div>
    )
}
export default Signup