import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { existsPhone, registerCustomer } from './service/Loginservice';
import { Typography, Input, Button, Select, Spin, Space, DatePicker, notification, Modal } from 'antd';
import logo from '../assets/images/logo_h2tl.png'
import { existsEmail } from './service/Loginservice'; // Import the email existence check function


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
                        description: 'Vui lòng kiểm tra email lấy mật khẩu đăng nhập!',
                        placement: 'topRight',
                        duration: 3,
                    });
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 5000);
                } else if (response.data.status === 400) {
                    alert('Email hoặc số điện thoại đã tồn tại');
                }
                else {
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


    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        phone: '',
        gender: '',
        birthDate: '',
    });

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);

    };

    const validatePhone = (phone) => {
        const regex = /^[0-9]{10}$/;
        return regex.test(phone);
    };


    const validateForm = async () => {
        let isValid = true;
        const newErrors = { ...errors };

        if (!fullName.trim()) {
            newErrors.fullName = 'Họ và tên không được để trống';
            isValid = false;
        }
        else if (fullName.length < 5) {
            newErrors.fullName = 'Họ và tên phải có ít nhất 5 ký tự';
            isValid = false;

        } else if (fullName.length > 50) {
            newErrors.fullName = 'Họ và tên không được quá 50 ký tự';
            isValid = false;
        }

        // họ và tên viết được cả dấu
        else if (!/^[\p{L}\s]+$/u.test(fullName)) {
            newErrors.fullName = 'Họ và tên không hợp lệ ';
            isValid = false;
        }

        else {

            newErrors.fullName = '';
        }

        if (!email.trim()) {
            newErrors.email = 'Email không được để trống';
            isValid = false;
        } else if (!validateEmail(email)) {
            newErrors.email = 'Email không hợp lệ';
            isValid = false;
        }
        else {
            const emailExists = await existsEmail(email);
            if (emailExists) {
                newErrors.email = 'Email đã tồn tại.';
                isValid = false;
            } else {
                newErrors.email = '';
            }
        }


        if (!phone.trim()) {
            newErrors.phone = 'Số điện thoại không được để trống';
            isValid = false;
        }
        else if (!validatePhone(phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ ( 10 chữ số)';
            isValid = false;
        }
        // sô điện thoại được bắt đầu bằng 0
        else if (!/^[0][0-9]{9}$/.test(phone)) {
            newErrors.phone = 'Số điện thoại phải bắt đầu bằng 0';
            isValid = false;
        }
        // số điện thoại không được có ký tự đặc biệt
        else if (!/^[0-9]+$/.test(phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ';
            isValid = false;
        }

        else {
            const phoneExists = await existsPhone(phone);
            if (phoneExists) {
                newErrors.phone = 'Số điện thoại đã tồn tại.';
                isValid = false;
            } else {

                newErrors.phone = '';
            }
        }

        if (gender === null) {
            newErrors.gender = 'Vui lòng chọn giới tính';
            isValid = false;
        } else {
            newErrors.gender = '';
        }

        if (!birthDate) {
            newErrors.birthDate = 'Vui lòng chọn ngày sinh';
            isValid = false;
        }
        // phai lớn hơn 18 tuổi
        else if (new Date(birthDate) > new Date(new Date().setFullYear(new Date().getFullYear() - 15))) {
            newErrors.birthDate = 'Đủ 15 tuổi trở lên';
            isValid = false;
        }
        // ngày sinh không được nhỏ hơn 1900
        else if (new Date(birthDate) < new Date('1900-01-01')) {
            newErrors.birthDate = 'Ngày sinh không hợp lệ';
            isValid = false;
        }
        else {
            newErrors.birthDate = '';
        }

        setErrors(newErrors);
        return isValid;
    };
    const showConfirm = async () => {
        const isValid = await validateForm();

        if (isValid) {
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
                    {errors.fullName && <p style={{ color: 'red' }}>{errors.fullName}</p>}

                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        size="large"
                        style={{ width: '100%' }}
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                    <Input
                        placeholder="Số điện thoại"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        size="large"
                        style={{ width: '100%' }}
                    />
                    {errors.phone && <p style={{ color: 'red' }}>{errors.phone}</p>}
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
                    {errors.gender && <p style={{ color: 'red' }}>{errors.gender}</p>}
                    <DatePicker
                        placeholder="Ngày sinh"
                        style={{ width: '100%' }}
                        size="large"
                        onChange={(date, dateString) => setBirthDate(dateString)}
                    />
                    {errors.birthDate && <p style={{ color: 'red' }}>{errors.birthDate}</p>}
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