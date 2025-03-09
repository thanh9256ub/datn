import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Modal } from 'react-bootstrap';
import CustomerSearch from './CustomerSearch';
import DeliveryInfo from './DeliveryInfo';
import PromoCode from './PromoCode';

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

  //   useEffect(() => {


  //     setFilteredOrder(filteredData);
  // }, [orderDetails , idOrder]);
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
                                <th>Sản phẩm</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                                <th>Tổng</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                         ${Array.isArray(orderDetail) && orderDetail.length > 0
        ? orderDetail
          .filter(item => String(item.order.id) === String(idOrder)) // Chuyển kiểu để đảm bảo so sánh chính xác
          .map(item => `
                <tr>
                    <td>${item.productDetail.product.productName}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price} VNĐ</td>
                    <td>${item.quantity*item.price} VNĐ</td>
                </tr>
            `).join('')
        : '<tr><td colspan="4">Không có sản phẩm</td></tr>'}
                       
                        </tbody>
                    </table>
                </div>
                <div class="invoice-footer">
                    <p>Tổng tiền: ${finalAmount.toLocaleString()} VNĐ</p>
                </div>
            </body>
        </html>
    `;


    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    printWindow.print();
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

      <DeliveryInfo delivery={delivery} setDelivery={setDelivery} />
      <PromoCode promoCode={promoCode} setPromo={setPromo} totalAmount={totalAmount} />

      {/* Hiển thị tổng tiền */}
      <h5>Tổng tiền: {totalAmount.toLocaleString()} VND</h5>
      <h5>Giảm giá: {(totalAmount - finalAmount).toLocaleString()} VND</h5>
      <h5>Phí vận chuyển: 0 VND</h5>
      <h5>Thanh toán: {finalAmount.toLocaleString()} VND</h5>



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
          <Button variant="success" className="w-100" disabled={!isPaymentEnabled} >Xác nhận thanh toán</Button>
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