import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Button, Table, Form } from 'react-bootstrap';
import axios from 'axios';
import QrReader from 'react-qr-scanner';


const Cart = ({ selectedInvoice, updateTotalAmount }) => {

  const [availableProducts, setAvailableProducts] = useState([]);
  const [items, setItems] = useState([]);
  const newQuantitya = 0;

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [isQrReaderVisible, setIsQrReaderVisible] = useState(false);

  const fetchProducts = () => {
    axios.get('http://localhost:8080/product-detail')
      .then(response => {
        const products = response.data.data.filter(product => product.quantity > 0);
        setAvailableProducts(products);
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  const calculateTotalAmount = (items) => {
    items = items.filter(item => item.order.id === selectedInvoice);
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    updateTotalAmount(total);
  };

  const fetchOrderItems = () => {
    if (selectedInvoice) {
      axios.get(`http://localhost:8080/order-detail`)
        .then(response => {
          const orderItems = response.data.data;
          setItems(orderItems);
          calculateTotalAmount(orderItems);
        })
        .catch(error => console.error('Error fetching order items:', error));
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchOrderItems();
  }, [selectedInvoice]);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleRemoveItem = (orderDetailID, productDetailID) => {


    axios.get(`http://localhost:8080/counter/update-quantity2?orderDetailID=${orderDetailID}&productDetailID=${productDetailID}&quantity=${newQuantitya}`)
      .then(response => {
        fetchProducts();
        fetchOrderItems();
      })
      .catch(error => console.error('Error updating quantity:', error));

  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    handleShowModal();
  };

  const handleAddToCart = () => {
    if (!selectedProduct || quantity < 1||selectedProduct.quantity<quantity){
      alert('Số lượng không hợp lệ');
      return;
    } 
    console.log(selectedProduct.id);
    axios.get(`http://localhost:8080/counter/add-to-cart?orderID=${selectedInvoice}&productID=${selectedProduct.id}&purchaseQuantity=${quantity}`)
      .then(response => {
        // Load lại bảng sản phẩm và giỏ hàng sau khi thêm thành công
        fetchProducts();
        fetchOrderItems();
        handleCloseModal();
      })
      .catch(error => console.error('Error adding to cart:', error));
  };

  const handleQuantityChange = (item, newQuantity) => {
    console.log(item.productDetail.quantity+item.quantity);
    if (newQuantity < 0|| item.productDetail.quantity+item.quantity<newQuantity) return;
    axios.get(`http://localhost:8080/counter/update-quantity?orderDetailID=${item.id}&productDetailID=${item.productDetail.id}&quantity=${newQuantity}`)
      .then(response => {
        fetchProducts();
        fetchOrderItems();
      })
      .catch(error => console.error('Error updating quantity:', error));

  };
  // Hàm xử lý khi quét mã QR
  const handleScan = (data) => {
    if (data && selectedInvoice) {
      setIsQrReaderVisible(false);
      // Stop scanning
      axios.get(`http://localhost:8080/counter/add-to-cart?orderID=${selectedInvoice}&productID=${data.text}&purchaseQuantity=1`)
        .then(response => {
          // Load lại bảng sản phẩm và giỏ hàng sau khi thêm thành công
          fetchProducts();
          fetchOrderItems();
        })
        .catch(error => {
        });
    }
  };

  //const handleScanDebounced = debounce(handleScan, 1000);

  // Hàm xử lý khi không quét được mã QR
  const handleError = (error) => {
    console.error(error);
  };

  return (
    <div className="cart-container">

      <h3>Giỏ hàng </h3>
      {/* Bảng giỏ hàng */}
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
            {items
              .filter(item => item.order.id === selectedInvoice && item.status === 0)
              .map(item => (
                <tr key={item.id}>
                  <td>{item.productDetail.product.productName}</td>
                  <td>{item.price} VND</td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center' }}>



                      <button type="button" class="btn btn-outline-secondary btn-rounded btn-icon"
                        onClick={() => handleQuantityChange(item, Math.max(1, item.quantity - 1))}
                      ><i class="mdi mdi-minus"></i></button>


                      <Form.Control
                        type="tel"
                        min="1"
                        max={item.productDetail.quantity}
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item, Number(e.target.value))}
                        onBlur={() => {
                          if (item.quantity === 0) {
                            handleRemoveItem(item.id, item.productDetail.id);
                          }
                        }}
                        style={{ width: '50px', textAlign: 'center' }}
                      />
                      <button type="button" class="btn btn-outline-secondary btn-sm btn-rounded btn-icon "
                        onClick={() => handleQuantityChange(item,Math.min(item.productDetail.quantity+item.quantity, item.quantity + 1))}
                      >
                        <i class="mdi mdi-plus"></i>
                      </button>

                    </div>
                  </td>

                  <td>{item.totalPrice} VND</td>
                  <td>
                    <i
                      className="mdi mdi-cart-off"
                      style={{ fontSize: '20px', cursor: 'pointer' }}
                      onClick={() => {handleRemoveItem(item.id, item.productDetail.id)

        
                      }}
                    ></i>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      <hr />
      <Row className="d-flex align-items-center">
        <Col className="d-flex justify-content-start">
          <h3>Danh sach sản phẩm </h3>
        </Col>
        <Col className="d-flex justify-content-end">
          <div className="d-flex align-items-center">

            {isQrReaderVisible && (
              <div>
                <QrReader
                  delay={1000}
                  style={{ width: '45%' }}
                  onError={handleError}
                  onScan={handleScan}
                />
              </div>
            )}
            <i
              className="mdi mdi-qrcode-scan mr-5"
              style={{ fontSize: '36px', cursor: 'pointer' }}
              onClick={() => setIsQrReaderVisible(!isQrReaderVisible)}
            ></i>

          </div>

        </Col>
      </Row>

      <hr />

      {/* Bảng chọn sản phẩm */}
      <div className="table-responsive">
        <Table hover>
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>

            </tr>
          </thead>
          <tbody>
            {availableProducts.map(product => (
              <tr key={product.id} onClick={selectedInvoice && (() => handleSelectProduct(product))}>
                <td>{product.product.productName}</td>
                <td>{product.price ? product.price.toLocaleString() : 'N/A'} VND</td>
                <td>{product.quantity}</td>

              </tr>
            ))}
          </tbody>
        </Table>
      </div>



      {/* Modal để chọn số lượng */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nhập số lượng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <div>
              <h5>{selectedProduct.product.productName}</h5>
              <p>Giá: {selectedProduct.price.toLocaleString()} VND</p>
              <p>Kho: {selectedProduct.quantity} </p>
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
    </div>
  );
};

export default Cart;
