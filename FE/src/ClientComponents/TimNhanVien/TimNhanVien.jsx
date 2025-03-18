import React, { useState } from "react";
import { Form, Button, ListGroup,Col,InputGroup, Container } from "react-bootstrap";


function TimNhanVien() {
  

  return (
    <Container className="my-4" style={{width:"500px",marginLeft:"2px"}}> 
      <Col>
          <InputGroup>
            <Form.Control placeholder="Ten nhan vien" />
            <Button variant="dark">Tìm kiếm</Button>
          </InputGroup>
          
        </Col>
    </Container>
  );
}

export default TimNhanVien;