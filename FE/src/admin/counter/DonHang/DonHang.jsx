// import React, { useState, useEffect } from 'react';
// import { Button } from 'react-bootstrap';
// import axios from 'axios';

// export default function DonHang({ onSelectInvoice, onDeleteInvoice }) {
//   const [invoices, setInvoices] = useState([]);
//   const [canAdd, setCanAdd] = useState(true);
//   const [invoiceCount, setInvoiceCount] = useState(0);
//   const [selectedInvoice, setSelectedInvoice] = useState(null);

//   const fetchInvoices = () => {
//     axios.get('http://localhost:8080/order')
//       .then(response => {
//         const filteredInvoices = response.data.data.filter(invoice => invoice.status === 0);
//         setInvoices(filteredInvoices);
//         setInvoiceCount(filteredInvoices.length);
//         console.log('Fetched orders:', filteredInvoices);
//       })
//       .catch(error => console.error('Error fetching orders:', error));
//   };

//   useEffect(() => {
//     fetchInvoices();
//   }, []);

//   const addInvoice = () => {
//     if (!canAdd) return;

//     const newInvoice = { employee: 1, status: 0 };

//     axios.post('http://localhost:8080/order/add', newInvoice)
//       .then(response => {
//         setCanAdd(false);
//         fetchInvoices(); 
//         setCanAdd(true);
//       })
//       .catch(error => console.error('Error adding invoice:', error));
//   };

//   const removeSelectedInvoice = (index) => {
//     const invoiceToRemove = invoices[index];
//     if (invoiceToRemove) {
//       axios.put(`http://localhost:8080/order/edit/${invoiceToRemove.id}`, { status: 1 })
//         .then(response => {
//           onDeleteInvoice(invoiceToRemove.id);
//           setInvoices(invoices.filter((_, idx) => idx !== index));
//           if (selectedInvoice === invoiceToRemove.id) {
//             setSelectedInvoice(null);
//             onSelectInvoice(null);
//           }
//         })
//         .catch(error => console.error('Error deleting invoice:', error));
//     }
//   };

//   const handleSelectInvoice = (index) => {
//     const selectedInvoiceId = invoices[index].id;
//     setSelectedInvoice(selectedInvoiceId);
//     onSelectInvoice(selectedInvoiceId);
//   };

//   return (
//     <div className="d-flex align-items-center rounded p-2 w-100 overflow-hidden" style={{ marginBottom: "10px" }}>
//       <div style={{ flexShrink: 0 }}>
//         <Button variant="success" className="rounded-pill px-4 py-2" onClick={addInvoice} disabled={!canAdd}>
//           Tạo hóa đơn
//         </Button>
//       </div>
//       <div className="mx-2 border-start border-dark" style={{ height: "24px" }}></div>
//       <div className="d-flex flex-nowrap overflow-auto" style={{ maxWidth: "950px", whiteSpace: "nowrap" }}>
//         {invoices.map((invoice, index) => (
//           <div key={index} className="d-flex align-items-center mx-1">
//             <Button
//               variant={selectedInvoice === invoice.id ? "primary" : "light"}
//               className="border px-3 py-2"
//               onClick={() => handleSelectInvoice(index)}
//             >
//               {invoice.orderCode}
//             </Button>
//             <Button
//               variant="danger"
//               size="sm"
//               className="ms-2"
//               onClick={() => removeSelectedInvoice(index)}
//             >
//               X
//             </Button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }








import React, { useState, useEffect } from 'react';
import { Row, Col, Modal, Button, Table, Form } from 'react-bootstrap';
import axios from 'axios';
import QrReader from 'react-qr-scanner';

const Cart = ({ selectedInvoice }) => {

  const [availableProducts, setAvailableProducts] = useState([]);
  const [items, setItems] = useState([]);
  const newQuantitya = 0;
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [qrCodeData, setQrCodeData] = useState(null); // State để lưu dữ liệu quét được từ QR
  const [isQrReaderVisible, setIsQrReaderVisible] = useState(false); // Trạng thái để hiển thị/ẩn QrReader

  const fetchProducts = () => {
    axios.get('http://localhost:8080/product-detail')
      .then(response => {
        const products = response.data.data.filter(product => product.quantity > 0);
        setAvailableProducts(products);
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  const fetchOrderItems = () => {
    if (selectedInvoice) {
      axios.get(`http://localhost:8080/order-detail`)
        .then(response => {
          const orderItems = response.data.data;
          setItems(orderItems);
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

  const handleAddToCart = (productID) => {
    if (!productID || quantity < 1) return;

    // Gửi yêu cầu để thêm sản phẩm vào giỏ hàng
    axios.get(`http://localhost:8080/counter/add-to-cart?orderID=${selectedInvoice}&productID=${productID}&purchaseQuantity=1`)
      .then(response => {
        // Load lại bảng sản phẩm và giỏ hàng sau khi thêm thành công
        fetchProducts();
        fetchOrderItems();
      })
      .catch(error => console.error('Error adding to cart:', error));
  };

  const handleQuantityChange = (orderDetailID, productDetailID, newQuantity) => {
    if (newQuantity < 0) return;
    axios.get(`http://localhost:8080/counter/update-quantity?orderDetailID=${orderDetailID}&productDetailID=${productDetailID}&quantity=${newQuantity}`)
      .then(response => {
        fetchProducts();
        fetchOrderItems();
      })
      .catch(error => console.error('Error updating quantity:', error));
  };

  // Hàm xử lý khi quét mã QR
  const handleScan = (data) => {
    if (data) {
      setQrCodeData(data); // Lưu dữ liệu quét được vào state
      console.log("QR Code data:", data);

      // Dữ liệu QR chứa productID
      const productID = data; // Giả sử dữ liệu QR chứa trực tiếp productID
      if (productID) {
        handleAddToCart(productID); // Thêm sản phẩm vào giỏ hàng bằng productID
      }
    }
  };

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
                      <Button variant="secondary" className="rounded-pill px-3 py-2"
                        onClick={() => handleQuantityChange(item.id, item.productDetail.id, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </Button>

                      <Form.Control
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, item.productDetail.id, Number(e.target.value))}
                        onBlur={() => {
                          if (item.quantity === 0) {
                            handleRemoveItem(item.id, item.productDetail.id);
                          }
                        }}
                        style={{ width: '100px' }}
                      />

                      <Button variant="secondary" className="rounded-pill px-3 py-2"
                        onClick={() => handleQuantityChange(item.id, item.productDetail.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                  </td>

                  <td>{item.totalPrice} VND</td>
                  <td>
                    <i
                      className="mdi mdi-cart-off"
                      style={{ fontSize: '20px', cursor: 'pointer' }}
                      onClick={() => handleRemoveItem(item.id, item.productDetail.id)}
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
            <i 
              className="mdi mdi-qrcode-scan mr-5" 
              style={{ fontSize: '36px', cursor: 'pointer' }} 
              onClick={() => setIsQrReaderVisible(!isQrReaderVisible)} 
            ></i>
          </div>
          {/* Quét mã QR */}
          {isQrReaderVisible && (
            <div>
             
              <QrReader
                delay={300}
                style={{ width: '50%' }}
                onError={handleError}
                onScan={handleScan}
              />
              {qrCodeData && (
                <div>
                  <h5>QR Code Data:</h5>
                  <pre>{qrCodeData.text }</pre>
                  
                </div>
              )}
            </div>
          )}
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
              <tr key={product.id} onClick={() => handleSelectProduct(product)}>
                <td>{product.product.productName}</td>
                <td>{product.price ? product.price.toLocaleString() : 'N/A'} VND</td>
                <td>{product.quantity}</td>

              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default Cart;
