import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { getToken } from './service/Loginservice';
import { useAuth } from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';
import { ListForgotpassword } from './service/ForgotPassword';


const ForgotPassword = () => {

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const { login } = useAuth();

    const history = useHistory();

    const [loading, setLoading] = useState(false);

    const [usernameError, setUsernameError] = useState("");

    const [passwordError, setPasswordError] = useState("");

     const [email, setEmail] = useState("");

    const handleLogin = (e) => {

        e.preventDefault();

        let isValid = true;

        if (!username.trim()) {
            setUsernameError("Vui lòng nhập tên đăng nhập.");
            isValid = false;
        } else {
            setUsernameError("");
        }

        if (!password.trim()) {
            setPasswordError("Vui lòng nhập email.");
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
            isValid = false;
        } else {
            setPasswordError("");
        }
        if (!isValid) {
            return;
        }

        if (!window.confirm('Bạn có chắc chắn muốn đăng nhập?')) return;

        setLoading(true);



        getToken(username, password).then((response) => {
            console.log(response);

            if (response.status === 200) {
                login(response.data.data.token);
                localStorage.setItem("fullName", response.data.data.fullName);
                localStorage.setItem("role", response.data.data.role);
                localStorage.setItem("successMessage", "Đăng nhập thành công!");
                history.push('/admin/dashboard');

            }
            else {
                alert("Đăng nhập thất bại");
            }
        }).catch((error) => {

            console.log(error);
            alert("Đăng nhập thất bại");

        }).finally(() => {
            setLoading(false);
        })
    };
    const handleForgotPassword = () => {
            ListForgotpassword(email).then((response) => {
                if (response.status === 200) {
                    alert(response.message)
                    window.location.href = '/login-nhan-vien';
                }
            })
        
    }

    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <Spinner animation="border" role="status" />
                    <span>Đang xử lý...</span>
                </div>
            )}
            <div className="d-flex align-items-center auth px-0">
                <div className="row w-100 mx-0">
                    <div className="col-lg-6 mx-auto">
                        <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                            <div className="brand-logo">
                                {/* <img src={require("../../assets/images/logo.svg")} alt="logo" /> */}
                            </div>

                            <h4>Quên mật khẩu?</h4>
                            <h6 className="font-weight-light">Nhập địa chỉ email để lấy lại mật khẩu</h6>
                            <hr></hr>
                            <Form className="pt-3">
                                {/* <Form.Label>Tên đăng nhập</Form.Label>
                                <Form.Group className="d-flex search-field">
                                    <Form.Control type="email" placeholder="nhập username..." size="lg" className="h-auto"
                                        onChange={(e) => setUsername(e.target.value)} />
                                </Form.Group>
                                {usernameError && <p style={{ color: "red" }}>{usernameError}</p>} Hiển thị lỗi username */}

                                <Form.Label>Địa chỉ email</Form.Label>
                                <Form.Group className="d-flex search-field">
                                    <Form.Control type="email" placeholder="nhập email..." size="lg" className="h-auto"
                                        onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>
                                {passwordError && <p style={{ color: "red" }}>{passwordError}</p>} {/* Hiển thị lỗi password */}

                                <div className="mt-3">
                                    {/* <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/dashboard" >SIGN IN</Link> */}
                                    <Button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                                        onClick={handleForgotPassword}>
                                        Gửi</Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword