import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Modal, Button } from 'react-bootstrap';

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
    // Fetch provinces from Google Maps API
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=Vietnam&key=YOUR_API_KEY')
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results[0]) {
          const provincesData = data.results[0].address_components.filter(component => component.types.includes('administrative_area_level_1'));
          setProvinces(provincesData);
        }
      });
  }, []);

  const handleProvinceChange = (e) => {
    setSelectedProvince(e.target.value);
    // Fetch districts based on selected province
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${e.target.value},Vietnam&key=YOUR_API_KEY`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results[0]) {
          const districtsData = data.results[0].address_components.filter(component => component.types.includes('administrative_area_level_2'));
          setDistricts(districtsData);
          setWards([]);
          setSelectedDistrict('');
          setSelectedWard('');
        }
      });
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrict(e.target.value);
    // Fetch wards based on selected district
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${e.target.value},${selectedProvince},Vietnam&key=YOUR_API_KEY`)
      .then(response => response.json())
      .then(data => {
        if (data.results && data.results[0]) {
          const wardsData = data.results[0].address_components.filter(component => component.types.includes('administrative_area_level_3'));
          setWards(wardsData);
          setSelectedWard('');
        }
      });
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
                  {provinces.map((province, index) => (
                    <option key={index} value={province.long_name}>{province.long_name}</option>
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
                  {districts.map((district, index) => (
                    <option key={index} value={district.long_name}>{district.long_name}</option>
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
                  {wards.map((ward, index) => (
                    <option key={index} value={ward.long_name}>{ward.long_name}</option>
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
