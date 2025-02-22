import React, { useState } from 'react';
import { Row, Col, Modal, Button } from 'react-bootstrap';

const Cart = () => {
  const initialItems = [
    { id: 1, name: 'Giày gấu - 40 - cam', price: 400000, quantity: 3, total: 1200000 },
    { id: 2, name: 'Giày mèo - 38 - xanh', price: 300000, quantity: 1, total: 300000 }
  ];

  const [items, setItems] = useState(initialItems); // Quản lý giỏ hàng
  const [showModal, setShowModal] = useState(false); // Quản lý trạng thái của Modal

  const handleRemoveItem = (id) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems); // Cập nhật lại giỏ hàng
  };

  const handleShowModal = () => setShowModal(true); // Hiển thị Modal
  const handleCloseModal = () => setShowModal(false); // Đóng Modal

  return (
    <div className="cart-container">
      <Row className="d-flex align-items-center">
        <Col className="d-flex justify-content-start">
          <h3>Giỏ hàng</h3>
        </Col>
        <Col className="d-flex justify-content-end">
          <div className="d-flex align-items-center">
            <i 
              className="mdi mdi-cart-plus mr-5" 
              style={{ fontSize: '36px', cursor: 'pointer' }}
              onClick={handleShowModal} // Mở modal khi nhấn vào icon
            ></i>
            <i className="mdi mdi-qrcode-scan mr-5" style={{ fontSize: '36px' }}></i>
          </div>
        </Col>
      </Row>

      <hr />
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.price.toLocaleString()} VND</td>
                <td>{item.quantity}</td>
                <td>{item.total.toLocaleString()} VND</td>
                <td>
                  <i
                    className="mdi mdi-cart-off" 
                    style={{ fontSize: '20px', cursor: 'pointer' }}
                    onClick={() => handleRemoveItem(item.id)} // Gọi hàm khi nhấn vào icon
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal khi nhấn vào cart-plus */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm sản phẩm vào giỏ hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Nội dung Modal */}
          <p>Thêm sản phẩm mới vào giỏ hàng.</p>
          {/* Bạn có thể thêm form hoặc các lựa chọn khác ở đây */}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleCloseModal}>
            Thêm vào giỏ hàng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cart;
