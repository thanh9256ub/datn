// CustomerInfo.js
import React, { useState, useEffect } from 'react';
import {
    Card,
    Button,
    Modal,
    Form,
    FormGroup,
    FormControl,
    Row,
    Col,
    Spinner
} from 'react-bootstrap';
import {
    fetchProvinces,
    fetchDistricts,
    fetchWards
} from '../OrderService/orderService';

const CustomerInfo = ({ customer, onUpdate, showNotification }) => {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [formData, setFormData] = useState({
        customerName: customer.customerName || '',
        phone: customer.phone || '',
        addressDetail: '',
        province: '',
        provinceId: '', // Thêm trường này
        district: '',
        districtId: '', // Thêm trường này
        ward: '',
        wardId: '' // Thêm trường này
    });

    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const data = await fetchProvinces();
                if (data && data.length > 0) {
                    setProvinces(data);
                }
            } catch (error) {
                console.error('Error loading provinces:', error);
                setProvinces([]); // Đảm bảo không bị undefined
            }
        };

        loadProvinces();

        if (customer?.address) {
            parseAddress(customer.address);
        }
    }, [customer]);

    const parseAddress = (fullAddress) => {
        if (!fullAddress) return;

        const parts = fullAddress.split(/,\s*/); // Sử dụng regex để split chính xác hơn
        if (parts.length >= 4) {
            setFormData(prev => ({
                ...prev,
                addressDetail: parts[0] || '',
                ward: parts[1] || '',
                district: parts[2] || '',
                province: parts[3] || ''
            }));
        }
    };
    const handleWardChange = (wardName) => {
        const selectedWard = wards.find(w => w.WARDS_NAME === wardName);
        setFormData(prev => ({
            ...prev,
            ward: wardName,
            wardId: selectedWard?.WARDS_ID || ''
        }));
    };
    const handleProvinceChange = async (provinceName) => {
        setIsLoading(true);
        try {
            // Tìm province object từ tên được chọn
            const province = provinces.find(p => p.PROVINCE_NAME === provinceName);

            if (province) {
                // Truyền PROVINCE_ID vào fetchDistricts
                const districtsData = await fetchDistricts(province.PROVINCE_ID);

                setDistricts(districtsData);
                setFormData(prev => ({
                    ...prev,
                    province: provinceName,
                    provinceId: province.PROVINCE_ID, // Lưu cả ID để sử dụng sau này
                    district: '',
                    districtId: '',
                    ward: '',
                    wardId: ''
                }));
            }
        } catch (error) {
            console.error('Error loading districts:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const handleDistrictChange = async (districtName) => {
        setIsLoading(true);
        try {
            const district = districts.find(d => d.DISTRICT_NAME === districtName);
            if (district) {
                const wardsData = await fetchWards(district.DISTRICT_ID);
                setWards(wardsData);
                setFormData(prev => ({
                    ...prev,
                    district: districtName,
                    districtId: district.DISTRICT_ID,
                    ward: '',
                    wardId: ''
                }));
            }
        } catch (error) {
            console.error('Error loading wards:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Validate dữ liệu
            if (!formData.customerName?.trim()) {
                throw new Error("Vui lòng nhập tên khách hàng");
            }

            if (!formData.phone?.trim()) {
                throw new Error("Vui lòng nhập số điện thoại");
            }

            const fullAddress = [
                formData.addressDetail,
                formData.ward,
                formData.district,
                formData.province
            ].filter(Boolean).join(', ');

            // Gọi API cập nhật
            const result = await onUpdate({
                customerName: formData.customerName.trim(),
                phone: formData.phone.trim(),
                address: fullAddress
            });
            await onUpdate({
                customerName: formData.customerName.trim(),
                phone: formData.phone.trim(),
                address: fullAddress
            });
            console.log('Update result:', result);
            setShowModal(false);

            // Hiển thị thông báo thành công
            if (result) {
                showNotification("Cập nhật thành công!");
            }
        } catch (error) {
            console.error('Submit error:', error);
            alert(error.message); // Hiển thị lỗi cụ thể cho người dùng
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <Card className="shadow-sm h-100">
                <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                    <h5 className="mb-0">Thông tin khách hàng</h5>
                    <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setShowModal(true)}
                    >
                        Cập nhật
                    </Button>
                </Card.Header>
                <Card.Body>
                    <p><strong>Tên:</strong> {customer.customerName}</p>
                    <p><strong>Số điện thoại:</strong> {customer.phone}</p>
                    <p><strong>Địa chỉ:</strong> {customer.address}</p>
                    <p><strong>Email:</strong> {customer.customer?.email || 'N/A'}</p>
                </Card.Body>
            </Card>

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật thông tin khách hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className="mb-3">
                            <Col md={6}>
                                <FormGroup controlId="customerName">
                                    <Form.Label>Tên khách hàng</Form.Label>
                                    <FormControl
                                        type="text"
                                        value={formData.customerName}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            customerName: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup controlId="phone">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <FormControl
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({
                                            ...formData,
                                            phone: e.target.value
                                        })}
                                        required
                                    />
                                </FormGroup>
                            </Col>
                        </Row>

                        <Row className="mb-3">
                            <Col md={4}>
                                <FormGroup controlId="province">
                                    <Form.Label>Tỉnh/Thành phố</Form.Label>
                                    <FormControl
                                        as="select"
                                        value={formData.province}
                                        onChange={(e) => handleProvinceChange(e.target.value)}
                                    >
                                        <option value="">Chọn tỉnh/thành</option>
                                        {provinces.map(province => (
                                            <option
                                                key={province.PROVINCE_ID}
                                                value={province.PROVINCE_NAME} // Sửa thành PROVINCE_NAME
                                            >
                                                {province.PROVINCE_NAME} {/* Sửa thành PROVINCE_NAME */}
                                            </option>
                                        ))}
                                    </FormControl>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup controlId="district">
                                    <Form.Label>Quận/Huyện</Form.Label>
                                    <FormControl
                                        as="select"
                                        value={formData.district}
                                        onChange={(e) => {
                                            const selectedIndex = e.target.selectedIndex;
                                            const districtId = e.target.options[selectedIndex].getAttribute('data-id');
                                            handleDistrictChange(e.target.value, districtId);
                                        }}
                                    >
                                        <option value="">Chọn quận/huyện</option>
                                        {districts.map(district => (
                                            <option
                                                key={district.DISTRICT_ID}
                                                value={district.DISTRICT_NAME}
                                                data-id={district.DISTRICT_ID} // Thêm data attribute
                                            >
                                                {district.DISTRICT_NAME}
                                            </option>
                                        ))}
                                    </FormControl>
                                </FormGroup>
                            </Col>
                            <Col md={4}>
                                <FormGroup controlId="ward">
                                    <Form.Label>Phường/Xã</Form.Label>
                                    <FormControl
                                        as="select"
                                        value={formData.ward}
                                        onChange={(e) => handleWardChange(e.target.value)}
                                        disabled={!formData.district || isLoading || wards.length === 0}
                                        required
                                    >
                                        <option value="">Chọn phường/xã</option>
                                        {wards.map(ward => (
                                            <option
                                                key={ward.WARDS_ID}
                                                value={ward.WARDS_NAME}
                                            >
                                                {ward.WARDS_NAME}
                                            </option>
                                        ))}
                                    </FormControl>
                                </FormGroup>
                            </Col>
                        </Row>

                        <FormGroup className="mb-3" controlId="addressDetail">
                            <Form.Label>Địa chỉ chi tiết</Form.Label>
                            <FormControl
                                type="text"
                                value={formData.addressDetail}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    addressDetail: e.target.value
                                })}
                                placeholder="Số nhà, đường..."
                                required
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowModal(false)}
                        disabled={isLoading}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                Đang lưu...
                            </>
                        ) : (
                            'Lưu thay đổi'
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CustomerInfo;