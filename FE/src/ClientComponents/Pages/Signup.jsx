import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import './Css/Signup.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import { registerCustomer } from '../../loginBanHang/service/Loginservice';
import { Spinner } from 'react-bootstrap';
const Signup = () => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState(1);
    const [fullName, setfullName] = useState("");
    const [birthDate, setBirthDate] = useState("");

    const history = useHistory();

    const [loading, setLoading] = useState(false);

    const handSignup = (e) => {

        if (!window.confirm('Bạn có chắc chắn muốn đăng kí?')) return;

        setLoading(true);

        e.preventDefault();

        registerCustomer(email, phone, fullName, gender, birthDate).then((response) => {
            console.log(response);
            if (response.data.status === 200) {
                history.push("/login");
            }
            else {
                alert(response.data.message);
            }
        }).catch((error) => {
            alert("Đăng ký thất bại");
        }).finally(() => {
            setLoading(false);
            history.push("/login")
        })
    }

    return (
        <div className='signup'>
            {loading && (
                <div className="loading-overlay">
                    <Spinner animation="border" role="status" />
                    <span>Đăng kí...</span>
                </div>
            )}
            <div className="signup-container">
                <h1>Sign Up</h1>
                <div className="signup-fields">
                    <input type="text" placeholder="Your Name" onChange={(e) => setfullName(e.target.value)} />
                    <input type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder="Phone Number" onChange={(e) => setPhone(e.target.value)} />
                    <div className="gender-selection">
                        <select name="gender" onChange={(e) => setGender(e.target.value === "0" ? 0 : 1)}>
                            <option value="1">Male</option>
                            <option value="0">Female</option>
                        </select>
                    </div>
                    <input type="date" onChange={(e) => setBirthDate(e.target.value)} />
                </div>

                <button onClick={handSignup}>Continue</button>
                <p className='signup-login'>Already have an account?  <Link to="/login"><span>Login</span></Link></p>

            </div>
        </div>
    )
}
export default Signup