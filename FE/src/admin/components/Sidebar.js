// Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";
import routes from "../routes";  // Import routes.js
import '../admin.css';

const Sidebar = () => {
    return (
        <div className="bg-dark" id="sidebar-wrapper" style={{ width: "250px" }}>
            <div className="sidebar-heading text-white p-4">H2TL Admin</div>
            <Nav className="flex-column p-3">
                {routes.map((route, index) => (
                    <Nav.Item key={index}>
                        <Link to={`/admin${route.path}`} className="nav-link text-white">
                            {route.name}
                        </Link>
                    </Nav.Item>
                ))}
            </Nav>
        </div>
    );
};

export default Sidebar;
