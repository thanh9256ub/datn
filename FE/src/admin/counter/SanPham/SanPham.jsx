import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Button, Table, Form } from 'react-bootstrap';

const Cart = ({ selectedInvoiceId }) => {
  const availableProducts = [
    { id: 3, invoiceId: 1, name: 'Giày chó - 39 - đỏ', price: 350000 },
    { id: 4, invoiceId: 1, name: 'Giày heo - 37 - hồng', price: 280000 },
    { id: 5, invoiceId: 2, name: 'Giày vịt - 40 - vàng', price: 320000 }
  ];

  const [items, setItems] = useState([
    { id: 1, invoiceId: 1, name: 'Giày gấu - 40 - cam', price: 400000, quantity: 3, total: 1200000 },
    { id: 2, invoiceId: 2, name: 'Giày mèo - 38 - xanh', price: 300000, quantity: 1, total: 300000 }
  ]);

  const [filteredItems, setFilteredItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (selectedInvoiceId === null) {
      setFilteredItems([]);
    } else {
      setFilteredItems(items.filter(item => item.invoiceId === selectedInvoiceId));
    }
  }, [selectedInvoiceId, items]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedProduct || quantity < 1 || !selectedInvoiceId) return;

    const existingItem = items.find(item => item.id === selectedProduct.id && item.invoiceId === selectedInvoiceId);

    if (existingItem) {
      setItems(items.map(item =>
        item.id === selectedProduct.id && item.invoiceId === selectedInvoiceId
          ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
          : item
      ));
    } else {
      setItems([...items, { ...selectedProduct, invoiceId: selectedInvoiceId, quantity, total: selectedProduct.price * quantity }]);
    }

    handleCloseModal();
  };

  // 🛒 Xử lý thay đổi số lượng trong giỏ hàng
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setItems(items.map(item =>
      item.id === id
        ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
        : item
    ));
  };

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
              onClick={handleShowModal} 
            ></i>
            <i className="mdi mdi-qrcode-scan mr-5" style={{ fontSize: '36px' }}></i>
          </div>
        </Col>
      </Row>

      <hr />

      <div className="table-responsive">
        <Table hover>
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
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.price.toLocaleString()} VND</td>
                <td>
                  <Form.Control
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                    style={{ width: "100px" }}
                  />
                </td>
                <td>{item.total.toLocaleString()} VND</td>
                <td>
                  <i
                    className="mdi mdi-cart-off" 
                    style={{ fontSize: '20px', cursor: 'pointer' }}
                    onClick={() => handleRemoveItem(item.id)}
                  ></i>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal để chọn sản phẩm */}
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
              <Button variant="secondary" onClick={() => setSelectedProduct(null)}>
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
    </div>
  );
};

export default Cart;
