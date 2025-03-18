import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const DeliveryInfo = ({ delivery, setDelivery, onSave, customer,customerInfo,setCustomerInfo }) => {
  const [tempDelivery, setTempDelivery] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');
  

  useEffect(() => {
    // Fetch provinces from Viettel Post API
    axios.get("https://partner.viettelpost.vn/v2/categories/listProvinceById?provinceId=-1")
      .then(response => setProvinces(response.data.data))
      .catch(error => console.error("Lỗi lấy tỉnh/thành phố:", error));
  }, []);

  const handleProvinceChange = (e) => {
    // console.log(e.target.value);
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedDistrict('');
    setSelectedWard('');
    setDistricts([]);
    setWards([]);
    setCustomerInfo({ ...customerInfo, province: e.target.options[e.target.selectedIndex].text });

    // Fetch districts based on selected province
    axios.get(`https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId=${provinceId}`)
      .then(response => setDistricts(response.data.data))
      .catch(error => console.error("Lỗi lấy quận/huyện:", error));
  };

  const handleDistrictChange = (e) => {
   // console.log(e.target.value);
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedWard('');
    setWards([]);
    setCustomerInfo({ ...customerInfo, district: e.target.options[e.target.selectedIndex].text });

    // Fetch wards based on selected district
    axios.get(`https://partner.viettelpost.vn/v2/categories/listWards?districtId=${districtId}`)
      .then(response => setWards(response.data.data))
      .catch(error => console.error("Lỗi lấy phường/xã:", error));
  };

  const handleWardChange = (e) => {
    //console.log(e.target.value);
    setSelectedWard(e.target.value);
    setCustomerInfo({ ...customerInfo, ward: e.target.options[e.target.selectedIndex].text });
  };

  const handleDeliveryChange = () => {
    if (!delivery) {
      if (customer) {
        axios.get(`http://localhost:8080/address`)
          .then(response => {
            const address = response.data.data.find(item => item.customerId === customer.id);
            if (address) {
              setCustomerInfo({
                name: customer.fullName,
                phone: customer.phone,
                province: address.city,
                district: address.district,
                ward: address.ward,
                address: address.detailedAddress
              });

              // Set province and fetch districts
              setSelectedProvince(address.city);
              axios.get(`https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId=${address.city}`)
                .then(response => {
                  setDistricts(response.data.data);
                  setSelectedDistrict(address.district);

                  // Fetch wards for the selected district
                  axios.get(`https://partner.viettelpost.vn/v2/categories/listWards?districtId=${address.district}`)
                    .then(response => {
                      setWards(response.data.data);
                      setSelectedWard(address.ward);
                    })
                    .catch(error => console.error("Lỗi lấy phường/xã:", error));
                })
                .catch(error => console.error("Lỗi lấy quận/huyện:", error));
            }
            setTempDelivery(true);
            setShowModal(true);
          })
          .catch(error => {
            console.error('Lỗi lấy địa chỉ:', error);
            setTempDelivery(true);
            setShowModal(true);
          });
      } else {
        setTempDelivery(true);
        setShowModal(true);
      }
    } else {
      setDelivery(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDelivery(false);
  };

  const handleSaveModal = () => {
    const updatedCustomerInfo = {
      ...customerInfo,
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard
    };

    setDelivery(true);
    setShowModal(false);
    onSave(updatedCustomerInfo);
  };

  return (
    <>
      {/* Giao hàng */}
      <Row className="mb-3">
        <Col sm={7} md={5}>
          <Form.Label>Giao hàng:</Form.Label>
        </Col>
        <Col sm={6} md={4}>
          <Form.Check
            type="switch"
            id="custom-switch"
            label={delivery ? "Có" : "Không"}
            checked={delivery}
            onChange={handleDeliveryChange}
          />
        </Col>
      </Row>

      {/* Modal hiển thị khi chọn giao hàng */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thông tin giao hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Họ tên</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Số điện thoại</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Tỉnh/ Thành phố</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control as="select" value={selectedProvince} onChange={handleProvinceChange}>
                  <option value="">Chọn tỉnh/thành phố</option>
                  {provinces.map(province => (
                    <option key={province.PROVINCE_ID} value={province.PROVINCE_ID}>{province.PROVINCE_NAME}</option>
                  ))}
                </Form.Control>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Quận/Huyện</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control as="select" value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince}>
                  <option value="">Chọn quận/huyện</option>
                  {districts.map(district => (
                    <option key={district.DISTRICT_ID} value={district.DISTRICT_ID}>{district.DISTRICT_NAME}</option>
                  ))}
                </Form.Control>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Phường/Xã</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control as="select" value={selectedWard} onChange={handleWardChange} disabled={!selectedDistrict}>
                  <option value="">Chọn phường/xã</option>
                  {wards.map(ward => (
                    <option key={ward.WARDS_ID} value={ward.WARDS_ID}>{ward.WARDS_NAME}</option>
                  ))}
                </Form.Control>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Địa chỉ cụ thể</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  placeholder="Nhập địa chỉ cụ thể"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Ghi chú</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control as="textarea" rows={3} placeholder="Nhập ghi chú" />
                <Form.Check 
                  type="checkbox" 
                  label="Lưu địa chỉ của khách hàng"
                  onChange={(e) => setTempDelivery(e.target.checked)}
                  checked={tempDelivery}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handleSaveModal}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeliveryInfo;
