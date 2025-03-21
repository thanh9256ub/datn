import React, { useState, useEffect } from "react";
import { Row, Col, Modal, Button, Table, Form } from 'react-bootstrap';
import axios from 'axios';
import QrReader from 'react-qr-scanner';
import ThanhToan from "./ThanhToan/ThanhToan";
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BanHang = () => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [canAdd, setCanAdd] = useState(true);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [availableProducts, setAvailableProducts] = useState([]);
  const [items, setItems] = useState([]);
  const newQuantitya = 0;

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [isQrReaderVisible, setIsQrReaderVisible] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });

  const [currentCartPage, setCurrentCartPage] = useState(1);
  const [cartItemsPerPage] = useState(5);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [productsPerPage] = useState(5);

  const fetchInvoices = () => {
    axios.get('http://localhost:8080/order')
      .then(response => {
        const filteredInvoices = response.data.data.filter(invoice => invoice.status === 0);
        setInvoices(filteredInvoices);
        setInvoiceCount(filteredInvoices.length);
       
      })
      .catch(error => console.error('Error fetching orders:', error));
  };

  const fetchProducts = () => {
    axios.get('http://localhost:8080/product-detail')
      .then(response => {
        const products = response.data.data.filter(product => product.quantity > 0);
        setAvailableProducts(products);
      })
      .catch(error => console.error('Error fetching products:', error));
  };

  const calculateTotalAmount = (items) => {
    items = items.filter(item => item.order.id === selectedInvoiceId);
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotalAmount(total);
  };

  const fetchOrderItems = () => {
    if (selectedInvoiceId) {
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
    fetchInvoices();
    fetchProducts();
  }, []);

  useEffect(() => {
    fetchOrderItems();
  }, [selectedInvoiceId]);

  const addInvoice = () => {
    if (!canAdd) return;

    const newInvoice = { employeeId: 1,orderType:0, status: 0 };

    axios.post('http://localhost:8080/order/add', newInvoice)
      .then(response => {
        setCanAdd(false);
        fetchInvoices();
        setCanAdd(true);
      })
      .catch(error => console.error('Error adding invoice:', error));
  };

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
    if (selectedInvoiceId===null) {
      toast.warn("Vui lòng chọn hóa đơn trước khi thêm sản phẩm 🥰", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
     return 
    }
    setSelectedProduct(product);
    setQuantity(1);
    handleShowModal();
  };

  const handleAddToCart = () => {
    if (!selectedProduct || quantity < 1 || selectedProduct.quantity < quantity) {
      toast.error("Vui lòng nhập lại số lượng 🥰", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
  
    axios.get(`http://localhost:8080/counter/add-to-cart?orderID=${selectedInvoiceId}&productID=${selectedProduct.id}&purchaseQuantity=${quantity}`)
      .then(response => {
        // Load lại bảng sản phẩm và giỏ hàng sau khi thêm thành công
        fetchProducts();
        fetchOrderItems();
        handleCloseModal();
      })
      .catch(error => console.error('Error adding to cart:', error));
  };

  const handleQuantityChange = (item, newQuantity) => {
   
    if (newQuantity < 0 || item.productDetail.quantity + item.quantity < newQuantity) return;
    axios.get(`http://localhost:8080/counter/update-quantity?orderDetailID=${item.id}&productDetailID=${item.productDetail.id}&quantity=${newQuantity}`)
      .then(response => {
        fetchProducts();
        fetchOrderItems();
      })
      .catch(error => console.error('Error updating quantity:', error));
  };

  const handleScan = (data) => {
    if (data && selectedInvoiceId) {
      setIsQrReaderVisible(false);
      // Stop scanning
      axios.get(`http://localhost:8080/counter/add-to-cart?orderID=${selectedInvoiceId}&productID=${data.text}&purchaseQuantity=1`)
        .then(response => {
          // Load lại bảng sản phẩm và giỏ hàng sau khi thêm thành công
          fetchProducts();
          fetchOrderItems();
          toast.success("Thêm sản phẩm thành công 🥰", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        })
        .catch(error => {
        });
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const removeItemsByInvoice = (invoiceId) => {
    axios.get(`http://localhost:8080/order-detail?orderId=${invoiceId}`)
      .then(response => {
        const itemsToRemove = response.data.data;
        itemsToRemove.forEach(item => {
          handleRemoveItem(item.id, item.productDetail.id);
        });
      })
      .catch(error => console.error('Error fetching order items:', error));
  };

  const removeSelectedInvoice = (index) => {
    const invoiceToRemove = invoices[index];
    if (invoiceToRemove) {
      removeItemsByInvoice(invoiceToRemove.id);
      axios.put(`http://localhost:8080/order/edit/${invoiceToRemove.id}`, { status: 1 })
        .then(response => {
          handleDeleteInvoice(invoiceToRemove.id);
          setInvoices(invoices.filter((_, idx) => idx !== index));
          if (selectedInvoiceId === invoiceToRemove.id) {
            setSelectedInvoiceId(null);
          }
        })
        .catch(error => console.error('Error deleting invoice:', error));
    }
  };

  const handleSelectInvoice = (index) => {
    const selectedInvoiceId = invoices[index].id;
    setSelectedInvoiceId(selectedInvoiceId);
  };

  const handleDeleteInvoice = (invoiceId) => {
    if (selectedInvoiceId === invoiceId) {
      setSelectedInvoiceId(null);
    }
  };

  const filteredProducts = availableProducts.filter(product => {
    return (
      product.product.productName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedColor ? product.color.colorName === selectedColor : true) &&
      (selectedSize ? product.size.sizeName === selectedSize : true) &&
      (selectedBrand ? product.product.brand.brandName === selectedBrand : true) &&
      (selectedCategory ? product.product.category.categoryName === selectedCategory : true) &&
      (selectedMaterial ? product.product.material.materialName === selectedMaterial : true) &&
      (product.price >= priceRange.min && product.price <= priceRange.max)
    );
  });

  // Pagination logic for cart items
  const indexOfLastCartItem = currentCartPage * cartItemsPerPage;
  const indexOfFirstCartItem = indexOfLastCartItem - cartItemsPerPage;
  const currentCartItems = items
    .filter(item => item.order.id === selectedInvoiceId && item.status === 0)
    .slice(indexOfFirstCartItem, indexOfLastCartItem);

  const paginateCart = (pageNumber) => {
    setCurrentCartPage(pageNumber);
  };

  // Pagination logic for products
  const indexOfLastProduct = currentProductPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginateProduct = (pageNumber) => {
    setCurrentProductPage(pageNumber);
  };

  return (
   
    <div style={{ backgroundColor: "white" }}>
      <Row className="align-items">
        <Col md={8}>
          <div className="p-3 border">
            <div className="d-flex align-items-center rounded p-2 w-100 overflow-hidden" style={{ marginBottom: "10px" }}>
              <div style={{ flexShrink: 0 }}>
                <Button variant="success" className="rounded-pill px-4 py-2" onClick={addInvoice} disabled={!canAdd}>
                  Tạo hóa đơn
                </Button>
              </div>
              <div className="mx-2 border-start border-dark" style={{ height: "24px" }}></div>
              <div className="d-flex flex-nowrap overflow-auto" style={{ maxWidth: "950px", whiteSpace: "nowrap" }}>
                {invoices.map((invoice, index) => (
                  <div key={index} className="d-flex align-items-center mx-1">
                    <Button
                      variant={selectedInvoiceId === invoice.id ? "primary" : "light"}
                      className="border px-3 py-2"
                      onClick={() => handleSelectInvoice(index)}
                    >
                      {invoice.orderCode}
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="ms-2"
                      onClick={() => removeSelectedInvoice(index)}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="cart-container">
              <h3>Giỏ hàng </h3>
              {/* Bảng giỏ hàng */}
              <div className="table-responsive" >
                <div style={{ height: '300px',overflowY: 'auto'}}>
                <Table hover >
                  <thead>
                    <tr>
                      <th>Tên sản phẩm </th>
                      <th>Thương hiệu  </th>
                      <th>Danh mục  </th>
                      <th>Chất liệu </th>
                      <th>Màu sắc </th>
                      <th>Kích thước </th>
                      <th>Giá </th>
                      <th>Số lượng </th>
                      <th>Tổng tiền </th>
                      <th>Hàng động </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCartItems.map(item => (
                      <tr key={item.id}>
                        <td>{item.productDetail.product.productName}</td>
                        <td>{item.productDetail.product.brand.brandName }</td>
                        <td>{item.productDetail.product.category.categoryName }</td>
                        <td>{item.productDetail.product.material.materialName }</td>
                        <td>{item.productDetail.color.colorName} </td>
                        <td>{item.productDetail.size.sizeName} </td>
                        <td>{item.price.toLocaleString()} </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            <button type="button" className="btn btn-outline-secondary btn-sm btn-rounded btn-icon"
                              onClick={() => handleQuantityChange(item, Math.max(1, item.quantity - 1))}
                              style={{width: '20px', height: '20px' }}
                            ><i className="mdi mdi-minus"></i></button>
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
                              style={{ width: '40px', textAlign: 'center', height: '20px' }}
                            />
                            <button type="button" className="btn btn-outline-secondary btn-sm btn-rounded btn-icon"
                              onClick={() => handleQuantityChange(item, Math.min(item.productDetail.quantity + item.quantity, item.quantity + 1))}
                              style={{width: '20px', height: '20px' }}
                            >
                              <i className="mdi mdi-plus"></i>
                            </button>
                          </div>
                        </td>
                        <td>{item.totalPrice.toLocaleString()} </td>
                        <td>
                          <i
                            className="mdi mdi-cart-off"
                            style={{ fontSize: '20px', cursor: 'pointer'}}
                            onClick={() => {
                              handleRemoveItem(item.id, item.productDetail.id);
                            }}
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                </div>
                <div  >
                <Pagination 
                  itemsPerPage={cartItemsPerPage}
                  totalItems={items.filter(item => item.order.id === selectedInvoiceId && item.status === 0).length}
                  paginate={paginateCart}
                  currentPage={currentCartPage}
                />
                </div>
              </div>
              <hr />
              <Row className="d-flex align-items-center">
                <Col className="d-flex justify-content-start">
                  <h3>Danh sach sản phẩm </h3>
                </Col>
                </Row>
                <Row>
                <Col className="d-flex justify-content-end">
                  <div className="d-flex align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="Tìm kiếm sản phẩm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ marginRight: "10px" , width:'150px ',height: '30px'}}
                    />
                    <Form.Control
                      as="select"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      style={{ marginRight: "10px" , width:'150px ',height: '30px'}}
                    >
                      <option value="">Tất cả màu sắc</option>
                      {[...new Set(availableProducts.map(product => product.color.colorName))].map(color => (
                        <option key={color} value={color}>{color}</option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      as="select"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      style={{ marginRight: "10px" , width:'150px ',height: '30px'}}
                    >
                      <option value="">Tất cả kích thước</option>
                      {[...new Set(availableProducts.map(product => product.size.sizeName))].map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      as="select"
                      value={selectedBrand}
                      onChange={(e) => setSelectedBrand(e.target.value)}
                      style={{ marginRight: "10px", width: "150px", height: "30px" }}
                    >
                      <option value="">Tất cả thương hiệu</option>
                      {[...new Set(availableProducts.map(product => product.product.brand.brandName))].map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      as="select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{ marginRight: "10px", width: "150px", height: "30px" }}
                    >
                      <option value="">Tất cả danh mục</option>
                      {[...new Set(availableProducts.map(product => product.product.category.categoryName))].map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      as="select"
                      value={selectedMaterial}
                      onChange={(e) => setSelectedMaterial(e.target.value)}
                      style={{ marginRight: "10px", width: "150px", height: "30px" }}
                    >
                      <option value="">Tất cả chất liệu</option>
                      {[...new Set(availableProducts.map(product => product.product.material.materialName))].map(material => (
                        <option key={material} value={material}>{material}</option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      type="number"
                      placeholder="Giá từ"
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                      style={{ marginRight: "10px", width: "100px", height: "30px" }}
                    />
                    <Form.Control
                      type="number"
                      placeholder="Giá đến"
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || Infinity })}
                      style={{ marginRight: "10px", width: "100px", height: "30px" }}
                    />
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
              <div style={{ height: '250px',overflowY: 'auto'}}>
                <Table hover>
                  <thead>
                    <tr>
                      <th>Tên sản phẩm </th>
                      <th>Thương hiệu  </th>
                      <th>Danh mục  </th>
                      <th>Chất liệu </th>
                      <th>Màu sắc </th>
                      <th>Kích thước </th>
                      <th>Giá </th>
                      <th>Số lượng </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentProducts.map(product => (
                      <tr key={product.id} onClick={ (() => handleSelectProduct(product))}>
                        <td>{product.product.productName}</td>
                        <td>{product.product.brand.brandName }</td>
                        <td>{product.product.category.categoryName }</td>
                        <td>{product.product.material.materialName }</td>
                        <td>{product.color.colorName} </td>
                          <td>{product.size.sizeName} </td>
                        <td>{product.price ? product.price.toLocaleString() : 'N/A'} VND</td>
                        <td>{product.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                </div>
                <Pagination
                  itemsPerPage={productsPerPage}
                  totalItems={filteredProducts.length}
                  paginate={paginateProduct}
                  currentPage={currentProductPage}
                />
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
          </div>
        </Col>
        <Col md={4}>
          <div className="p-3 border">
            <ThanhToan 
              idOrder={selectedInvoiceId} 
              orderDetail={items} 
              totalAmount={totalAmount} 
             
            />
            <ToastContainer />
          </div>
        </Col>
      </Row>
    </div>
  );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav >
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <button onClick={() => paginate(number)} className="page-link">
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default BanHang;
