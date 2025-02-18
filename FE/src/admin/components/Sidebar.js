import React from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import '../admin.css';

const Sidebar = () => {
    return (
        <div className="bg-dark" id="sidebar-wrapper" style={{ width: "250px" }}>
            <div className="sidebar-heading text-white p-4">H2TL Admin</div>
            <Nav className="flex-column p-3">
                <Nav.Item>
                    <Link to="/admin/dashboard" className="nav-link text-white">
                        Dashboard
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/admin/users" className="nav-link text-white">
                        Users
                    </Link>
                </Nav.Item>
                <Nav.Item>
                    <Link to="/admin/settings" className="nav-link text-white">
                        Settings
                    </Link>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default Sidebar;
