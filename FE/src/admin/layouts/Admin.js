import React from "react";

import { Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";

import Sidebar from "../components/Sidebar";
import NavbarComponent from "../components/NavbarComponent";
import Footer from "../components/Footer";
import routes from '../routes.js';

import "bootstrap/dist/css/bootstrap.min.css";

const Admin = () => {
    return (
        <div className="d-flex" id="wrapper">
            <Sidebar />
            <div id="page-content-wrapper" className="w-100">
                <NavbarComponent />
                <Container fluid className="mt-3">
                    <Routes>
                        {routes.map((route, index) => (
                            <Route key={index} path={`${route.path}`} element={<route.component />} />
                        ))}
                    </Routes>
                </Container>
                <Footer />
            </div>
        </div>
    );
};

export default Admin;
