import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { registerCustomer } from './service/Loginservice';
import { Typography, Input, Button, Select, Spin, Space, DatePicker, notification, Modal } from 'antd';
import logo from '../assets/images/logo_h2tl.png'

const { Title, Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const Signup = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState(null);
    const [fullName, setFullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const handleSignup = (e) => {
        setLoading(true);

        registerCustomer({ email, phone, fullName, gender, birthDate })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    notification.success({
                        message: 'Đăng ký thành công',
                        description: 'Tài khoản của bạn đã được tạo. Vui lòng đăng nhập!',
                        placement: 'topRight',
                        duration: 3
                    });
                    history.push('/login');
                } else {
                    alert(response.data.message);
                }
            })
            .catch((error) => {
                alert('Đăng ký thất bại');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const showConfirm = () => {
        confirm({
            title: 'Xác nhận đăng ký',
            content: 'Bạn có chắc chắn muốn tạo tài khoản mới với thông tin đã nhập?',
            okText: 'Đồng ý',
            cancelText: 'Hủy bỏ',
            centered: true,
            onOk() {
                handleSignup();
            },
            onCancel() {
                console.log('Hủy đăng ký');
            },
        });
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
                        <Text style={{ color: '#fff' }}>Đang đăng ký...</Text>
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
                    Đăng ký
                </Title>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Input
                        placeholder="Họ và tên"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        size="large"
                        style={{ width: '100%' }}
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        size="large"
                        style={{ width: '100%' }}
                    />
                    <Input
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        size="large"
                        style={{ width: '100%' }}
                    />
                    <Select
                        placeholder="Giới tính"
                        value={gender}
                        onChange={setGender}
                        size="large"
                        style={{ width: '100%', textAlign: 'left' }}
                    >
                        <Option value={1}>Nam</Option>
                        <Option value={0}>Nữ</Option>
                    </Select>
                    <DatePicker
                        placeholder="Ngày sinh"
                        style={{ width: '100%' }}
                        size="large"
                        onChange={(date, dateString) => setBirthDate(dateString)}
                    />
                    <Button
                        type="primary"
                        size="large"
                        onClick={showConfirm}
                        style={{ width: '100%', background: '#b388ff', borderColor: '#b388ff' }}
                    >
                        Đăng ký
                    </Button>
                    <Text>
                        Bạn đã có tài khoản?{' '}
                        <Link to="/login">
                            <Text strong style={{ color: '#b388ff' }}>
                                Đăng nhập
                            </Text>
                        </Link>
                    </Text>
                </Space>
            </div>
        </div>
    );
};

export default Signup;