import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Modal, Button, Table, Form } from 'react-bootstrap';
import axios from 'axios';
import QrReader from 'react-qr-scanner';
import ThanhToan from "./ThanhToan/ThanhToan";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchOrders,
  fetchProducts,
  fetchOrderDetails,
  addInvoice,
  addToCart,
  updateCartQuantity,
  updateOrderStatus,
} from './api'; // Import API functions
import { toastOptions } from './constants'; // Import constants
import useWebSocket from "../../hook/useWebSocket";

const BanHang = () => {
  const qrIntervalRef = useRef(null);
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [promo, setPromo] = useState({});
  const [phoneNumber, setPhoneNumber] = useState('');
  const [delivery, setDelivery] = useState(false);
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
  const [customer, setCustomer] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    province: '',
    district: '',
    ward: '',
    note: '',
  });

  const { messages, isConnected } = useWebSocket("/topic/orders/delete");


  const fetchInvoices = () => {
    fetchOrders()
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
        const products = response.data.data.filter(product => product.quantity > 0 && product.status === 1);
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
      fetchOrderDetails()
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

  useEffect(() => {
    if (messages.length > 0) {
      clearInterval(qrIntervalRef.current);
      qrIntervalRef.current = null;
      setQrImageUrl(null);
      setSelectedInvoiceId(null);
      setTotalAmount(0);
      setPromo({});
      setDelivery(false);
      setPhoneNumber("");
      setCustomer(null);
      setCustomerInfo({
        name: '',
        phone: '',
        province: '',
        district: '',
        ward: '',
        address: '',
        note: '',
      });
      const lastMessage = messages[messages.length - 1];
      toast.info(lastMessage);
      fetchInvoices();
      fetchProducts();
    }
  }, [messages]);

  const addInvoice = () => {
    if (!canAdd) return;

    const newInvoice = { employeeId: localStorage.getItem("id"), orderType: 0, status: 0 };

    axios.post('http://localhost:8080/order/add', newInvoice)
      .then(response => {
        toast.success("Tạo hóa đơn thành công thành công ", toastOptions);
        const createdInvoice = response.data.data;
        setInvoices([createdInvoice, ...invoices]); // Add the new invoice to the top of the list
        setSelectedInvoiceId(createdInvoice.id); // Select the newly created invoice
        setCanAdd(true);
        setPromo({});
        clearInterval(qrIntervalRef.current);
        qrIntervalRef.current = null;
        setQrImageUrl(null);
        setDelivery(false);
        setPhoneNumber("");
        setCustomer(null);
        setCustomerInfo({
          name: '',
          phone: '',
          province: '',
          district: '',
          ward: '',
          address: '',
          note: '',
        });
      })
      .catch(error => console.error('Error adding invoice:', error));
  };


  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setQuantity(1);
  };

  // const handleRemoveItem = (orderDetailID, productDetailID) => {
  //     axios.get(`http://localhost:8080/counter/update-quantity2?orderDetailID=${orderDetailID}&productDetailID=${productDetailID}&quantity=${newQuantitya}`)
  //         .then(response => {
  //           fetchProducts();
  //           fetchOrderItems();

  //         })
  //         .catch(error => {
  //           console.error('Error removing item:', error);
  //           toast.error("Xóa sản phẩm khỏi giỏ hàng thất bại ", toastOptions);
  //         });

  // };
  const handleRemoveItemId = (orderDetailID, productDetailID) => {
    fetchOrderItems();
    axios.get(`http://localhost:8080/order-detail`)
      .then(response => {
        const orderDetails = response.data.data;
        const itemToRemove = orderDetails.find(item => item.id === orderDetailID && item.productDetail.id === productDetailID);

        if (!itemToRemove) {
          toast.error("Sản phẩm không tồn tại trong giỏ hàng ", toastOptions);
          return;
        }

        axios.get(`http://localhost:8080/counter/update-quantity3?orderDetailID=${orderDetailID}&productDetailID=${productDetailID}&quantity=${newQuantitya}`)
          .then(() => {
            fetchProducts();
            fetchOrderItems();
            toast.success("Xóa sản phẩm khỏi giỏ hàng thành công ", toastOptions);
            clearInterval(qrIntervalRef.current);
            qrIntervalRef.current = null;
            setQrImageUrl(null);
          })
          .catch(error => {
            console.error('Error removing item:', error);
            toast.error("Xóa sản phẩm khỏi giỏ hàng thất bại ", toastOptions);
          });
      })
      .catch(error => {
        console.error('Error fetching order items:', error);
        toast.error("Đã xảy ra lỗi khi kiểm tra sản phẩm trong giỏ hàng ", toastOptions);
      });
  };

  const handleSelectProduct = (product) => {

    if (selectedInvoiceId === null) {
      toast.warn("Vui lòng chọn hóa đơn trước khi thêm sản phẩm ", toastOptions);
      return
    }

    setSelectedProduct(product);
    setQuantity(1);
    handleShowModal();
  };

  const handleAddToCart = () => {
    fetchProducts();
    axios.get('http://localhost:8080/product-detail')
      .then(response => {
        const productDetails = response.data.data;
        const selectedProductDetail = productDetails.find(product => product.id === selectedProduct.id);

        if (!selectedProduct || quantity <= 0) {
          toast.error("Vui lòng nhập lại số lượng", toastOptions);

          return;
        }

        if (!selectedProductDetail || selectedProductDetail.quantity < quantity || selectedProductDetail.quantity === 0) {
          toast.error("Sản phẩm không đủ số lượng trong kho", toastOptions);
          handleCloseModal();
          return;
        }

        addToCart(selectedInvoiceId, selectedProduct.id, quantity)
          .then(() => {
            fetchProducts();
            fetchOrderItems(); // Đảm bảo gọi lại để cập nhật giỏ hàng
            handleCloseModal();
            toast.success("Thêm sản phẩm vào giỏ hàng thành công ", toastOptions);
            clearInterval(qrIntervalRef.current);
            qrIntervalRef.current = null;
            setQrImageUrl(null);
          })
          .catch(error => {
            console.error('Error adding to cart:', error);
            toast.error("Thêm sản phẩm vào giỏ hàng thất bại ", toastOptions);
          });
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        toast.error("Đã xảy ra lỗi khi kiểm tra sản phẩm", toastOptions);
      });


  };

  const handleQuantityChange = (item, newQuantity) => {
    fetchOrderItems();
    axios.get(`http://localhost:8080/order-detail`)
      .then(response => {
        const orderDetails = response.data.data;
        const itemToRemove = orderDetails.find(items => items.id === item.id && items.productDetail.id === item.productDetail.id);

        if (!itemToRemove) {
          toast.error("Sản phẩm không tồn tại trong giỏ hàng ", toastOptions);
          return;
        }
        if (item.quantity === newQuantity) {
          toast.warn("Sản phẩm số lượng đã đến giới hạn ", toastOptions);
          return;
        }
        if (newQuantity < 0 || itemToRemove.productDetail.quantity + itemToRemove.quantity < newQuantity) return;
        axios.get(`http://localhost:8080/counter/update-quantity?orderDetailID=${item.id}&productDetailID=${item.productDetail.id}&quantity=${newQuantity}`)
          .then(response => {
            toast.success("Cập nhật số lượng thành công ", toastOptions);
            fetchProducts();
            fetchOrderItems();
            clearInterval(qrIntervalRef.current);
            qrIntervalRef.current = null;
            setQrImageUrl(null);
          })
          .catch(error => console.error('Error updating quantity:', error));
      })
      .catch(error => {
        console.error('Error fetching order items:', error);
        toast.error("Đã xảy ra lỗi khi kiểm tra sản phẩm trong giỏ hàng ", toastOptions);
      });
  };
  const handleQuantityChangeInput = (item, newQuantity) => {
    clearInterval(qrIntervalRef.current);
    qrIntervalRef.current = null;
    setQrImageUrl(null);
    axios.get(`http://localhost:8080/order-detail`)
      .then(response => {
        const orderDetails = response.data.data;
        const itemToRemove = orderDetails.find(items => items.id === item.id && items.productDetail.id === item.productDetail.id);

        if (!itemToRemove) {
          toast.error("Sản phẩm không tồn tại trong giỏ hàng ", toastOptions);
          fetchOrderItems();
          fetchProducts();
          return;
        }

        if (newQuantity < 0 || item.productDetail.quantity + item.quantity < newQuantity) return;
        axios.get(`http://localhost:8080/counter/update-quantity?orderDetailID=${item.id}&productDetailID=${item.productDetail.id}&quantity=${newQuantity}`)
          .then(response => {
            fetchProducts();
            fetchOrderItems();
          })
          .catch(error => console.error('Error updating quantity:', error));
      })
      .catch(error => {
        console.error('Error fetching order items:', error);
        toast.error("Đã xảy ra lỗi khi kiểm tra sản phẩm trong giỏ hàng ", toastOptions);
      });
  };
  const handleScan = (data) => {

    if (!selectedInvoiceId) {
      console.log("Vui lòng chọn hóa đơn ");
      toast.warn("Vui lòng chọn hóa đơn ", toastOptions);
      setIsQrReaderVisible(false);
      return;
    }

    if (data && selectedInvoiceId) {
      console.log("Đã quét mã QR:", data.text);
      setIsQrReaderVisible(false);
      setTimeout(() => {
        setIsQrReaderVisible(true);
      }, 2000);

      axios.get(`http://localhost:8080/counter/add-to-cart?orderID=${selectedInvoiceId}&productID=${data.text}&purchaseQuantity=1`)
        .then(response => {
          // Load lại bảng sản phẩm và giỏ hàng sau khi thêm thành công
          fetchProducts();
          fetchOrderItems();
          toast.success("Thêm sản phẩm thành công ", toastOptions);
          clearInterval(qrIntervalRef.current);
          qrIntervalRef.current = null;
          setQrImageUrl(null);
        })
        .catch(error => {
        });
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  // const removeItemsByInvoice = (id) => {
  //   axios.get(`http://localhost:8080/order-detail`)
  //     .then(response => {
  //       const itemsToRemove = response.data.data.filter(item => item.order.id === id);
  //       itemsToRemove.forEach(item => {
  //         handleRemoveItem(item.id, item.productDetail.id);
  //       });
  //     })
  //     .catch(error => console.error('Error fetching order items:', error));
  // };

  const removeSelectedInvoice = (id) => {
    if (id) {
      toast.success("Hóa đơn hủy thành công", toastOptions);

      axios.delete(`http://localhost:8080/counter/delete-order/${id}`)
        .then(response => {
          //handleDeleteInvoice(id);
          // fetchInvoices(); // Reload the invoice list after deletion
          fetchInvoices();
          fetchProducts();
          if (selectedInvoiceId === id) {
            clearInterval(qrIntervalRef.current);
            qrIntervalRef.current = null;
            setQrImageUrl(null);
            setSelectedInvoiceId(null);
            setTotalAmount(0);
            setPromo({});
            setDelivery(false);
            setPhoneNumber("");
            setCustomer(null);
            setCustomerInfo({
              name: '',
              phone: '',
              province: '',
              district: '',
              ward: '',
              address: '',
              note: '',
            });
          }

        })
        .catch(error => console.error('Error deleting invoice:', error));
    }
  };

  const handleSelectInvoice = (index) => {
    clearInterval(qrIntervalRef.current);
    qrIntervalRef.current = null;
    setQrImageUrl(null);


    const selectedInvoiceId = invoices[index].id;


    if (setPhoneNumber) setPhoneNumber("");
    if (setDelivery) setDelivery(false);
    if (promo) setPromo({});
    setSelectedInvoiceId(selectedInvoiceId);

  };

  // const handleDeleteInvoice = (invoiceId) => {
  //   if (selectedInvoiceId === invoiceId) {
  //     setSelectedInvoiceId(null);
  //   }
  // };

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
                <Button variant="primary" className=" px-4 py-2" onClick={addInvoice} disabled={!canAdd}>
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
                      onClick={() => removeSelectedInvoice(invoice.id)}
                    >
                      X
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="cart-container">
              <h3 style={{ fontWeight: 'bold' }}>Giỏ hàng</h3>
              {/* Bảng giỏ hàng */}
              <div className="table-responsive" >
                <div style={{ height: '300px', overflowY: 'auto' }}>
                  <Table hover >
                    <thead>
                      <tr>
                        <th style={{ fontWeight: 'bold' }}>Sản phẩm </th>


                        <th style={{ fontWeight: 'bold' }}>Giá (VND)</th>
                        <th style={{ fontWeight: 'bold' }}>Số lượng </th>
                        <th style={{ fontWeight: 'bold' }}>Tổng tiền </th>
                        <th style={{ fontWeight: 'bold' }}>Hàng động </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCartItems.map(item => (
                        <tr key={item.id}>
                          <td style={{ fontWeight: 'bold' }}>{item.productDetail.product.productName} - {item.productDetail.color.colorName} - {item.productDetail.size.sizeName}</td>


                          <td style={{ whiteSpace: 'nowrap', width: '1%', fontWeight: 'bold' }}>{item.price.toLocaleString()} </td>
                          <td style={{ whiteSpace: 'nowrap', width: '1%' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <button type="button" className="btn btn-dark btn-sm btn-rounded btn-icon"
                                onClick={() => handleQuantityChange(item, Math.max(1, item.quantity - 1))}
                                style={{ width: '20px', height: '20px', fontWeight: 'bold' }}
                              ><i className="mdi mdi-minus"></i></button>
                              <Form.Control
                                type="tel"
                                min="1"
                                max={item.productDetail.quantity}
                                value={item.quantity}
                                onChange={(e) => handleQuantityChangeInput(item, Number(e.target.value))}
                                onBlur={() => {

                                  if (item.quantity === 0) {
                                    handleRemoveItemId(item.id, item.productDetail.id);
                                  }
                                }}
                                style={{ width: '40px', textAlign: 'center', height: '20px', padding: '5px', fontSize: '14px', fontWeight: "bold" }}
                              />
                              <button type="button" className="btn btn-dark btn-sm btn-rounded btn-icon"
                                onClick={() => handleQuantityChange(item, Math.min(item.productDetail.quantity + item.quantity, item.quantity + 1))}
                                style={{ width: '20px', height: '20px', fontWeight: 'bold' }}
                              >
                                <i className="mdi mdi-plus"></i>
                              </button>
                            </div>
                          </td>
                          <td style={{ whiteSpace: 'nowrap', width: '1%', fontWeight: 'bold' }}>{item.totalPrice.toLocaleString()} </td>
                          <td style={{ whiteSpace: 'nowrap', width: '1%' }}>
                            <i
                              className="mdi mdi-cart-off"
                              style={{ fontSize: '20px', cursor: 'pointer' }}
                              onClick={() => {
                                handleRemoveItemId(item.id, item.productDetail.id);
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
                  <h3 style={{ fontWeight: 'bold' }}>Danh sách sản phẩm</h3>
                </Col>
                <Col className="d-flex justify-content-end">

                  {isQrReaderVisible && (
                    <div>
                      <QrReader
                        delay={5000}
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
                </Col>
              </Row>
              <Row>
                <Col className="d-flex justify-content-end">
                  <div className="d-flex align-items-center flex-wrap">
                    <Form.Control
                      type="text"
                      placeholder="Tìm kiếm sản phẩm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        marginRight: "10px",
                        marginBottom: "10px",
                        width: "160px",
                        height: "30px",
                        fontWeight: "bold",
                        color: "black", // Ensure text color is always visible
                        backgroundColor: "white", // Ensure background color is not faint
                      }}
                    />
                    <Form.Control
                      as="select"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      style={{
                        marginRight: "10px",
                        marginBottom: "10px",
                        width: "160px",
                        height: "30px",
                        fontWeight: "bold",
                        color: "black", // Ensure text color is always visible
                        backgroundColor: "white",   // Ensure background color is not faint
                      }}
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
                      style={{
                        marginRight: "10px",
                        marginBottom: "10px",
                        width: "160px",
                        height: "30px",
                        fontWeight: "bold",
                        color: "black", // Ensure text color is always visible
                        backgroundColor: "white", // Ensure background color is not faint
                      }}
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
                      style={{
                        marginRight: "10px",
                        marginBottom: "10px",
                        width: "170px",
                        height: "30px",
                        fontWeight: "bold",
                        color: "black", // Ensure text color is always visible
                        backgroundColor: "white", // Ensure background color is not faint
                      }}
                    >
                      <option value="" >Tất cả thương hiệu</option>
                      {[...new Set(availableProducts.map(product => product.product.brand.brandName))].map(brand => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      as="select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      style={{
                        marginRight: "10px",
                        marginBottom: "10px",
                        width: "160px",
                        height: "30px",
                        fontWeight: "bold",
                        color: "black", // Ensure text color is always visible
                        backgroundColor: "white", // Ensure background color is not faint
                      }}
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
                      style={{
                        marginRight: "10px",
                        marginBottom: "10px",
                        width: "160px",
                        height: "30px",
                        fontWeight: "bold",
                        color: "black", // Ensure text color is always visible
                        backgroundColor: "white", // Ensure background color is not faint
                      }}
                    >
                      <option value="">Tất cả chất liệu</option>
                      {[...new Set(availableProducts.map(product => product.product.material.materialName))].map(material => (
                        <option key={material} value={material}>{material}</option>
                      ))}
                    </Form.Control>
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Giá từ"
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) || 0 })}
                      style={{
                        marginRight: "10px", marginBottom: "10px", width: "160px", height: "30px", fontWeight: "bold",
                        color: "black", // Ensure text color is always visible
                        backgroundColor: "white",
                      }}
                    />
                    <Form.Control
                      type="number"
                      min="0"
                      placeholder="Giá đến"
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) || Infinity })}
                      style={{
                        marginRight: "10px", marginBottom: "10px", width: "160px", height: "30px", fontWeight: "bold",
                        color: "black", // Ensure text color is always visible
                        backgroundColor: "white",
                      }}
                    />
                  </div>
                </Col>
              </Row>
              <hr />
              {/* Bảng chọn sản phẩm */}
              <div className="table-responsive">
                <div style={{ height: '430px', overflowY: 'auto' }}>
                  <Table hover>
                    <thead>
                      <tr>
                        <th style={{ fontWeight: 'bold' }}>Hình ảnh  </th>
                        <th style={{ fontWeight: 'bold' }}>Sản phẩm </th>
                        <th style={{ fontWeight: 'bold' }}>Giá (VND)</th>
                        <th style={{ fontWeight: 'bold' }}>Số lượng </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProducts.map(product => (
                        <tr key={product.id} onClick={(() => handleSelectProduct(product))}>
                          <td style={{ fontWeight: 'bold' }} >{product.product.mainImage != "image.png" ? (
                            <img
                              src={product.product.mainImage}
                              alt="Product"
                              style={{ width: '50px', height: 'auto', cursor: 'pointer', borderRadius: '5%', objectFit: 'contain' }}

                            />
                          ) : (
                            <span>No Image</span>
                          )}</td>
                          <td style={{ fontWeight: 'bold' }}>{product.product.productName} - {product.color.colorName} - {product.size.sizeName}</td>
                          <td style={{ fontWeight: 'bold' }}>{product.price ? product.price.toLocaleString() : 'N/A'} </td>
                          <td style={{ fontWeight: 'bold' }} >{product.quantity}</td>
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
                  <Modal.Title style={{ fontWeight: 'bold' }}>Nhập số lượng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {selectedProduct && (
                    <div>
                      <h5>{selectedProduct.product.productName}</h5>
                      <p style={{ fontWeight: 'bold' }}>Giá: {selectedProduct.price.toLocaleString()} VND</p>
                      <p style={{ fontWeight: 'bold' }}>Kho: {selectedProduct.quantity}</p>
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
                  <Button variant="dark" onClick={handleCloseModal}>
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
              delivery={delivery} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} setDelivery={setDelivery}
              promo={promo} setPromo={setPromo}
              customer={customer} setCustomer={setCustomer}
              customerInfo={customerInfo} setCustomerInfo={setCustomerInfo}
              qrImageUrl={qrImageUrl} setQrImageUrl={setQrImageUrl} qrIntervalRef={qrIntervalRef}
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
