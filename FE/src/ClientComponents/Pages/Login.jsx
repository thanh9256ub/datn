import React, { useState } from 'react';
import './Css/Login.css';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTokenCustomer } from '../../loginBanHang/service/Loginservice';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Alert, Spinner } from 'react-bootstrap';



const Login = () => {


    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const { login } = useAuth();

    const history = useHistory();

    const [loading, setLoading] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");

    const [error, setError] = useState(null);

    const handLogin = (e) => {
        if (!window.confirm('Bạn có chắc chắn muốn đăng nhập?')) return;
        setLoading(true);
        e.preventDefault();

        getTokenCustomer(email, password).then((response) => {
            console.log(response);

            if (response.status === 200) {
                login(response.data.data.token);
                localStorage.setItem("email", response.data.data.email);
                localStorage.setItem("role", response.data.data.role);
                localStorage.setItem("successMessage", "Đăng nhập thành công!");
                history.push("/");
            }
            else {
                alert("Đăng nhập thất bại");
            }
        }).catch((error) => {
            alert("Đăng nhập thất bại");
        }).finally(() => {
            setLoading(false);
        })
    }

    return (
        <div className='loginsignup'>
            {loading && (
                <div className="loading-overlay">
                    <Spinner animation="border" role="status" />
                    <span>Đăng nhập...</span>
                </div>
            )}
            <div className="loginsignup-container">
                <h1>Đăng nhập</h1>
                
                    <div className="loginsignup-fields">
                        <input type="email" placeholder="Your email" onChange={(e) => setEmail(e.target.value)} />
                        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                <button onClick={handLogin}>Continue</button>
                <p className='loginsignup-login'>You don't have an account?  <Link to="/signup"><span >Sign Up</span></Link></p>

            </div>s
        </div>
    )
};

export default Login;