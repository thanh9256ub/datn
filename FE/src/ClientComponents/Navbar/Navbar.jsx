import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import { Menu, Button, Badge, Drawer, Avatar, Space, ConfigProvider } from 'antd';
import { ShoppingCartOutlined, MenuOutlined } from '@ant-design/icons';
import logo from '../Assets/H2TL(1).png';

const Navbar = () => {
    const [menu, setMenu] = useState('shop');
    const [visible, setVisible] = useState(false);
    const { getTotalCartItems } = useContext(ShopContext);

    const showDrawer = () => setVisible(true);
    const closeDrawer = () => setVisible(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        localStorage.removeItem('role');
        window.location.href = '/login';
    };

    const linkStyle = {
        textDecoration: 'none',
        color: 'inherit',
    };

    const menuItems = [
        { key: 'shop', label: <Link to="/" style={linkStyle}>Shop</Link> },
        { key: 'all', label: <Link to="/all" style={linkStyle}>All</Link> },
        { key: 'mens', label: <Link to="/mens" style={linkStyle}>Top Sellers</Link> },
        { key: 'womens', label: <Link to="/womens" style={linkStyle}>New Product</Link> },
        { key: 'kids', label: <Link to="/kids" style={linkStyle}>Others</Link> },
    ];

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#ca51f0',
                    colorBgContainer: '#ffffff',
                    borderRadius: 8,
                    fontFamily: 'Poppins, sans-serif',
                },
                components: {
                    Menu: {
                        itemHoverBg: '#f5e6ff',
                        itemSelectedBg: '#e6ccff',
                        itemSelectedColor: '#ca51f0',
                    },
                    Button: {
                        defaultHoverBg: '#f0e6ff',
                        defaultHoverColor: '#ca51f0',
                    },
                },
            }}
        >
            <div
                style={{
                    padding: '15px 30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'linear-gradient(135deg, #f5e6ff 0%, #e6f0ff 100%)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    borderBottomLeftRadius: 12,
                    borderBottomRightRadius: 12,
                }}
            >
                {/* Logo */}
                <Link to="/" style={linkStyle}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            height: 70,
                            transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                </Link>

                {/* Menu for Desktop */}
                <Menu
                    mode="horizontal"
                    selectedKeys={[menu]}
                    onClick={(e) => setMenu(e.key)}
                    items={menuItems}
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        border: 'none',
                        background: 'transparent',
                        fontSize: 16,
                        fontWeight: 500,
                        display: window.innerWidth > 768 ? 'flex' : 'none',
                    }}
                />

                {/* Mobile Menu Toggle */}
                <Button
                    icon={<MenuOutlined />}
                    onClick={showDrawer}
                    style={{
                        border: 'none',
                        fontSize: 20,
                        display: window.innerWidth <= 768 ? 'block' : 'none',
                        background: 'rgba(255, 255, 255, 0.8)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                    }}
                />

                {/* Drawer for Mobile */}
                <Drawer
                    title={<span style={{ fontWeight: 600, color: '#ca51f0' }}>Menu</span>}
                    placement="right"
                    onClose={closeDrawer}
                    open={visible}
                    bodyStyle={{ padding: 0 }}
                    headerStyle={{ background: '#f5e6ff', borderBottom: 'none' }}
                >
                    <Menu
                        mode="vertical"
                        selectedKeys={[menu]}
                        onClick={(e) => {
                            setMenu(e.key);
                            closeDrawer();
                        }}
                        items={menuItems}
                        style={{ border: 'none', fontSize: 16 }}
                    />
                </Drawer>

                {/* Cart and Auth Buttons */}
                <Space size="large">
                    {localStorage.getItem('token') ? (
                        <Button
                            type="primary"
                            danger
                            onClick={handleLogout}
                            style={{
                                borderRadius: 20,
                                padding: '5px 20px',
                                height: 'auto',
                                background: 'linear-gradient(135deg, #ff4d4f, #ff7878)',
                                border: 'none',
                                boxShadow: '0 4px 10px rgba(255, 77, 79, 0.3)',
                                transition: 'all 0.3s ease',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                        >
                            Logout
                        </Button>
                    ) : (
                        <>
                            <Link to="/login" style={linkStyle}>
                                <Button
                                    type="primary"
                                    style={{
                                        borderRadius: 20,
                                        padding: '5px 20px',
                                        height: 'auto',
                                        background: 'linear-gradient(135deg, #ca51f0, #9d4edd)',
                                        border: 'none',
                                        boxShadow: '0 4px 10px rgba(202, 81, 240, 0.3)',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup" style={linkStyle}>
                                <Button
                                    style={{
                                        borderRadius: 20,
                                        padding: '5px 20px',
                                        height: 'auto',
                                        background: '#fff',
                                        color: '#ca51f0',
                                        border: '2px solid #ca51f0',
                                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
                                        transition: 'all 0.3s ease',
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                                >
                                    Đăng kí
                                </Button>
                            </Link>
                        </>
                    )}
                    <Link to="/cart" style={linkStyle}>
                        <Badge
                            count={getTotalCartItems()}
                            showZero
                            offset={[5, 5]}
                            style={{ backgroundColor: '#ff4d4f', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}
                        >
                            <Avatar
                                icon={<ShoppingCartOutlined />}
                                size={40}
                                style={{
                                    background: 'linear-gradient(135deg, #ca51f0, #9d4edd)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            />
                        </Badge>
                    </Link>
                </Space>
            </div>
        </ConfigProvider>
    );
};

export default Navbar;