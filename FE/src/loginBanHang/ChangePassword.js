import React, { Component, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { getToken } from './service/Loginservice';
import { useAuth } from '../context/AuthContext';
import { Spinner } from 'react-bootstrap';
import { ListChangePassword } from './service/ChangePassword';


const ChangePassword = () => {

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");

    const { ChangePassword } = useAuth();

    const history = useHistory();

    const [loading, setLoading] = useState(false);

    const [usernameError, setUsernameError] = useState("");

    const [passwordError, setPasswordError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [showPassword1, setShowPassword1] = useState(false);

    const [showPassword2, setShowPassword2] = useState(false);

    const [oldPassword, setOldPassword] = useState("");

    const [newPassword1, setNewPassword1] = useState("");

    const [newPassword2, setNewPassword2] = useState("");

    // const handleLogin = (e) => {

    //     e.preventDefault();

    //     let isValid = true;

    //     if (!username.trim()) {
    //         setUsernameError("Vui lòng nhập mật khẩu cũ.");
    //         isValid = false;
    //     } else {
    //         setUsernameError("");
    //     }

    //     if (!password.trim()) {
    //         setPasswordError("Vui lòng nhập mật khẩu.");
    //         isValid = false;
    //     } else if (password.length < 6) {
    //         setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
    //         isValid = false;
    //     } else {
    //         setPasswordError("");
    //     }
    //     if (!isValid) {
    //         return;
    //     }

    //     if (!window.confirm('Bạn có chắc chắn muốn thay đổi mật khẩu?')) return;

    //     setLoading(true);



    //     getToken(username, password).then((response) => {
    //         console.log(response);

    //         if (response.status === 200) {
    //             login(response.data.data.token);
    //             localStorage.setItem("fullName", response.data.data.fullName);
    //             localStorage.setItem("role", response.data.data.role);
    //             localStorage.setItem("successMessage", "Đăng nhập thành công!");
    //             history.push('/admin/dashboard');
    //         }
    //         else {
    //             alert("Đăng nhập thất bại");
    //         }
    //     }).catch((error) => {

    //         console.log(error);
    //         alert("Đăng nhập thất bại");

    //     }).finally(() => {
    //         setLoading(false);
    //     })
    // };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword); // Hàm để thay đổi trạng thái hiển thị mật khẩu
    };

    const toggleShowPassword1 = () => {
        setShowPassword1(!showPassword1); // Hàm để thay đổi trạng thái hiển thị mật khẩu
    };

    const toggleShowPassword2 = () => {
        setShowPassword2(!showPassword2); // Hàm để thay đổi trạng thái hiển thị mật khẩu
    };

    const handleChangePassword = () => {
        if (newPassword1 === newPassword2) {
            ListChangePassword(oldPassword, newPassword1).then((response) => {
                if (response.status === 200) {
                    setOldPassword("")
                    setNewPassword1("")
                    setNewPassword2("")
                    alert(response.message)
                    window.location.href = '/admin/dashboard';
                }
            })
        }
        else alert("New password khong khop")
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

                            <h4>Đổi mật khẩu!</h4>
                            {/* <h6 className="font-weight-light">Sign in to continue.</h6> */}
                            <Form className="pt-3">
                                <Form.Label>Mật khẩu cũ</Form.Label>
                                <Form.Group className="d-flex search-field">

                                    <Form.Control placeholder="nhập mật khẩu cũ..." size="lg"
                                        type={showPassword ? 'text' : 'password'}
                                        className="form-control"
                                        id="passwordInput"
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                    <i
                                        type="button"
                                        onClick={toggleShowPassword}
                                        className="mdi mdi-eye"
                                        style={{
                                            position: 'absolute',
                                            top: '31%',
                                            right: '75px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {showPassword ? '' : ''}
                                    </i>
                                </Form.Group>
                                {usernameError && <p style={{ color: "red" }}>{usernameError}</p>} {/* Hiển thị lỗi username */}

                                <Form.Label>Mật khẩu mới</Form.Label>
                                <Form.Group className="d-flex search-field">
                                    <Form.Control placeholder="nhập mật khẩu mới..." size="lg"
                                        type={showPassword1 ? 'text' : 'password'}
                                        className="form-control"
                                        id="passwordInput"
                                        onChange={(e) => setNewPassword1(e.target.value)}
                                    />
                                    <i
                                        type="button"
                                        onClick={toggleShowPassword1}
                                        className="mdi mdi-eye"
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            right: '75px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {showPassword1 ? '' : ''}
                                    </i>
                                </Form.Group>
                                {passwordError && <p style={{ color: "red" }}>{passwordError}</p>} {/* Hiển thị lỗi password */}

                                <Form.Label>Xác nhận mật khẩu mới</Form.Label>
                                <Form.Group className="d-flex search-field">
                                    <Form.Control placeholder="nhập mật khẩu mới..." size="lg"
                                        type={showPassword2 ? 'text' : 'password'}
                                        className="form-control"
                                        id="passwordInput"
                                        onChange={(e) => setNewPassword2(e.target.value)}

                                    />
                                    <i
                                        type="button"
                                        onClick={toggleShowPassword2}
                                        className="mdi mdi-eye"
                                        style={{
                                            position: 'absolute',
                                            top: '68%',
                                            right: '75px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {showPassword2 ? '' : ''}
                                    </i>
                                </Form.Group>
                                {passwordError && <p style={{ color: "red" }}>{passwordError}</p>} {/* Hiển thị lỗi password */}

                                <div className="mt-3">
                                    {/* <Link className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn" to="/dashboard" >SIGN IN</Link> */}
                                    <Button className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                                        onClick={handleChangePassword}>
                                        Lưu</Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword