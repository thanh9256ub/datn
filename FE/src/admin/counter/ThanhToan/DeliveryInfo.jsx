import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const DeliveryInfo = ({ delivery, setDelivery }) => {
  const [tempDelivery, setTempDelivery] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedWard, setSelectedWard] = useState('');

  useEffect(() => {
    // Fetch provinces from API
    axios.get("https://provinces.open-api.vn/api/?depth=1")
      .then(response => setProvinces(response.data))
      .catch(error => console.error("Lỗi lấy tỉnh/thành phố:", error));
  }, []);

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict('');
    setSelectedWard('');
    setDistricts([]);
    setWards([]);

    // Fetch districts based on selected province
    axios.get(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      .then(response => setDistricts(response.data.districts))
      .catch(error => console.error("Lỗi lấy quận/huyện:", error));
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setSelectedWard('');
    setWards([]);

    // Fetch wards based on selected district
    axios.get(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      .then(response => setWards(response.data.wards))
      .catch(error => console.error("Lỗi lấy phường/xã:", error));
  };

  const handleWardChange = (e) => {
    setSelectedWard(e.target.value);
  };

  const handleDeliveryChange = () => {
    setTempDelivery(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDelivery(false);
  };

  const handleSaveModal = () => {
    setShowModal(false);
    setDelivery(tempDelivery);
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
                <Form.Control type="text" placeholder="Nguyễn Khách Huyền" />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Số điện thoại</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control type="text" placeholder="0375161589" />
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
                    <option key={province.code} value={province.code}>{province.name}</option>
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
                    <option key={district.code} value={district.code}>{district.name}</option>
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
                    <option key={ward.code} value={ward.name}>{ward.name}</option>
                  ))}
                </Form.Control>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label>Địa chỉ cụ thể</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control type="text" placeholder="Nhập địa chỉ cụ thể" />
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
