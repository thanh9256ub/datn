import React from "react";
import { Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import NavbarComponent from "../components/NavbarComponent";
import Footer from "../components/Footer";
import Dashboard from "../views/Dashboard";
import Users from "../views/Users";
import Settings from "../views/Settings";
import "bootstrap/dist/css/bootstrap.min.css";
import BanHang from "../views/BanHang";

const Admin = () => {
    return (
        <div className="d-flex" id="wrapper">
            <Sidebar />
            <div id="page-content-wrapper" className="w-100">
                <NavbarComponent />
                <Container fluid className="mt-3">
                    <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="users" element={<Users />} />
                        <Route path="settings" element={<Settings />} />
                        <Route path="sell" element={<BanHang />} />
                    </Routes>
                </Container>
                <Footer />
            </div>
        </div>
    );
};

export default Admin;
