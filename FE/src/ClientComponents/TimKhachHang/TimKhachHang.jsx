import React, { useState } from "react";
import { Form, Button, ListGroup,Col,InputGroup, Container } from "react-bootstrap";


function TimKhachHang() {
  

  return (
    <Container className="my-4" style={{width:"500px",marginLeft:"2px"}}> 
      <Col>
          <InputGroup>
            <Form.Control placeholder="Ten,So dien thoai" />
            <Button variant="dark">Tìm kiếm</Button>
          </InputGroup>
          
        </Col>
      

      {/* Danh sách kết quả */}
    </Container>
  );
}

export default TimKhachHang;