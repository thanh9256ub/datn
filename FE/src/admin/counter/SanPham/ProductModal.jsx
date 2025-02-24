import React from 'react';
import { Modal, Table, Button, Form } from 'react-bootstrap';

const ProductModal = ({ showModal, handleCloseModal, availableProducts, selectedProduct, handleSelectProduct, quantity, setQuantity, handleAddToCart }) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Chọn sản phẩm</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!selectedProduct ? (
          <Table hover>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {availableProducts.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.price.toLocaleString()} VND</td>
                  <td>
                    <Button variant="success" size="sm" onClick={() => handleSelectProduct(product)}>
                      Chọn
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
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
        {selectedProduct ? (
          <>
            <Button variant="secondary" onClick={() => handleSelectProduct(null)}>
              Quay lại
            </Button>
            <Button variant="primary" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </Button>
          </>
        ) : (
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
