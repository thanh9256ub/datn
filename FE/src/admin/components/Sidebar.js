import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import routes from '../routes';  // Import routes

const Sidebar = () => {
    const [subnav, setSubnav] = useState({
        "Sản phẩm": false,
        "Messages": false
    });

    const toggleSubnav = (title) => {
        setSubnav(prevState => ({
            ...prevState,
            [title]: !prevState[title]
        }));
    };

    return (
        <div className="bg-dark" id="sidebar-wrapper" style={{ width: "250px" }}>
            <div className="sidebar-heading text-white p-4">H2TL Admin</div>
            <div className="sidebar-menu">
                {routes.map((item, index) => {
                    return (
                        <>
                            {item.subRoutes ? (
                                // Nếu có mục con (subNav), hiển thị dropdown
                                <div key={index}>
                                    <div
                                        className="nav-link text-white"
                                        onClick={() => toggleSubnav(item.name)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <span>{item.name}</span>
                                        {subnav[item.name] ? item.iconOpened : item.iconClosed}
                                    </div>

                                    {subnav[item.name] && (
                                        <div className="sub-nav pl-3">
                                            {item.subRoutes.map((subItem, subIndex) => (
                                                <Link
                                                    key={subIndex}
                                                    to={`/admin${subItem.path}`}
                                                    className="nav-link text-white"
                                                >
                                                    <span>{subItem.name}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                // Nếu không có mục con, hiển thị mục chính bình thường
                                <div key={index}>
                                    <Link to={`/admin${item.path}`} className="nav-link text-white">
                                        <span>{item.name}</span>
                                    </Link>
                                </div>
                            )}
                        </>
                    );
                })}
            </div>
        </div>
    );
};

export default Sidebar;
