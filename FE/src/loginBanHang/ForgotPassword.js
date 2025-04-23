import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Typography, Input, Button, Spin, Space, Alert, notification } from 'antd';
import { ForgotPasswordCustomer, ListForgotpassword } from './service/ForgotPassword';
import { ArrowLeftOutlined } from '@ant-design/icons';
import logo from '../assets/images/logo_h2tl.png';

const { Title, Text } = Typography;

const ForgotPassword = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState('');

    const handleForgotPassword = async () => {
        try {
            // Validate email
            if (!email.trim()) {
                setError('Vui lòng nhập địa chỉ email');
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                setError('Email không hợp lệ');
                return;
            }
            if (email.length > 100) {
                setError('Email không được quá 100 ký tự');
                return;
            }
            if (email.length < 15) {
                setError('Email không được ít hơn 15 ký tự');
                return;
            }



            setLoading(true);
            setError(null);

            // Gửi yêu cầu lấy lại mật khẩu cho khách hàng
            // try {
            //     const responseCustomer = await ForgotPasswordCustomer(email);
            //     if (responseCustomer.status === 200) {
            //         notification.success({
            //             message: 'Thành công',
            //             description: 'Yêu cầu lấy lại mật khẩu đã được gửi! Vui lòng kiểm tra email của bạn.',
            //             placement: 'topRight',
            //             duration: 4.5
            //         });
            //         history.push('/login');
            //         return;
            //     }
            // } catch (error) {
            //     if (error.response && error.response.status === 404) {
            //         setError('Email không tồn tại trong hệ thống');
            //     }
            //     setError('Đã xảy ra lỗi khi gửi yêu cầu');
            //     console.error('Forgot password error:', error);
            // } finally {
            //     setLoading(false);
            // }

            // Nếu không phải tài khoản khách hàng, thử với tài khoản nhân viên
            const response = await ListForgotpassword(email);
            if (response.status === 200) {
                notification.success({
                    message: 'Thành công',
                    description: 'Yêu cầu lấy lại mật khẩu đã được gửi! Vui lòng kiểm tra email của bạn.',
                    placement: 'topRight',
                    duration: 4.5
                });
                history.push('/login');
            } else {
                setError(response.message || 'Gửi yêu cầu thất bại');
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setError('Email không tồn tại trong hệ thống');
                return;
            }
            setError('Đã xảy ra lỗi khi gửi yêu cầu');
            console.error('Forgot password error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        history.goBack();
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
                        <Text style={{ color: '#fff' }}>Đang xử lý...</Text>
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
                    Quên mật khẩu
                </Title>
                <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
                    Nhập địa chỉ email để lấy lại mật khẩu
                </Text>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Input
                        placeholder="Nhập địa chỉ email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        size="large"
                        style={{ width: '100%' }}
                        type="email"
                    />
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleForgotPassword}
                        style={{ width: '100%', background: '#b388ff', borderColor: '#b388ff' }}
                        disabled={loading}
                    >
                        Gửi yêu cầu
                    </Button>
                    <div style={{ marginTop: 16 }}>
                        <Text>
                            Quay lại <Link to="/login" style={{ color: '#b388ff' }}>đăng nhập</Link>
                        </Text>
                    </div>
                </Space>
            </div>
        </div>
    );
};

export default ForgotPassword;