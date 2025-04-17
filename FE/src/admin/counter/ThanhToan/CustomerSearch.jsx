import React, { useState, useEffect } from 'react';
import { Row, Col, InputGroup, Form, Button, Modal } from 'react-bootstrap';
import { toast } from "react-toastify";
import { fetchCustomers, addCustomer, fetchProvinces, fetchDistricts, fetchWards, addCustomerAddress } from '../api'; // Correct the relative path
import { toastOptions } from '../constants'; // Import constants

const CustomerSearch = ({ customer, setCustomer, setDelivery,
  setShippingFee, totalAmount, setFinalAmount, phoneNumber,
  setPhoneNumber, setQrImageUrl, qrIntervalRef, customerInfo, setCustomerInfo }) => {

  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ fullName: '', phone: '', email: '', gender: '', dateOfBirth: '', address: '' });
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  useEffect(() => {
    fetchProvinces()
      .then(response => setProvinces(response.data.data))
      .catch(error => console.error("Lỗi lấy tỉnh/thành phố:", error));
  }, []);

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    const provinceName = e.target.options[e.target.selectedIndex].text;
    setSelectedProvince(provinceId);
    setSelectedDistrict('');
    setSelectedWard('');
    setDistricts([]);
    setWards([]);
    setCustomerInfo({ ...customerInfo, province: provinceName });
    setNewCustomer({ ...newCustomer, province: provinceName });
    fetchDistricts(provinceId)
      .then(response => setDistricts(response.data.data))
      .catch(error => console.error("Lỗi lấy quận/huyện:", error));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    const districtName = e.target.options[e.target.selectedIndex].text;
    setSelectedDistrict(districtId);
    setSelectedWard('');
    setWards([]);
    setCustomerInfo({ ...customerInfo, district: districtName });
    setNewCustomer({ ...newCustomer, district: districtName });
    fetchWards(districtId)
      .then(response => setWards(response.data.data))
      .catch(error => console.error("Lỗi lấy phường/xã:", error));
  };

  const handleWardChange = (e) => {
    const wardName = e.target.options[e.target.selectedIndex].text;
    setSelectedWard(e.target.value);
    setNewCustomer({ ...newCustomer, ward: wardName });
    setCustomerInfo({ ...customerInfo, ward: wardName });
  };

  const handleSearchCustomer = async () => {
    // Validate phone number length
    if (!phoneNumber.trim() || !/^0\d{9}$/.test(phoneNumber)) {
          toast.error("Số điện thoại phải bắt đầu bằng số 0 và gồm 10 chữ số ", toastOptions);
          return;
        }

    try {

      const response = await fetchCustomers();
      const customer = response.data.data.find(c => c.phone === phoneNumber);
     
     console.log("customer", customer)
      if (!customer) {
        toast.error("Không tìm thấy khách hàng", toastOptions);
        return;
      }
      setQrImageUrl(null);
      setCustomer(customer);
      toast.success("Tìm thấy khách hàng ", toastOptions);
      setCustomerInfo({ ...customerInfo, fullName: customer.fullName, phone: customer.phone });
      clearInterval(qrIntervalRef.current);
      qrIntervalRef.current = null;
      setQrImageUrl(null);
    } catch (error) {
      console.error('Lỗi tìm kiếm khách hàng:', error);
      toast.error("Lỗi khi tìm kiếm khách hàng ", toastOptions);
    }
  };

  const handleAddCustomer = async () => {
    // Validation
    if (!newCustomer.fullName.trim()) {
      toast.error("Họ tên không được để trống ", toastOptions);
      return;
    }

    if (newCustomer.fullName.length > 255) {
      toast.error("Họ tên không được vượt quá 255 ký tự ", toastOptions);
      return;
    }

    if (!newCustomer.phone.trim() || !/^\d+$/.test(newCustomer.phone)) {
      toast.error("Số điện thoại không hợp lệ ", toastOptions);
      return;
    }

   if (!newCustomer.email.trim() || !/^0\d{9}$/.test(phoneNumber)) {
      toast.error("Số điện thoại phải bắt đầu bằng số 0 và gồm 10 chữ số ", toastOptions);
      return;
    }

    if (!newCustomer.email.trim() || !/\S+@\S+\.\S+/.test(newCustomer.email)) {
      toast.error("Email không hợp lệ ", toastOptions);
      return;
    }
    
    if (newCustomer.email.length > 255) {
      toast.error("Email không được vượt quá 255 ký tự ", toastOptions);
      return;
    }

    if (!newCustomer.gender) {
      toast.error("Vui lòng chọn giới tính ", toastOptions);
      return;
    }

    if (!newCustomer.dateOfBirth) {
      toast.error("Vui lòng chọn ngày sinh ", toastOptions);
      return;
    }

    if (!selectedProvince || !selectedDistrict || !selectedWard || !newCustomer.address) {
      toast.error("Vui lòng nhập đầy đủ địa chỉ ", toastOptions);
      return;
    }

    if (newCustomer.address.length > 255) {
      toast.error("Địa chỉ cụ thể không được vượt quá 255 ký tự ", toastOptions);
      return;
    }

    const response = await fetchCustomers();
    const customer = response.data.data.find(c => c.phone === newCustomer.phone);
    if (customer) {
      toast.error("Số điện thoại đã tồn tại ", toastOptions);
      return;
    }

    try {
      const responseCustomer = await addCustomer({
        fullName: newCustomer.fullName,
        phone: newCustomer.phone,
        birthDate: newCustomer.dateOfBirth,
        gender: newCustomer.gender,
        email: newCustomer.email,
      });
      setCustomer(responseCustomer.data.data);
      setPhoneNumber(newCustomer.phone); // Display the phone number
      setCustomerInfo({ ...customerInfo, fullName: newCustomer.fullName, phone: newCustomer.phone }); // Display the name
      setShowAddCustomerModal(false);
      setDelivery(false);
      setShippingFee(0);
      setFinalAmount(totalAmount);
      clearInterval(qrIntervalRef.current);
      qrIntervalRef.current = null;
      setQrImageUrl(null);

      let addressPayload = {
        city: newCustomer.province,
        district: newCustomer.district,
        ward: newCustomer.ward,
        detailedAddress: newCustomer.address,
        customerId: responseCustomer.data.data.id,
        status: 1,
        defaultAddress: true,
      };
      await addCustomerAddress(addressPayload);
      toast.success("Thêm khách hàng thành công", toastOptions);
    } catch (error) {
      console.error('Lỗi thêm khách hàng:', error);
      toast.error("Thêm khách hàng thất bại", toastOptions);
    }
  };

  return (
    <>

      <Row className="mb-3">
        <Col sm={12}>
          <Button variant="primary" onClick={() => {
            setShowAddCustomerModal(true)

            clearInterval(qrIntervalRef.current);
                qrIntervalRef.current = null;
                setQrImageUrl(null);
          }}>
            Thêm khách hàng
          </Button>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col sm={12}>
          <InputGroup>
            <Form.Control
              type="tel"
              style={{ fontWeight: 'bold' }}
              placeholder="Nhập số điện thoại"
              value={phoneNumber}
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
                setPhoneNumber(onlyNumbers);
              }}
            />
            <Button
              variant="primary" // Set button color to "primary"
              style={{ flex: "0 0 auto", padding: "6px 12px" }}
              onClick={handleSearchCustomer}
            >
              Tìm kiếm
            </Button>
          </InputGroup>
        </Col>

      </Row>



      <Row className="mb-3">
        <Col sm={12}>
          <InputGroup>

            <h5 style={{ marginRight: "15px", fontWeight: "bold" }}>Khách hàng: {customer ? customer.fullName : 'khách lẻ'}</h5>
            <h5
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => {
                if (!customer) return;
                setCustomerInfo({ ...customerInfo, fullName: '', phone: '' });
                setCustomer(null);
                setPhoneNumber('');
                setDelivery(false);
                setShippingFee(0);
                toast.info("Đã xóa thông tin khách hàng ", toastOptions);
                clearInterval(qrIntervalRef.current);
                qrIntervalRef.current = null;
                setQrImageUrl(null);
              }}
            >
              X
            </h5>
          </InputGroup>
        </Col>
      </Row>

      {/* Modal thêm khách hàng */}
      <Modal
        show={showAddCustomerModal}
        onHide={() => setShowAddCustomerModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton >
          <Modal.Title style={{ fontWeight: 'bold' }}>Thêm Khách Hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body >
          <Form>
            <Row>
              <Col sm={6}>
                <h5 style={{ fontWeight: 'bold' }}>Thông tin</h5>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Họ tên</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ fontWeight: 'bold' }}
                    placeholder="Nhập họ tên"
                    value={newCustomer.fullName}
                    onChange={(e) => setNewCustomer({ ...newCustomer, fullName: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Số điện thoại</Form.Label>
                  <Form.Control
                    type="tel"
                    style={{ fontWeight: 'bold' }}
                    placeholder="Nhập số điện thoại"
                    value={newCustomer.phone}
                    onChange={(e) => {
                      const onlyNumbers = e.target.value.replace(/\D/g, '');
                      setNewCustomer({ ...newCustomer, phone: onlyNumbers });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Email</Form.Label>
                  <Form.Control
                    type="email"
                    style={{ fontWeight: 'bold' }}
                    placeholder="Nhập email"
                    value={newCustomer.email}
                    onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  />
                </Form.Group>
                <Form.Group className="mb-3" >
                  <Form.Label style={{ fontWeight: 'bold' }}>Giới tính</Form.Label>
                  <div style={{ marginLeft: '20px' }}>
                    <Form.Check
                      type="radio"
                      id="gender-male"
                      label="Nam"
                      name="gender"
                      value="0"
                      checked={newCustomer.gender === "0"}
                      onChange={(e) => setNewCustomer({ ...newCustomer, gender: e.target.value })}
                      style={{ fontWeight: 'bold', display: 'inline-block' }}
                    />
                    <Form.Check
                      type="radio"
                      id="gender-female"
                      label="Nữ"
                      name="gender"
                      value="1"
                      checked={newCustomer.gender === "1"}
                      onChange={(e) => setNewCustomer({ ...newCustomer, gender: e.target.value })}
                      style={{ fontWeight: 'bold', display: 'inline-block', marginLeft: '40px' }}
                    />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Ngày sinh</Form.Label>
                  <Form.Control
                    type="date"
                    style={{ fontWeight: 'bold' }}
                    value={newCustomer.dateOfBirth}
                    onChange={(e) => setNewCustomer({ ...newCustomer, dateOfBirth: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <h5 style={{ fontWeight: 'bold' }}>Địa chỉ</h5>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Tỉnh/ Thành phố</Form.Label>
                  <Form.Control as="select"
                    onChange={handleProvinceChange}
                    style={{
                      fontWeight: "bold",
                      color: "black", // Ensure text color is always visible
                      backgroundColor: "white", // Ensure background color is not faint
                    }}
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map(province => (
                      <option key={province.PROVINCE_ID} value={province.PROVINCE_ID} style={{ fontWeight: 'bold' }}>{province.PROVINCE_NAME}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Quận/Huyện</Form.Label>
                  <Form.Control as="select" onChange={handleDistrictChange} disabled={!selectedProvince} style={{
                    fontWeight: "bold",
                    color: "black", // Ensure text color is always visible
                    backgroundColor: "white", // Ensure background color is not faint
                  }}>
                    <option value="">Chọn quận/huyện</option>
                    {districts.map(district => (
                      <option key={district.DISTRICT_ID} value={district.DISTRICT_ID} style={{ fontWeight: 'bold' }}>{district.DISTRICT_NAME}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Phường/Xã</Form.Label>
                  <Form.Control as="select" onChange={handleWardChange} disabled={!selectedDistrict} style={{
                    fontWeight: "bold",
                    color: "black", // Ensure text color is always visible
                    backgroundColor: "white", // Ensure background color is not faint
                  }}>
                    <option value="">Chọn phường/xã</option>
                    {wards.map(ward => (
                      <option key={ward.WARDS_ID} value={ward.WARDS_ID} style={{ fontWeight: 'bold' }}>{ward.WARDS_NAME}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold' }}>Địa chỉ chi tiết</Form.Label>
                  <Form.Control
                    type="text"
                    style={{ fontWeight: 'bold' }}
                    placeholder="Nhập địa chỉ chi tiết"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => setShowAddCustomerModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleAddCustomer}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  );
};

export default CustomerSearch;
