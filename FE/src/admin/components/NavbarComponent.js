import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import '../admin.css';

const NavbarComponent = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#">Admin Panel</Navbar.Brand>
        <Nav className="ml-auto">
          <Nav.Link href="#">Logout</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
