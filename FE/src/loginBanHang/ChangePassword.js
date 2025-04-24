import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Typography, Input, Button, Spin, Space, Alert, notification, Modal } from 'antd';
import { ChangePasswordCustomer, ListChangePassword } from './service/ChangePassword';
import { ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import logo from '../assets/images/logo_h2tl.png';

const { Title, Text } = Typography;
const { confirm } = Modal;

const ChangePassword = () => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isCustomer, setIsCustomer] = useState(true); // Assume customer by default
    const handleChangePassword = async () => {
        try {
            // Validate inputs
            if (!oldPassword || !newPassword || !confirmPassword) {
                setError('Vui lòng điền đầy đủ thông tin');
                return;
            }

            if (newPassword !== confirmPassword) {
                setError('Mật khẩu mới không khớp');
                return;
            }

            if (newPassword.length < 6) {
                setError('Mật khẩu phải có ít nhất 6 ký tự');
                return;
            }
            if (newPassword.length > 20) {
                setError('Mật khẩu không được quá 20 ký tự');
                return;
            }

            if (newPassword === oldPassword) {
                setError('Mật khẩu mới không được giống mật khẩu cũ');
                return;
            }
            if (newPassword === confirmPassword) {
                setError('Mật khẩu mới không được giống mật khẩu cũ');
                return;
            }


            setLoading(true);
            setError(null);

            // try {
            //     const responseCustomer = await ChangePasswordCustomer(oldPassword, newPassword);
            //     if (responseCustomer.status === 200) {
            //         notification.success({
            //             message: 'Thành công',
            //             description: 'Đổi mật khẩu thành công!',
            //             placement: 'topRight',
            //             duration: 2
            //         });
            //         history.push('/');
            //         return;
            //     }
            // } catch (error) {
            //     setError('Đã xảy ra lỗi khi đổi mật khẩu');
            // } finally {
            //     setLoading(false);
            // }

            // Nếu không phải tài khoản khách hàng, thử với tài khoản nhân viên

            const response = await ListChangePassword(oldPassword, newPassword);
            if (response.status === 200) {
                notification.success({
                    message: 'Thành công',
                    description: 'Đổi mật khẩu thành công!',
                    placement: 'topRight',
                    duration: 2
                });
                history.push('/admin/dashboard');

            }


        } catch (error) {
            if (error.response && error.response.status === 400) {
                setError(error.response.data.message);
                return;
            }
            setError('Đã xảy ra lỗi khi đổi mật khẩu');
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
                    Đổi mật khẩu
                </Title>
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Input.Password
                        placeholder="Mật khẩu cũ"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        size="large"
                        style={{ width: '100%' }}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                    <Input.Password
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        size="large"
                        style={{ width: '100%' }}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                    <Input.Password
                        placeholder="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        size="large"
                        style={{ width: '100%' }}
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleChangePassword}
                        style={{ width: '100%', background: '#b388ff', borderColor: '#b388ff' }}
                        disabled={loading}
                    >
                        Đổi mật khẩu
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default ChangePassword;