import React from "react";
import { Container } from "react-bootstrap";
import '../admin.css';

const Footer = () => {
    return (
        <footer className="bg-dark text-white text-center py-3 mt-auto">
            <Container>
                <p>&copy; 2025 Admin Panel. All rights reserved.</p>
            </Container>
        </footer>
    );
};

export default Footer;
