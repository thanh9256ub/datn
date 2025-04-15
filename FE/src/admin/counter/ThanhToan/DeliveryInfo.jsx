import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Modal, Button } from 'react-bootstrap';
import { toast } from "react-toastify";
import axios from 'axios'; // Add this import
import { fetchProvinces, fetchDistricts, fetchWards, fetchCustomerAddresses, addCustomerAddress } from '../api'; // Updated import
import { toastOptions } from '../constants'; // Import constants

import { addCustomer } from '../api';
const DeliveryInfo = ({ delivery, setDelivery, onSave, customer, setCustomer, customerInfo, setCustomerInfo, idOrder, totalAmount, setSelectedProvince, selectedProvince, setSelectedDistrict, selectedDistrict, setSelectedWard, selectedWard, qrIntervalRef, setQrImageUrl }) => {
  const [tempDelivery, setTempDelivery] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ fullName: '', phone: '' });

  useEffect(() => {
    fetchProvinces()
      .then(response => setProvinces(response.data.data))
      .catch(error => console.error("Lỗi lấy tỉnh/thành phố:", error));
  }, []);

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value; // Get the ID of the province
    const provinceName = e.target.options[e.target.selectedIndex].text; // Get the name of the province
    setSelectedProvince(provinceId);
    setSelectedDistrict('');
    setSelectedWard('');
    setDistricts([]);
    setWards([]);
    setCustomerInfo({ ...customerInfo, province: provinceName }); // Store province name

    fetchDistricts(provinceId)
      .then(response => setDistricts(response.data.data))
      .catch(error => console.error("Lỗi lấy quận/huyện:", error));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value; // Get the ID of the district
    const districtName = e.target.options[e.target.selectedIndex].text; // Get the name of the district
    setSelectedDistrict(districtId);
    setSelectedWard('');
    setWards([]);
    setCustomerInfo({ ...customerInfo, district: districtName }); // Store district name

    fetchWards(districtId)
      .then(response => setWards(response.data.data))
      .catch(error => console.error("Lỗi lấy phường/xã:", error));
  };

  const handleWardChange = (e) => {
    const wardId = e.target.value; // Get the ID of the ward
    const wardName = e.target.options[e.target.selectedIndex].text; // Get the name of the ward
    setSelectedWard(wardId);
    setCustomerInfo({ ...customerInfo, ward: wardName }); // Store ward name
  };

  const handleDeliveryChange = () => {
    if (!delivery) {
      if (!idOrder) {
        toast.warn("Vui lòng chọn hóa đơn trước khi bật giao hàng ", toastOptions);
        return;
      }
      if (totalAmount === 0) {
        toast.warn("Vui lòng thêm sản phẩm trước khi bật giao hàng ", toastOptions);
        return;
      }
      if (customer) {
        axios.get(`http://localhost:8080/address`)
          .then(response => {
            const address = response.data.data.find(item => item.customerId === customer.id);
            if (address) {
              setCustomerInfo({
                fullName: customer.fullName,
                phone: customer.phone,
                province: address.city,
                district: address.district,
                ward: address.ward,
                address: address.detailedAddress,
              });

              // Fetch province ID
              fetchProvinces()
                .then(response => {
                  const province = response.data.data.find(item => item.PROVINCE_NAME === address.city);
                  if (province) {
                    setSelectedProvince(province.PROVINCE_ID);

                    // Fetch districts for the selected province
                    fetchDistricts(province.PROVINCE_ID)
                      .then(response => {
                        setDistricts(response.data.data);
                        const district = response.data.data.find(item => item.DISTRICT_NAME === address.district);
                        if (district) {
                          setSelectedDistrict(district.DISTRICT_ID);

                          // Fetch wards for the selected district
                          fetchWards(district.DISTRICT_ID)
                            .then(response => {
                              setWards(response.data.data);
                              const ward = response.data.data.find(item => item.WARDS_NAME === address.ward);
                              if (ward) {
                                setSelectedWard(ward.WARDS_ID);
                              }
                            })
                            .catch(error => console.error("Lỗi lấy phường/xã:", error));
                        }
                      })
                      .catch(error => console.error("Lỗi lấy quận/huyện:", error));
                  }
                })
                .catch(error => console.error("Lỗi lấy tỉnh/thành phố:", error));
            } else {
              setCustomerInfo({
                name: customer.fullName,
                phone: customer.phone,
                province: "",
                district: "",
                ward: "",
                address: "",
                note: "",
              });
              setSelectedProvince('');
              setSelectedDistrict('');
              setSelectedWard('');
            }
            setShowModal(true);
          })
          .catch(error => {
            console.error('Lỗi lấy địa chỉ:', error);
            setShowModal(true);
          });
      } else {
        setCustomerInfo({
          name: "",
          phone: "",
          province: "",
          district: "",
          ward: "",
          address: "",
          note: "",
        });
        setSelectedProvince('');
        setSelectedDistrict('');
        setSelectedWard('');
        setShowModal(true);
      }
    } else {
      setDelivery(false);
      toast.info("Chuyển sang không giao hàng ", toastOptions);
      clearInterval(qrIntervalRef.current);
      qrIntervalRef.current = null;
      setQrImageUrl(null);
    }
  };

  const handleCloseModal = () => {
    setTempDelivery(false);
    setShowModal(false);
    setDelivery(false);
  };

  const handleSaveModal = async () => {
    // Validation
    if (!customerInfo.fullName.trim()) { // Changed from customerInfo.name to customerInfo.fullName
      toast.error("Họ tên không được để trống ", toastOptions);
      return;
    }

    if (!customerInfo.phone.trim() || !/^\d{10}$/.test(customerInfo.phone)) {
      toast.error("Số điện thoại phải gồm 10 chữ số ", toastOptions);
      return;
    }

    if (!selectedProvince) {
      toast.error("Vui lòng chọn tỉnh/thành phố ", toastOptions);
      return;
    }

    if (!selectedDistrict) {
      toast.error("Vui lòng chọn quận/huyện ", toastOptions);
      return;
    }

    if (!selectedWard) {
      toast.error("Vui lòng chọn phường/xã ", toastOptions);
      return;
    }

    if (!customerInfo.address.trim()) {
      toast.error("Địa chỉ cụ thể không được để trống ", toastOptions);
      return;
    }
    clearInterval(qrIntervalRef.current);
    qrIntervalRef.current = null;
    setQrImageUrl(null);
    const updatedCustomerInfo = {
      ...customerInfo,
      fullName: newCustomer.fullName,
      phone: newCustomer.phone,
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard,
    };

    try {
      if (tempDelivery) {
       
       let addressPayload = {
            city: customerInfo.province,
            district: customerInfo.district,
            ward: customerInfo.ward,
            detailedAddress: customerInfo.address,
            customerId: customer.id,
            status: 1,
            defaultAddress: true,
          };
          await addCustomerAddress(addressPayload);
          toast.success("Địa chỉ đã được lưu thành công ", toastOptions);
        }

       
      

      toast.success("Đã chuyển qua hình thức giao hàng", toastOptions);
      setDelivery(true);
      setShowModal(false);
      //if (onSave) {
      onSave(updatedCustomerInfo);
      //  }

    } catch (error) {
      console.error("Lỗi khi lưu địa chỉ hoặc khách hàng:", error);
      toast.error("Lỗi khi lưu địa chỉ hoặc khách hàng ", toastOptions);
    }
  };

  return (
    <>
      {/* Giao hàng */}
      <Row className="mb-3">
        <Col sm={7} md={5}>
          <Form.Label style={{ fontWeight: 'bold' }}>Giao hàng:</Form.Label>
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
          <Modal.Title style={{ fontWeight: 'bold' }}>Thông tin giao hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ overflow: 'hidden' }}> {/* Prevent scrollbars */}
          <Form>
            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label style={{ fontWeight: 'bold' }}>Họ tên</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  style={{ fontWeight: 'bold' }}
                  value={customerInfo.fullName ? customerInfo.fullName : ""}
                  onChange={(e) => {
                    setNewCustomer({ ...newCustomer, fullName: e.target.value });
                    setCustomerInfo({ ...customerInfo, fullName: e.target.value })
                  }}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label style={{ fontWeight: 'bold' }}>Số điện thoại</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  style={{ fontWeight: 'bold' }}
                  value={customerInfo.phone}
                  onChange={(e) => {
                    setNewCustomer({ ...newCustomer, phone: e.target.value });
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label style={{ fontWeight: 'bold' }}>Tỉnh/ Thành phố</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control as="select" value={selectedProvince} onChange={handleProvinceChange}
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

              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label style={{ fontWeight: 'bold' }}>Quận/Huyện</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control as="select" value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince} style={{

                  fontWeight: "bold",
                  color: "black", // Ensure text color is always visible
                  backgroundColor: "white", // Ensure background color is not faint
                }}>
                  <option value="">Chọn quận/huyện</option>
                  {districts.map(district => (
                    <option key={district.DISTRICT_ID} value={district.DISTRICT_ID} style={{ fontWeight: 'bold' }}>{district.DISTRICT_NAME}</option>
                  ))}
                </Form.Control>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label style={{ fontWeight: 'bold' }}>Phường/Xã</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control as="select" value={selectedWard} onChange={handleWardChange} disabled={!selectedDistrict} style={{

                  fontWeight: "bold",
                  color: "black", // Ensure text color is always visible
                  backgroundColor: "white", // Ensure background color is not faint
                }}>
                  <option value="">Chọn phường/xã</option>
                  {wards.map(ward => (
                    <option key={ward.WARDS_ID} value={ward.WARDS_ID} style={{ fontWeight: 'bold' }}>{ward.WARDS_NAME}</option>
                  ))}
                </Form.Control>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label style={{ fontWeight: 'bold' }}>Địa chỉ cụ thể</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control
                  type="text"
                  style={{ fontWeight: 'bold' }}
                  placeholder="Nhập địa chỉ cụ thể"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={4}>
                <Form.Label style={{ fontWeight: 'bold' }}>Ghi chú</Form.Label>
              </Col>
              <Col sm={8}>
                <Form.Control as="textarea" rows={3} placeholder="Nhập ghi chú"
                  value={customerInfo.note}
                  style={{ fontWeight: 'bold' }}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, note: e.target.value })}
                />
                <Form.Check
                  type="checkbox"
                  label="Lưu địa chỉ của khách hàng"
                  onChange={(e) => {
                    if (!customer) {
                      toast.warn("Vui lòng tạo khách hàng trước khi lưu địa chỉ", toastOptions);
                      return;
                    }
                    setTempDelivery(e.target.checked);
                  }}
                  checked={tempDelivery}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleCloseModal}>
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
