import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Modal } from 'react-bootstrap';
import CustomerSearch from './CustomerSearch';
import DeliveryInfo from './DeliveryInfo';
import PromoCode from './PromoCode';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchShippingFee, confirmPayment, updatePromoCode, addOrderVoucher, checkVNPayPaymentStatus, generateZaloPayPayment, checkZaloPayPaymentStatus } from '../api'; // Updated import
import { toastOptions } from '../constants'; // Import constants from the new file

const PaymentInfo = ({ idOrder, orderDetail, totalAmount, delivery, phoneNumber,  setPhoneNumber  ,setDelivery , promo, setPromo,customer,setCustomer,customerInfo,setCustomerInfo }) => {
  
  
 const [wards, setWards] = useState([]);
   const [selectedProvince, setSelectedProvince] = useState('');
   const [selectedDistrict, setSelectedDistrict] = useState('');
   const [selectedWard, setSelectedWard] = useState('');
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
  

  useEffect(() => {
  
  
    let calculatedDiscount = 0;
    if (promo && totalAmount >= promo.condition) {
      calculatedDiscount = promo.discountValue;
      if (promo.discountType === '1') {
        calculatedDiscount = (totalAmount * promo.discountValue) / 100;
        if (calculatedDiscount > promo.maxDiscountValue) {
          calculatedDiscount = promo.maxDiscountValue;
        }
      }
      setPromoCode(promo.voucherCode);

    } else if (promo.voucherCode) {
      setPromo({});
      setPromoCode("");
    }else{
      setPromoCode("");
    }
    setFinalAmount(totalAmount - calculatedDiscount);
  }, [totalAmount, promo, promoCode]);

  useEffect(() => {
    const isEligibleForPayment = (paymen === 1 || paymen === 3|| paymen === 2) && totalAmount >= 0 && (paymen === 1 ? change >= 0 : true);
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

  const handleShowQR = async () => {
    setIsCashPayment(false);

    try {
        // Generate ZaloPay payment request
        const response = await generateZaloPayPayment({
            amount: finalAmount + shippingFee,
            description: "Thanh toán hóa đơn",
        });

        console.log("ZaloPay Response:", response.data); // Log the response to debug

        const { qrCodeUrl, transactionId } = response.data;
        if (qrCodeUrl) {
            setQrImageUrl(qrCodeUrl); // Set the QR code URL
            setPaymen(2);
            toast.info("Đã chọn phương thức thanh toán QR qua ZaloPay 🥰", toastOptions);
        } else {
            toast.error("Không nhận được URL QR từ ZaloPay!", toastOptions);
        }

        // Poll for payment status
        const interval = setInterval(async () => {
            try {
                const statusResponse = await checkZaloPayPaymentStatus(transactionId);
                console.log("Payment Status Response:", statusResponse.data); // Log payment status response
                if (statusResponse.data.status === "SUCCESS") {
                    clearInterval(interval);
                    toast.success("Thanh toán thành công 🥰", toastOptions);
                    handlePaymentConfirmation(); // Trigger payment confirmation
                }
            } catch (error) {
                console.error("Error checking ZaloPay payment status:", error);
            }
        }, 3000); // Check every 3 seconds
    } catch (error) {
        console.error("Error generating ZaloPay payment:", error);
        toast.error("Đã xảy ra lỗi khi tạo thanh toán ZaloPay!", toastOptions);
    }
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
        text-align: left;
        margin-top: 30px;
        font-size: 16px;
        font-weight: bold;
      }
      </style>
      </head>
      <body>
      <div class="invoice-header">
      <h2>H2TL</h2>
      <p>Địa chỉ: Nam Từ Liêm, Hà Nội</p>
      <p>Điện thoại: 0123456789</p>
      <h2>HÓA ĐƠN BÁN HÀNG</h2>
      </div>
      <div class="invoice-info">
      <p><strong>Tên nhân viên:</strong> Hoàng Văn Tuấn</p>
      <p><strong>Mã hóa đơn:</strong> ${selectedOrderDetail[0]?.order?.orderCode || ''}</p>
      <p><strong>Ngày tạo:</strong> ${selectedOrderDetail[0]?.order?.createdAt || ''}</p>
      <p><strong>Tên khách hàng:</strong> ${customerInfo.name || 'Khách lẻ'}</p>
      <p><strong>Số điện thoại:</strong> ${customerInfo.phone || 'N/A'}</p>
      </div>
      <table class="invoice-table">
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
        ${
          Array.isArray(selectedOrderDetail) && selectedOrderDetail.length > 0
          ? selectedOrderDetail
          .filter(item => item.quantity > 0)
          .map(item => `
            <tr>
              <td>${item.productDetail.product.productName} - ${item.productDetail.product.productCode} - ${item.productDetail.color.colorName} - ${item.productDetail.size.sizeName}</td>
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
      <p><strong>Thành tiền: ${(finalAmount + shippingFee).toLocaleString()} VNĐ</strong></p>
      </div>
      <div class="thank-you">
      Cảm ơn Quý Khách, hẹn gặp lại!
      </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handlePaymentConfirmation = async () => {
    if (!isPaymentEnabled) {
      toast.warn("Vui lòng thực hiện đủ các bước 🥰", toastOptions);
      return;
    }
  
    const requestBody = {
      customerId: customer?.id || null,
      customerName: customerInfo.name,
      phone: customerInfo.phone,
      address: `${customerInfo.address}, ${customerInfo.ward}, ${customerInfo.district}, ${customerInfo.province}`,
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
        toast.success("Thanh toán thành công 🥰", toastOptions);
        
        if (promo.voucherCode) {
        
          await updatePromoCode(promo.id, { ...promo, quantity: promo.quantity - 1 });

          // Call API to associate voucher with the order
          await addOrderVoucher(idOrder, promo.id);
        }
        handlePrintInvoice();
        window.location.reload();
      } else {
        toast.error("Thanh toán thất bại. Vui lòng thử lại!", toastOptions);
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại!", toastOptions);
    }
  };
  

  const handleSaveDeliveryInfo = async (customer) => {
    //setCustomer(customer);
    setDelivery(true);
    const fee = await fetchShippingFeeWrapper(customer);
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
        setDelivery={setDelivery}
        setShippingFee={setShippingFee}
        totalAmount={totalAmount}
        setFinalAmount={setFinalAmount}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
      />

  
      <DeliveryInfo delivery={delivery} setDelivery={setDelivery} onSave={handleSaveDeliveryInfo} customer={customer} setCustomer={setCustomer} customerInfo={customerInfo} setCustomerInfo={setCustomerInfo} idOrder={idOrder} totalAmount={totalAmount} 
      setSelectedProvince={setSelectedProvince} selectedProvince={selectedProvince} setSelectedDistrict={setSelectedDistrict} selectedDistrict={selectedDistrict} setSelectedWard={setSelectedWard} selectedWard={selectedWard}
      />
      <PromoCode promoCode={promoCode} setPromo={setPromo} totalAmount={totalAmount} idOrder={idOrder}  />

      {/* Hiển thị tổng tiền */}
      <h5>Tổng tiền: {totalAmount.toLocaleString()} VND</h5>
      <h5>Giảm giá: {(totalAmount - finalAmount).toLocaleString()} VND</h5>
      <h5>Phí vận chuyển: {shippingFee ? shippingFee.toLocaleString() : 0} VND</h5>
      <h5>Thanh toán: {(finalAmount + shippingFee).toLocaleString()} VND</h5>

      {/* Chọn phương thức thanh toán */}
      <Row className="mb-3">
        <Col sm={7}>
          {delivery && (
            <Button
              variant={paymen === 3 ? "primary" : "light"} // Purple when "Trả sau" is selected
              className="w-100 mb-2"
              onClick={() => {
                setPaymen(3);
                setIsCashPayment(false);
                setQrImageUrl(""); // Hide QR code
                toast.info("Đã chọn phương thức thanh toán Trả sau 🥰", toastOptions);
              }}
            >
              Trả sau
            </Button>
          )}
          <Button
            variant={paymen === 1 ? "primary" : "light"} // Purple when "Tiền mặt" is selected
            className="w-100"
            onClick={() => {
              setPaymen(1);
              setIsCashPayment(true);
              setQrImageUrl(""); // Hide QR code
              toast.info("Đã chọn phương thức thanh toán Tiền mặt 🥰", toastOptions);
            }}
          >
            Tiền mặt
          </Button>
        </Col>
        <Col sm={5}>
          <Button
            variant={paymen === 2 ? "primary" : "light"} // Purple when "QR" is selected
            className="w-100"
            onClick={handleShowQR}
          >
            QR
          </Button>
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
                    setChange(e.target.value - (finalAmount + shippingFee));
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


      {/* Hiển thị QR Code nếu có */}
      {qrImageUrl && (
        <div className="text-center mt-3">
          <img src={qrImageUrl} alt="QR Code Thanh Toán" className="img-fluid" style={{ maxWidth: "200px" }} />
        </div>
      )}

      {/* Xác nhận thanh toán */}
      <Row>
        <Col sm={12}>
          <Button variant="primary" className="w-100" onClick={handlePaymentConfirmation} >Xác nhận thanh toán</Button>
          
        </Col>
      </Row>
    </div>
  );
};

export default PaymentInfo;