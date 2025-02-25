import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ProductQuantityModal = ({ showModal, handleCloseModal, selectedProduct, quantity, setQuantity, handleAddToCart }) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Nhập số lượng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedProduct && (
          <div>
            <h5>{selectedProduct.name}</h5>
            <p>Giá: {selectedProduct.price.toLocaleString()} VND</p>
            <Form.Group controlId="quantity">
              <Form.Label>Nhập số lượng:</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </Form.Group>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Đóng
        </Button>
        <Button variant="primary" onClick={handleAddToCart}>
          Thêm vào giỏ hàng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductQuantityModal;
