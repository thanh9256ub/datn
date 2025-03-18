import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Modal } from 'react-bootstrap';
import CustomerSearch from './CustomerSearch';
import DeliveryInfo from './DeliveryInfo';
import PromoCode from './PromoCode';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentInfo = ({ idOrder, orderDetail, totalAmount }) => {
  const [delivery, setDelivery] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [promo, setPromo] = useState({});
  const [paymen, setPaymen] = useState('');
  const [isCashPayment, setIsCashPayment] = useState(false);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [cashPaid, setCashPaid] = useState('');
  const [change, setChange] = useState();
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [promoCode, setPromoCode] = useState("");
  const [finalAmount, setFinalAmount] = useState(totalAmount);
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    province: '',
    district: '',
    ward: '',
    address: ''
  });

  useEffect(() => {
    let calculatedDiscount = 0;
    if (promo && totalAmount >= promo.condition) {
      calculatedDiscount = promo.discountValue;
      if (promo.discountType === '%') {
        calculatedDiscount = (totalAmount * promo.discountValue) / 100;
        if (calculatedDiscount > promo.maxDiscountValue) {
          calculatedDiscount = promo.maxDiscountValue;
        }
      }
      setPromoCode(promo.voucherCode);

    } else if (promo.voucherCode) {
      setPromo({});
      setPromoCode("");
    }
    setFinalAmount(totalAmount - calculatedDiscount);
  }, [totalAmount, promo, promoCode]);

  useEffect(() => {
    const isEligibleForPayment = (paymen === 'TM' || paymen === 'QR') && totalAmount > 0 && (paymen === 'TM' ? change >= 0 : true);
    setIsPaymentEnabled(isEligibleForPayment);
  }, [paymen, totalAmount, change]);

  const fetchShippingFee = async (customerInfo) => {
    
    try {
      // Calculate total weight
      const selectedOrderDetail = orderDetail.filter(item => String(item.order.id) === String(idOrder));
      const totalWeight = selectedOrderDetail.reduce((sum, item) => sum + item.quantity, 0) * 600;

      const response = await fetch('https://partner.viettelpost.vn/v2/order/getPrice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Token': 'eyJhbGciOiJFUzI1NiJ9.eyJzdWIiOiIwMzM1NjAyMTE1IiwiVXNlcklkIjoxNTgzOTczNCwiRnJvbVNvdXJjZSI6NSwiVG9rZW4iOiJKWEdZV0Q5QTkwQyIsImV4cCI6MTc0MjE4MjU2MCwiUGFydG5lciI6MTU4Mzk3MzR9.hdibqEJCL4qN1qO7JGPMEnisfUgvRdng1pWDaBhVL_Iz71NhRWMCCPXyz9GydOhazXxIzjLYzS26mdacsyRlYg' // Replace with your actual API key
        },
        body: JSON.stringify({
          PRODUCT_WEIGHT: totalWeight,
          ORDER_SERVICE: customerInfo.province == 1 ? "PHS" : "LCOD",
          SENDER_PROVINCE: "1",
          SENDER_DISTRICT: "25",
          RECEIVER_PROVINCE: customerInfo.province,
          RECEIVER_DISTRICT: customerInfo.district
        })
      });
      const data = await response.json();
      return data.data.MONEY_TOTAL;
    } catch (error) {
      console.error('Error fetching shipping fee:', error);
      return 0;
    }
  };

  useEffect(() => {
    const updateShippingFee = async () => {
      if (delivery && customer) {
        const fee = await fetchShippingFee(customer);
        setShippingFee(fee);
      } else {
        setShippingFee(0);
      }
    };
    updateShippingFee();
  }, [delivery, customer,orderDetail]);

  const handleShowQRModal = () => {
    setIsCashPayment(false);

    // URL QR từ VietQR với thông tin thanh toán
    const qrUrl = `https://img.vietqr.io/image/MB-20046666666-compact2.jpg?amount=${totalAmount}&addInfo=thanh%20toan%20hoa%20don%20cua%20TUAN&accountName=HOANG%20VAN%20TUAN`;
    setQrImageUrl(qrUrl);
    setPaymen('QR');
    setIsQRModalVisible(true);
  };

  const handleCloseQRModal = () => setIsQRModalVisible(false);

  const handlePrintInvoice = () => {
    const selectedOrderDetail = orderDetail.find(item => item.order.id === idOrder);


    const invoiceContent = `
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        margin: 20px;
                       
                    }
                    .invoice-header {
                        text-align: center;
                        font-size: 18px;
                        margin-bottom: 20px;
                    }
                    .invoice-details {
                        margin-bottom: 20px;
                    }
                    .invoice-details th, .invoice-details td {
                        padding: 8px;
                        text-align: left;
                    }
                    .invoice-footer {
                        margin-top: 20px;
                        text-align: center;
                    }
                </style>
            </head>
            <body>
                <div class="invoice-header">
                    <h2>Hóa đơn:${selectedOrderDetail.order.orderCode} </h2>
                    <p>Ngày :${selectedOrderDetail.order.createdAt} </p>
                </div>
                <div class="invoice-details">
                    <table border="1" width="100%">
                        <thead>
                            <tr>
                                <th>Tên sản phẩm</th>
                                <th>Màu sắc</th>
                                <th>Kích thước</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                                <th>Tổng tiền </th>
                            </tr>
                        </thead>
                        <tbody>
                            
                         ${Array.isArray(orderDetail) && orderDetail.length > 0
        ? orderDetail
          .filter(item => String(item.order.id) === String(idOrder)) // Chuyển kiểu để đảm bảo so sánh chính xác
          .map(item => `
                <tr>
                    <td>${item.productDetail.product.productName}</td>
                    <td>${item.productDetail.color.colorName}</td>
                    <td>${item.productDetail.size.sizeName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price} VNĐ</td>
                    <td>${item.quantity * item.price} VNĐ</td>
                </tr>
            `).join('')
        : '<tr><td colspan="4">Không có sản phẩm</td></tr>'}
                       
                        </tbody>
                    </table>
                </div>
                <div class="invoice-footer">
                    <p>Tổng tiền: ${finalAmount ? finalAmount.toLocaleString() : 0} VNĐ</p>
                </div>
            </body>
        </html>
    `;


    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    printWindow.print();


  };
  const handlePaymentConfirmation = () => {
    if (!isPaymentEnabled) {
      toast.warn("Vui lòng thực hiện đủ các bước 🥰", {
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
    toast.success("Thanh toán thành công 🥰", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleSaveDeliveryInfo = async (customer) => {
    setCustomer(customer);
    setDelivery(true);
    const fee = await fetchShippingFee(customer);
    setShippingFee(fee);
  };

  return (
    <div className="container my-4">
      <h3>Thông tin thanh toán</h3>
      <hr />
      <br />

      <CustomerSearch

        customer={customer}
        setCustomer={setCustomer}

      />

      <DeliveryInfo delivery={delivery} setDelivery={setDelivery} onSave={handleSaveDeliveryInfo} customer={customer} customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} />
      <PromoCode promoCode={promoCode} setPromo={setPromo} totalAmount={totalAmount} />

      {/* Hiển thị tổng tiền */}
      <h5>Tổng tiền: {totalAmount.toLocaleString()} VND</h5>
      <h5>Giảm giá: {(totalAmount - finalAmount).toLocaleString()} VND</h5>
      <h5>Phí vận chuyển: {shippingFee ? shippingFee.toLocaleString() : 0} VND</h5>
      <h5>Thanh toán: {(finalAmount + shippingFee).toLocaleString()} VND</h5>



      {/* Chọn phương thức thanh toán */}
      <Row className="mb-3">
        <Col sm={7}>
          <Button variant="light" className="w-100" onClick={() => {
            setPaymen('TM');
            setIsCashPayment(true)
          }} >Tiền mặt</Button>
        </Col>
        <Col sm={5}>
          <Button variant="light" className="w-100" onClick={handleShowQRModal}>QR</Button>
        </Col>
      </Row>

      {/* Hiển thị ô nhập tiền khách trả nếu chọn tiền mặt */}
      {isCashPayment && (
        <>
          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group controlId="formCashPaid">
                <Form.Label>Tiền khách trả</Form.Label>
                <Form.Control
                  type="number"
                  value={cashPaid}
                  onChange={(e) => {
                    setCashPaid(e.target.value);

                    setChange(e.target.value - finalAmount);
                  }}
                  placeholder="Nhập số tiền khách trả"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group controlId="formChange">
                <Form.Label>Tiền thừa</Form.Label>
                <Form.Control
                  type="number"
                  value={change}
                  readOnly
                  placeholder="Tiền thừa"
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}

      {/* Xác nhận thanh toán */}
      <Row>
        <Col sm={12}>
          <Button variant="success" className="w-100" onClick={handlePaymentConfirmation} >Xác nhận thanh toán</Button>
          <Button onClick={handlePrintInvoice}> in </Button>
        </Col>
      </Row>

      {/* Modal hiển thị ảnh QR */}
      <Modal show={isQRModalVisible} onHide={handleCloseQRModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>QR Code Thanh Toán</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {qrImageUrl && <img src={qrImageUrl} alt="QR Code Thanh Toán" className="img-fluid" />}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PaymentInfo;