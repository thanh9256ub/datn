import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { registerCustomer } from '../../loginBanHang/service/Loginservice';
import { Typography, Input, Button, Select, Spin, Space } from 'antd';

const { Title, Text } = Typography;
const { Option } = Select;

const Signup = () => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState(null);
    const [fullName, setfullName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const handSignup = (e) => {
        if (!window.confirm('Bạn có chắc chắn muốn đăng kí?')) return;
        setLoading(true);
        e.preventDefault();

        registerCustomer(email, phone, fullName, gender, birthDate)
            .then((response) => {
                console.log(response);
                if (response.data.status === 200) {
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
                history.push('/login');
            });
    };

    return (
        <div
            style={{
                width: '100%',
                minHeight: '80vh',
                background: '#fff',
                paddingTop: '6rem',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
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
                    width: 'min(90%, 580px)',
                    height: '80vh',
                    padding: '2.5rem 3rem',
                    background: '#fff',
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                    textAlign: 'center',
                    position: 'relative',
                    margin: '1rem',
                }}
            >
                <Title level={2} style={{ margin: '1.5rem 0' }}>
                    Sign Up
                </Title>
                <Space
                    direction="vertical"
                    size="large"
                    style={{ width: '100%', marginTop: '2rem' }}
                >
                    <Input
                        placeholder="Your Name"
                        value={fullName}
                        onChange={(e) => setfullName(e.target.value)}
                        size="large"
                        style={{
                            height: '3.5rem',
                            fontSize: '1rem',
                            color: '#5c5c5c',
                            borderRadius: 5,
                        }}
                    />
                    <Input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        size="large"
                        style={{
                            height: '3.5rem',
                            fontSize: '1rem',
                            color: '#5c5c5c',
                            borderRadius: 5,
                        }}
                    />
                    <Input
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        size="large"
                        style={{
                            height: '3.5rem',
                            fontSize: '1rem',
                            color: '#5c5c5c',
                            borderRadius: 5,
                        }}
                    />
                    <Select
                        placeholder="Gender"
                        value={gender !== null ? gender.toString() : undefined}
                        onChange={(value) => setGender(parseInt(value))}
                        size="large"
                        style={{
                            width: '100%',
                            height: '3.5rem',
                            fontSize: '1rem',
                            color: '#5c5c5c',
                            borderRadius: 5,
                            textAlign: 'left',
                        }}
                        dropdownStyle={{ textAlign: 'left' }}
                    >
                        <Option value="1">Male</Option>
                        <Option value="0">Female</Option>
                    </Select>
                    <Input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        size="large"
                        style={{
                            height: '3.5rem',
                            fontSize: '1rem',
                            color: '#5c5c5c',
                            borderRadius: 5,
                        }}
                    />
                </Space>
                <Button
                    type="primary"
                    size="large"
                    onClick={handSignup}
                    style={{
                        width: '100%',
                        height: '3.5rem',
                        background: '#ca51f0',
                        borderColor: '#ca51f0',
                        marginTop: '2rem',
                        fontSize: '1.1rem',
                        fontWeight: 500,
                    }}
                >
                    Continue
                </Button>
                <Text
                    style={{
                        marginTop: '1.5rem',
                        color: '#5c5c5c',
                        fontSize: '1rem',
                        fontWeight: 500,
                    }}
                >
                    Already have an account?{' '}
                    <Link to="/login">
                        <Text strong style={{ color: '#ca51f0', fontWeight: 600 }}>
                            Login
                        </Text>
                    </Link>
                </Text>
            </div>
        </div>
    );
};

export default Signup;