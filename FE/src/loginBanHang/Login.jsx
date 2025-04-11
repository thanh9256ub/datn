import React, { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShopContext } from '../ClientComponents/Context/ShopContext';
import { Typography, Input, Button, Spin, Space, Alert, notification, Modal } from 'antd';
import { getToken } from './service/Loginservice';
import { getTokenCustomer } from './service/Loginservice';
import { ArrowLeftOutlined } from '@ant-design/icons';
import logo from '../assets/images/logo_h2tl.png'

const { Title, Text } = Typography;
const { confirm } = Modal;

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login: authLogin } = useAuth();
    const { isGuest } = useContext(ShopContext);
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleForgotPassword = (e) => {
        e.preventDefault();
        window.location.href = '/quen-mat-khau';
    }


    const handleLogin = async (e) => {

        try {
            // Thử đăng nhập với tư cách khách hàng trước
            try {
                const customerResponse = await getTokenCustomer(username, password);
                if (customerResponse.status === 200) {
                    const { token, email, fullName, role, customerId } = customerResponse.data.data;
                    console.log("Data customer: ", customerResponse.data.data)

                    authLogin(token, {
                        email,
                        fullName,
                        role,
                        customerId
                        // id: customerId nếu có
                    });

                    notification.success({
                        message: 'Đăng nhập thành công',
                        description: 'Chào mừng bạn quay trở lại!',
                        placement: 'topRight',
                        duration: 2
                    });
                    history.push('/');
                    return;
                }
            } catch (customerError) {
                console.log('Không phải tài khoản khách hàng, thử đăng nhập nhân viên');
            }

            const employeeResponse = await getToken(username, password);
            if (employeeResponse.status === 200) {
                const { token, idEmployee, fullName, role } = employeeResponse.data.data;

                authLogin(token, {
                    id: idEmployee,
                    fullName,
                    role
                });

                notification.success({
                    message: 'Đăng nhập thành công',
                    description: 'Chào mừng bạn quay trở lại admin!',
                    placement: 'topRight',
                    duration: 2
                });

                if (role === 'ADMIN' || role === 'EMPLOYEE') {
                    history.push('/admin/dashboard');
                } else {
                    history.push('/');
                }
            } else {
                throw new Error('Đăng nhập thất bại');
            }
        } catch (error) {
            setError('Tên đăng nhập hoặc mật khẩu không đúng');
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        history.push('/')
        // history.goBack(); // Hoặc history.push('/') nếu muốn về trang chủ
    };

    const [errors, setErrors] = useState({
        username: '',
        password: '',
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!username.trim()) {
            newErrors.username = 'Tên đăng nhập không được để trống';
            isValid = false;
        } else {
            newErrors.username = '';
        }

        if (!password.trim()) {
            newErrors.password = 'Mật khẩu không được để trống';
            isValid = false;
        } else {
            newErrors.password = '';
        }

        setErrors(newErrors);
        return isValid;
    };

    const showConfirm = () => {
        const isValid = validateForm();

        if (isValid) {
            confirm({
                title: 'Xác nhận đăng nhập',
                content: 'Bạn có chắc chắn muốn đăng nhập vào hệ thống?',
                okText: 'Đồng ý',
                cancelText: 'Hủy bỏ',
                centered: true,
                onOk() {
                    handleLogin();
                },
                onCancel() {
                    console.log('Hủy đăng nhập');
                },
            });
        }
    };
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: 'linear-gradient(45deg, #f5e6ff, #e6f0ff, #fff)',
                backgroundSize: '200% 200%',
                animation: 'gradientAnimation 5s ease infinite',
                position: 'relative',
            }}
        >
            <style>
                {`
          @keyframes gradientAnimation {
            0% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
            100% { background-position: 0% 0%; }
          }
        `}
            </style>
            {loading && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'rgba(0, 0, 0, 0.3)',
                        zIndex: 10,
                    }}
                >
                    <Space direction="vertical" align="center">
                        <Spin size="large" />
                        <Text style={{ color: '#fff' }}>Đăng nhập...</Text>
                    </Space>
                </div>
            )}
            <div
                style={{
                    width: 450,
                    padding: 50,
                    background: '#fff',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={handleGoBack}
                    style={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        zIndex: 1
                    }}
                />
                <div style={{ marginBottom: 20 }}>
                    <Link to="/">
                        <img
                            src={logo}
                            alt="logo"
                            style={{
                                height: '40px',
                                marginBottom: '20px',
                                objectFit: 'contain'
                            }}
                        />
                    </Link>
                </div>
                <Title level={2} style={{ marginBottom: 20 }}>
                    Đăng nhập
                </Title>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Input
                        placeholder="Email/Tên đăng nhập"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        size="large"
                        style={{ width: '100%' }}
                    />

                    {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}

                    <Input.Password
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        size="large"
                        style={{ width: '100%' }}
                    />
                    {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                    <Button
                        type="primary"
                        size="large"
                        onClick={showConfirm}
                        style={{ width: '100%', background: '#b388ff', borderColor: '#b388ff' }}
                        disabled={loading}
                    >
                        Đăng nhập
                    </Button>
                    <Text>
                        Bạn chưa có tài khoản?{' '}
                        <Link to="/signup">
                            <Text strong style={{ color: '#b388ff' }}>
                                Đăng ký ngay
                            </Text>
                        </Link>
                    </Text>
                    <Text>
                        <Link to="/quen-mat-khau">
                            <Text strong style={{ color: '#b388ff' }} onClick={handleForgotPassword}>
                                Quên mật khẩu?
                            </Text>
                        </Link>
                    </Text>
                </Space>
            </div>
        </div>
    );
};

export default Login;