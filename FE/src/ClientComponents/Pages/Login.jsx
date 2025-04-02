// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { getTokenCustomer } from '../../loginBanHang/service/Loginservice';
// import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
// import { Typography, Input, Button, Spin, Space } from 'antd';

// const { Title, Text } = Typography;

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const { login } = useAuth();
//     const history = useHistory();
//     const [loading, setLoading] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const [error, setError] = useState(null);

//     const handLogin = (e) => {
//         if (!window.confirm('Bạn có chắc chắn muốn đăng nhập?')) return;
//         setLoading(true);
//         e.preventDefault();

//         getTokenCustomer(email, password)
//             .then((response) => {
//                 console.log(response);

//                 if (response.status === 200) {
//                     login(response.data.data.token);
//                     localStorage.setItem('email', response.data.data.email);
//                     localStorage.setItem('role', response.data.data.role);
//                     localStorage.setItem('successMessage', 'Đăng nhập thành công!');
//                     history.push('/');
//                 } else {
//                     alert('Đăng nhập thất bại');
//                 }
//             })
//             .catch((error) => {
//                 alert('Đăng nhập thất bại');
//             })
//             .finally(() => {
//                 setLoading(false);
//             });
//     };

//     return (
//         <div
//             style={{
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 minHeight: '100vh',
//                 background: 'linear-gradient(45deg, #f5e6ff, #e6f0ff, #fff)',
//                 backgroundSize: '200% 200%',
//                 animation: 'gradientAnimation 5s ease infinite',
//                 position: 'relative',
//             }}
//         >
//             <style>
//                 {`
//           @keyframes gradientAnimation {
//             0% { background-position: 0% 0%; }
//             50% { background-position: 100% 100%; }
//             100% { background-position: 0% 0%; }
//           }
//         `}
//             </style>
//             {loading && (
//                 <div
//                     style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         display: 'flex',
//                         justifyContent: 'center',
//                         alignItems: 'center',
//                         background: 'rgba(0, 0, 0, 0.3)',
//                         zIndex: 10,
//                     }}
//                 >
//                     <Space direction="vertical" align="center">
//                         <Spin size="large" />
//                         <Text style={{ color: '#fff' }}>Đăng nhập...</Text>
//                     </Space>
//                 </div>
//             )}
//             <div
//                 style={{
//                     width: 450, // Tăng từ 400px lên 450px
//                     padding: 50, // Tăng từ 40px lên 50px
//                     background: '#fff',
//                     borderRadius: 8,
//                     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
//                     textAlign: 'center',
//                     position: 'relative',
//                     overflow: 'hidden',
//                 }}
//             >
//                 <Title level={2} style={{ marginBottom: 20 }}>
//                     Đăng nhập
//                 </Title>
//                 <Space direction="vertical" size="middle" style={{ width: '100%' }}>
//                     <Input
//                         type="email"
//                         placeholder="Your email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         size="large"
//                         style={{ width: '100%' }}
//                     />
//                     <Input.Password
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         size="large"
//                         style={{ width: '100%' }}
//                     />
//                     <Button
//                         type="primary"
//                         size="large"
//                         onClick={handLogin}
//                         style={{ width: '100%', background: '#b388ff', borderColor: '#b388ff' }}
//                     >
//                         Continue
//                     </Button>
//                     <Text>
//                         You don't have an account?{' '}
//                         <Link to="/signup">
//                             <Text strong style={{ color: '#b388ff' }}>
//                                 Sign Up
//                             </Text>
//                         </Link>
//                     </Text>
//                 </Space>
//             </div>
//         </div>
//     );
// };

// export default Login;
import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { Typography, Input, Button, Spin, Space, Alert } from 'antd';

const { Title, Text } = Typography;

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(ShopContext);
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!window.confirm('Bạn có chắc chắn muốn đăng nhập?')) return;

        setLoading(true);
        setError(null);
        setSuccessMessage('');

        try {
            await login({ email, password });
            setSuccessMessage('Đăng nhập thành công!');
            localStorage.setItem('email', email);
            setTimeout(() => history.push('/'), 1000);
        } catch (error) {
            setError(error.message || 'Đăng nhập thất bại, vui lòng thử lại.');
        } finally {
            setLoading(false);
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
                <Title level={2} style={{ marginBottom: 20 }}>
                    Đăng nhập
                </Title>
                {successMessage && (
                    <Alert message={successMessage} type="success" showIcon style={{ marginBottom: 16 }} />
                )}
                {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                    <Input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        size="large"
                        style={{ width: '100%' }}
                    />
                    <Input.Password
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        size="large"
                        style={{ width: '100%' }}
                    />
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleLogin}
                        style={{ width: '100%', background: '#b388ff', borderColor: '#b388ff' }}
                        disabled={loading}
                    >
                        Continue
                    </Button>
                    <Text>
                        You don't have an account?{' '}
                        <Link to="/signup">
                            <Text strong style={{ color: '#b388ff' }}>
                                Sign Up
                            </Text>
                        </Link>
                    </Text>
                </Space>
            </div>
        </div>
    );
};

export default Login;