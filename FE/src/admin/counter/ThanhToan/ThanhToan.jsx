import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Modal } from 'react-bootstrap';
import CustomerSearch from './CustomerSearch';
import DeliveryInfo from './DeliveryInfo';
import PromoCode from './PromoCode';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchShippingFee, confirmPayment, updatePromoCode, addOrderVoucher, checkVNPayPaymentStatus, generateZaloPayPayment, checkZaloPayPaymentStatus, handleCassoWebhook, fetchCassoTransactions, fetchPromoCodes } from '../api'; // Updated import
import { toastOptions } from '../constants'; // Import constants from the new file
import logo from '../../../assets/images/logo_h2tl.png';
const PaymentInfo = ({ idOrder, orderDetail, totalAmount, delivery, phoneNumber, setPhoneNumber, setDelivery, promo, setPromo, customer, setCustomer, customerInfo, setCustomerInfo, qrImageUrl, setQrImageUrl, qrIntervalRef ,change , setChange}) => {

  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  const [paymen, setPaymen] = useState('');
  const [isCashPayment, setIsCashPayment] = useState(false);
  const [isQRModalVisible, setIsQRModalVisible] = useState(false);
  const [cashPaid, setCashPaid] = useState();
  
  let interval = null;

  const [finalAmount, setFinalAmount] = useState(totalAmount);
  const [isPaymentEnabled, setIsPaymentEnabled] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);
  // Use useRef to store the interval ID
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false); // New state variable
  const [showPrintModal, setShowPrintModal] = useState(false); // State for the confirmation modal

  useEffect(() => {
    let calculatedDiscount = 0;
    if (promo && totalAmount >= promo.minOrderValue) { // Fixed condition
      calculatedDiscount = promo.discountValue;
      if (promo.discountType === 1) {
        calculatedDiscount = (totalAmount * promo.discountValue) / 100;
        if (calculatedDiscount > promo.maxDiscountValue) {
          calculatedDiscount = promo.maxDiscountValue;
        }
      }
    } else if (promo.voucherCode) {
      setPromo({});
    }
    const calculatedFinalAmount = totalAmount - calculatedDiscount;
    setFinalAmount(calculatedFinalAmount < 0 ? 0 : calculatedFinalAmount); // Ensure finalAmount is not less than 0
  }, [totalAmount, promo]);

  useEffect(() => {
    const isEligibleForPayment = (paymen === 1 || paymen === 3 || paymen === 2) && totalAmount >= 0 && (paymen === 1 ? change >= 0 : true);
    setIsPaymentEnabled(isEligibleForPayment);
  }, [paymen, totalAmount, change]);

  const fetchShippingFeeWrapper = async (customerInfo) => {
    if (!customerInfo.province || !orderDetail) {
      return 0;
    }
    try {
      const selectedOrderDetail = orderDetail.filter(item => String(item.order.id) === String(idOrder));
      const totalWeight = selectedOrderDetail.reduce((sum, item) => sum + item.quantity, 0) * 600;

      const response = await fetchShippingFee({
        PRODUCT_WEIGHT: totalWeight,
        ORDER_SERVICE: selectedProvince == 1 ? "PHS" : "LCOD",
        SENDER_PROVINCE: 1,
        SENDER_DISTRICT: 28,
        RECEIVER_PROVINCE: selectedProvince,
        RECEIVER_DISTRICT: selectedDistrict,
      });

      return response.data.data.MONEY_TOTAL;
    } catch (error) {
      console.error('Error fetching shipping fee:', error);
      return 0;
    }
  };

  useEffect(() => {
    const updateShippingFee = async () => {
      if (delivery && customerInfo.province) {
        const fee = await fetchShippingFeeWrapper(customerInfo);
        setShippingFee(fee);
      } else {
        setShippingFee(0);
      }
    };

    updateShippingFee();
  }, [delivery, customerInfo, orderDetail]);



  const handleShowQR = () => {
    if (!idOrder) {
      toast.warn("Vui lòng chọn hóa đơn trước khi chọn QR ", toastOptions);
      return;
    }
    if (totalAmount === 0) {
      toast.warn("Vui lòng thêm sản phẩm trước khi chọn QR  ", toastOptions);
      return;
    }
    if (finalAmount > 1000000000) {
      toast.warn("Tổng thanh toán không được quá 1000000000", toastOptions);
      return;
    }
    if (promo.voucherCode) {
      fetchPromoCodes().then(response => {
        const promoCodes = response.data.data || [];
        const matchingPromo = promoCodes.find(p => p.voucherCode === promo.voucherCode);
        if (matchingPromo.quantity <= 0) {
          toast.warn("Mã giảm giá số lượng đã hết", toastOptions);
          return;
        }
        if (matchingPromo.status === 0) {
          toast.warn("Mã giảm giá đã hết hiệu lực", toastOptions);
          return;
        }
      })
        .catch(error => console.error('Error fetching promo codes:', error));
    }
    if (qrIntervalRef.current) {
      clearInterval(qrIntervalRef.current);
      qrIntervalRef.current = null;
    }

    setIsCashPayment(false);
    setIsPaymentSuccessful(false);

    const qrUrl = `https://img.vietqr.io/image/MB-02062004666-compact2.jpg?amount=${finalAmount + shippingFee}&addInfo=thanh%20toan%20hoa%20don%20ID${idOrder}HD&accountName=HOANG%20VAN%20TUAN`;
    setQrImageUrl(qrUrl);
    setPaymen(2);
    toast.info("Đã chọn phương thức thanh toán QR ", toastOptions);
    const checkVoucher = setInterval(() => {
      if (promo.voucherCode) {
        fetchPromoCodes().then(response => {
          const promoCodes = response.data.data || [];
          const matchingPromo = promoCodes.find(p => p.voucherCode === promo.voucherCode);
          if (matchingPromo.quantity <= 0) {
            toast.warn("Mã giảm giá số lượng đã hết", toastOptions);
            clearInterval(qrIntervalRef.current);
            qrIntervalRef.current = null;
            setQrImageUrl("");
            clearInterval(checkVoucher);
            return;
          }
          if (matchingPromo.status === 0) {
            toast.warn("Mã giảm giá đã hết hiệu lực", toastOptions);
            clearInterval(qrIntervalRef.current);
            qrIntervalRef.current = null;
            setQrImageUrl("");
            clearInterval(checkVoucher);
            return;
          }
        })
          .catch(error => console.error('Error fetching promo codes:', error));
      }
    }, 5000);
    qrIntervalRef.current = setInterval(async () => {


      try {
        const response = await fetchCassoTransactions();
        const records = response.data.body.data.records || [];
        const matchingRecord = records.find(record =>
          record.description.includes(`thanh toan hoa don ID${idOrder}HD`) && record.amount === (finalAmount + shippingFee)
        );

        if (matchingRecord) {
          clearInterval(qrIntervalRef.current);
          qrIntervalRef.current = null;
          setQrImageUrl("");
          setIsPaymentSuccessful(true);
          toast.success("Thanh toán thành công ", toastOptions);
          setShowPrintModal(true);
          clearInterval(checkVoucher);
          if (promo.voucherCode) {
            await updatePromoCode(promo.id, { ...promo, quantity: promo.quantity - 1 });
            await addOrderVoucher(idOrder, promo.id);
          }
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }

    }, 30000);

  };

  const handleCashPayment = () => {

    if (!idOrder) {
      toast.warn("Vui lòng chọn hóa đơn trước khi chọn tiền mặt", toastOptions);
      return;
    }

    if (totalAmount === 0) {
      toast.warn("Vui lòng thêm sản phẩm trước khi chọn tiền mặt", toastOptions);
      return;
    }
    if (finalAmount > 1000000000) {
      toast.warn("Tổng thanh toán không được quá 1000000000", toastOptions);
      return;
    }
    setQrImageUrl("");
    if (qrIntervalRef.current) {
      clearInterval(qrIntervalRef.current); // Clear the interval
      qrIntervalRef.current = null; // Reset the ref
    }
    setPaymen(1);
    setIsCashPayment(true);
    setChange(-1); // Reset change to avoid validation errors
    setCashPaid(''); // Reset cashPaid input
    toast.info("Đã chọn phương thức thanh toán Tiền mặt ", toastOptions);
  };



  const handlePrintInvoice = () => {
    const selectedOrderDetail = orderDetail.filter(item => String(item.order.id) === String(idOrder));

    const invoiceContent = `
      <html>
      <head>
      <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      .invoice-header {
        text-align: center;
        margin-bottom: 20px;
      }
      .invoice-header h2 {
        margin: 0;
      }
      .invoice-info {
        text-align: left;
        margin-top: 20px;
      }
      .invoice-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }
      .invoice-table th, .invoice-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      .invoice-table th {
        background-color: #f2f2f2;
      }
      .invoice-footer {
        text-align: left;
        margin-top: 20px;
      }
      .invoice-footer p {
        margin: 5px 0;
      }
      .thank-you {
        text-align: center;
        margin-top: 30px;
        font-size: 16px;
        font-weight: bold;
      }
      </style>
      </head>
      <body>
      <div class="invoice-header">
      <image src="${logo}" alt="Logo" style="width: 200px; height: auto;" />
      <h2>H2TL</h2>
      <p>Địa chỉ: Nam Từ Liêm, Hà Nội</p>
      <p>Điện thoại: 0123456789</p>
      <h3>HÓA ĐƠN BÁN HÀNG</h2>
      </div>
      <div class="invoice-info">
      <p><strong>Tên nhân viên:</strong> ${localStorage.getItem("fullName")}</p>
      <p><strong>Mã hóa đơn:</strong> ${selectedOrderDetail[0]?.order?.orderCode || ''}</p>
      <p><strong>Ngày tạo:</strong> ${selectedOrderDetail[0]?.order?.createdAt ? new Date(selectedOrderDetail[0]?.order?.createdAt).toLocaleString('vi-VN') : ''}</p>
      <p><strong>Tên khách hàng:</strong> ${customerInfo.fullName || 'Khách lẻ'}</p>
      <p><strong>Số điện thoại:</strong> ${customerInfo.phone || ''}</p>
      </div>
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Tổng tiền</th>
          </tr>
        </thead>
        <tbody>
        ${Array.isArray(selectedOrderDetail) && selectedOrderDetail.length > 0
        ? selectedOrderDetail
          .filter(item => item.quantity > 0)
          .map(item => `
            <tr>
              <td>${item.productDetail.product.productName} - ${item.productDetail.color.colorName} - ${item.productDetail.size.sizeName}</td>
              <td>${item.quantity}</td>
              <td>${item.price.toLocaleString()} VNĐ</td>
              <td>${(item.quantity * item.price).toLocaleString()} VNĐ</td>
            </tr>
          `).join('')
        : '<tr><td colspan="4" style="text-align: center;">Không có sản phẩm</td></tr>'
      }
        </tbody>
      </table>
      <div class="invoice-footer">
      <p><strong>Tổng tiền hàng:</strong> ${totalAmount.toLocaleString()} VNĐ</p>
      <p><strong>Giảm giá:</strong> ${(totalAmount - finalAmount).toLocaleString()} VNĐ</p>
      <p><strong>Phí vận chuyển:</strong> ${shippingFee.toLocaleString()} VNĐ</p>
      <p><strong>Tổng thanh toán: ${(finalAmount + shippingFee).toLocaleString()} VNĐ</strong></p>
      </div>
      <div class="thank-you">
      Cảm ơn Quý Khách, hẹn gặp lại!
      </div>
      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          }, 500);
        };
      </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
  };

  const handlePaymentConfirmation = async (shouldPrint) => {
    if (promo.voucherCode) {
      fetchPromoCodes().then(response => {
        const promoCodes = response.data.data || [];
        const matchingPromo = promoCodes.find(p => p.voucherCode === promo.voucherCode);
        if (matchingPromo.quantity <= 0) {
          toast.warn("Mã giảm giá số lượng đã hết", toastOptions);
          return;
        }
        if (matchingPromo.status === 0) {
          toast.warn("Mã giảm giá đã hết hiệu lực", toastOptions);
          return;
        }
      })
        .catch(error => console.error('Error fetching promo codes:', error));
    }
    const requestBody = {

      customerId: customer?.id || null,
      customerName: customerInfo.fullName || "Khách lẻ",
      phone: customerInfo.phone || "",
      address: customerInfo.ward ? `${customerInfo.address}, ${customerInfo.ward}, ${customerInfo.district}, ${customerInfo.province}` : "",
      note: customerInfo.note || "",
      shippingFee: shippingFee,
      discountValue: totalAmount - finalAmount,
      totalPrice: totalAmount,
      totalPayment: finalAmount + shippingFee,
      paymentTypeId: delivery ? 2 : 1,
      paymentMethodId: paymen,
    };

    try {
      const response = await confirmPayment(idOrder, requestBody);

      if (response.status === 200) {
        toast.success("Thanh toán thành công ", toastOptions);

        if (promo.voucherCode && paymen === 1) {
          await updatePromoCode(promo.id, { ...promo, quantity: promo.quantity - 1 });
          await addOrderVoucher(idOrder, promo.id);
        }

        if (shouldPrint) {
          handlePrintInvoice();
        }
        setTimeout(() => {
          window.location.reload();
        }
          , 1200);
      } else {
        toast.error("Thanh toán thất bại. Vui lòng thử lại!", toastOptions);
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại!", toastOptions);
    }
  };

  const handleConfirmPayment = () => {

    if (!idOrder) {
      toast.warn("Vui lòng chọn hóa đơn trước khi thanh toán ", toastOptions);
      return;
    }
    if (totalAmount === 0) {
      toast.warn("Vui lòng thêm sản phẩm trước khi thanh toán ", toastOptions);
      return;
    }
    if (!(paymen === 1 || paymen === 2)) {
      toast.warn("Hãy chọn phương thức thanh toán ", toastOptions);
      return;
    }

    if (paymen === 1 && (cashPaid === undefined || cashPaid === "")) {
      toast.warn("Tiền khách đưa không được để trống ", toastOptions);
      return;
    }
    if (paymen === 1 && (change < 0 || change === undefined)) {
      toast.warn("Vui lòng kiểm tra lại tiền khách đưa ", toastOptions);
      return;
    }
    if (!isPaymentEnabled) {
      toast.warn("Vui lòng thực hiện đủ các bước ", toastOptions);
      return;
    }
    if (promo.voucherCode) {
      fetchPromoCodes().then(response => {
        const promoCodes = response.data.data || [];
        const matchingPromo = promoCodes.find(p => p.voucherCode === promo.voucherCode);
        if (matchingPromo.quantity <= 0) {
          toast.warn("Mã giảm giá số lượng đã hết", toastOptions);
          return;
        }
        if (matchingPromo.status === 0) {
          toast.warn("Mã giảm giá đã hết hiệu lực", toastOptions);
          return;
        }
      })
        .catch(error => console.error('Error fetching promo codes:', error));
    }
    if (paymen === 2 && !isPaymentSuccessful) {
      toast.warn("Khách hàng chưa chuyển khoản thành công. Vui lòng kiểm tra lại!", toastOptions);
      return;
    }


    setShowPrintModal(true);
  };

  const handlePrintModalClose = (shouldPrint) => {


    setShowPrintModal(false);
    handlePaymentConfirmation(shouldPrint);
  };

  const handleSaveDeliveryInfo = async (customer) => {
    setDelivery(true);
    // const fee = await fetchShippingFeeWrapper(customer);
    //setShippingFee(fee);
  };

  return (
    <div className="container my-4">
      <h3 style={{ fontWeight: 'bold' }}>Thông tin thanh toán</h3>
      <hr />
      <br />

      <CustomerSearch
        customer={customer}
        setCustomer={setCustomer}
        setDelivery={setDelivery}
        setShippingFee={setShippingFee}
        totalAmount={totalAmount}
        setFinalAmount={setFinalAmount}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        setQrImageUrl={setQrImageUrl}
        qrIntervalRef={qrIntervalRef}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
      />

      <DeliveryInfo delivery={delivery}
        setDelivery={setDelivery}
        onSave={handleSaveDeliveryInfo}
        customer={customer}
        setCustomer={setCustomer}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        idOrder={idOrder}
        totalAmount={totalAmount}
        setSelectedProvince={setSelectedProvince}
        selectedProvince={selectedProvince}
        setSelectedDistrict={setSelectedDistrict}
        selectedDistrict={selectedDistrict}
        setSelectedWard={setSelectedWard}
        selectedWard={selectedWard}
        qrIntervalRef={qrIntervalRef}
        setQrImageUrl={setQrImageUrl}
      />
      <PromoCode promo={promo}
        setPromo={setPromo}
        totalAmount={totalAmount}
        idOrder={idOrder}
        setQrImageUrl={setQrImageUrl}
        qrIntervalRef={qrIntervalRef}
        customer={customer} setChange={setChange} />

      <h5 style={{ fontWeight: 'bold' }}>Tổng tiền hàng: {totalAmount.toLocaleString()} VND</h5>
      <h5 style={{ fontWeight: 'bold' }}>Giảm giá: {(totalAmount - finalAmount).toLocaleString()} VND</h5>
      <h5 style={{ fontWeight: 'bold' }}>Phí vận chuyển: {shippingFee ? shippingFee.toLocaleString() : 0} VND</h5>
      <h5 style={{ fontWeight: 'bold' }}>Tổng thanh toán: {(finalAmount + shippingFee).toLocaleString()} VND</h5>

      <Row className="mb-3">
        <Col sm={6}>
          <Button style={{ fontWeight: 'bold' }}
            variant={paymen === 1 ? "primary" : "light"}
            className="w-100"
            size='sm'
            onClick={handleCashPayment}
          >
            Tiền mặt
          </Button>

        </Col>
        <Col sm={6}>
          <Button style={{ fontWeight: 'bold' }}
            variant={paymen === 2 ? "primary" : "light"}
            className="w-100"
            onClick={handleShowQR}
            size='sm'
          >
            QR
          </Button>
        </Col>
      </Row>

      {qrImageUrl && (
        <div className="text-center mt-3">
          <img src={qrImageUrl} alt="QR Code Thanh Toán" className="img-fluid" style={{ maxWidth: "200px" }} />
        </div>
      )}

      {isCashPayment && (
        <>
          <Row className="mb-3">
            <Col sm={12}>
            <Form.Label style={{ fontWeight: 'bold', marginRight: '10px' }}>Tiền khách trả</Form.Label>
            <Form.Group controlId="formCashPaid" style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Control

                  type="tel"
                  value={cashPaid.toLocaleString()}
                  style={{ fontWeight: 'bold', flex: 1 }}

                  onChange={(e) => {
                    const rawValue = e.target.value.replace(/[^\d]/g, '');
                    const numericValue = rawValue === '' ? 0 : parseInt(rawValue, 10);
                    setCashPaid(numericValue);
                    setChange(numericValue - (finalAmount + shippingFee));
                  }}
                  placeholder="Nhập số tiền khách trả"
                />
                <i
                  className="mdi mdi-clipboard-check"
                  style={{
                    fontSize: '1.5rem',
                    color: '#28a745',
                    cursor: 'pointer',
                    marginLeft: '10px'
                  }}
                  onClick={() => {
                    if (paymen !== 1) {
                      toast.warn("Vui lòng chọn phương thức thanh toán Tiền mặt trước ", toastOptions);
                      return;
                    }
                    setCashPaid(finalAmount);
                    setChange(0);
                  }}
                ></i>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={12}>
              <Form.Group controlId="formChange">
                <Form.Label style={{ fontWeight: 'bold' }}>Tiền thừa</Form.Label>
                <Form.Control
                  type="text"
                  value={change < 0 ? "0" : change.toLocaleString()} // Format the number
                  style={{ fontWeight: 'bold' }}
                  readOnly
                  placeholder="Tiền thừa"
                />
              </Form.Group>
            </Col>
          </Row>
        </>
      )}

      <Row>
        <Col sm={12} style={{ textAlign: 'center' }}>
          <Button variant="primary" className="w-100" onClick={handleConfirmPayment}>
            Xác nhận thanh toán
          </Button>
        </Col>
      </Row>

      <Modal
        show={showPrintModal}
        onHide={() => handlePrintModalClose(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: 'bold', fontSize: '18px' }}>
            <i className="mdi mdi-printer" style={{ marginRight: '8px', color: '#007bff' }}></i>
            Xác nhận in hóa đơn
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ textAlign: 'center', fontSize: '16px', color: '#333', fontWeight: 'bold' }}>
          <p>Bạn có muốn in hóa đơn sau khi thanh toán không?</p>
          <i className="mdi mdi-file-document-outline" style={{ fontSize: '48px', color: '#007bff' }}></i>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: 'center' }}>
          <Button
            variant="dark"
            onClick={() => handlePrintModalClose(false)}
            style={{ padding: '10px 20px', fontWeight: 'bold' }}
          >
            <i className="mdi mdi-close-circle-outline" style={{ marginRight: '5px' }}></i>
            Không
          </Button>
          <Button
            variant="primary"
            onClick={() => handlePrintModalClose(true)}
            style={{ padding: '10px 20px', fontWeight: 'bold' }}
          >
            <i className="mdi mdi-check-circle-outline" style={{ marginRight: '5px' }}></i>
            Có
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentInfo;