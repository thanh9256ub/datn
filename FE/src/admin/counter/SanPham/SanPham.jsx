import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import ProductTable from './ProductTable';
import ProductModal from './ProductModal';

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

      <ProductTable
        filteredItems={filteredItems}
        handleQuantityChange={handleQuantityChange}
        handleRemoveItem={handleRemoveItem}
      />

      <ProductModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        availableProducts={availableProducts}
        selectedProduct={selectedProduct}
        handleSelectProduct={handleSelectProduct}
        quantity={quantity}
        setQuantity={setQuantity}
        handleAddToCart={handleAddToCart}
      />
    </div>
  );
}
