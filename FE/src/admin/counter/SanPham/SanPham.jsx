import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Form } from 'react-bootstrap';
import ProductQuantityModal from './ProductQuantityModal';
import axios from 'axios';

const Cart = ({ selectedInvoiceId }) => {
  const availableProducts = [
    { id: 3, name: 'Giày chó - 39 - đỏ', price: 350000 },
    { id: 4, name: 'Giày heo - 37 - hồng', price: 280000 },
    { id: 5, name: 'Giày vịt - 40 - vàng', price: 320000 }
  ];

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Fetch items from the API
    axios.get('http://localhost:8080/order-detail')
      .then(response => {
        setItems(response.data.data);
        if (selectedInvoiceId !== null) {
          setFilteredItems(response.data.data.filter(item => item.order.id === selectedInvoiceId));
        }
      })
      .catch(error => console.error('Error fetching items:', error));
  }, [selectedInvoiceId]);

  const handleRemoveItem = (id) => {
    // Send DELETE request to the API to delete the item
    axios.delete(`http://localhost:8080/order-detail/${id}`)
      .then(response => {
        setItems(items.filter(item => item.id !== id));
        setFilteredItems(filteredItems.filter(item => item.id !== id));
      })
      .catch(error => console.error('Error deleting item:', error));
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowModal(true);
  };

  const handleAddToCart = () => {
    if (!selectedProduct || quantity < 1 || !selectedInvoiceId) return;

    const existingItem = items.find(item => item.id === selectedProduct.id && item.orderId === selectedInvoiceId);

    if (existingItem) {
      setItems(items.map(item =>
        item.id === selectedProduct.id && item.orderId === selectedInvoiceId
          ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
          : item
      ));
    } else {
      setItems([...items, { ...selectedProduct, orderId: selectedInvoiceId, quantity, total: selectedProduct.price * quantity }]);
    }

    setSelectedProduct(null);
    setQuantity(1);
    setShowModal(false);
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

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  return (
    <div className="cart-container">
      <Row className="d-flex align-items-center">
        <Col className="d-flex justify-content-start">
          <h3>Sản phẩm</h3>
        </Col>
      </Row>

      <hr />

      <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
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
                    Thêm vào giỏ hàng
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <ProductQuantityModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        selectedProduct={selectedProduct}
        quantity={quantity}
        setQuantity={setQuantity}
        handleAddToCart={handleAddToCart}
      />

      <hr />

      <Row className="d-flex align-items-center">
        <Col className="d-flex justify-content-start">
          <h3>Giỏ hàng</h3>
        </Col>
      </Row>

      <hr />

      <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <Table hover>
          <thead>
            <tr>
              <th>Tên sản phẩm </th>
              <th>giá </th>
              <th>Số lượng </th>
              <th>Tổng tiền </th>
              <th>Hàng động</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>{item.productDetail.product.productName}</td>
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
                <td>{item.totalPrice.toLocaleString()} VND</td>
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
    </div>
  );
};

export default Cart;
