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

const CustomerInfo = ({ customer, onUpdate, showNotification, canUpdate }) => {
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
        provinceId: '',
        district: '',
        districtId: '',
        ward: '',
        wardId: ''
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
                setProvinces([]);
            }
        };

        loadProvinces();

        if (customer?.address) {
            parseAddress(customer.address);
        }
    }, [customer]);

    const parseAddress = (fullAddress) => {
        if (!fullAddress) return;

        const parts = fullAddress.split(/,\s*/);
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
            const province = provinces.find(p => p.PROVINCE_NAME === provinceName);
            if (province) {
                const districtsData = await fetchDistricts(province.PROVINCE_ID);
                setDistricts(districtsData);
                setFormData(prev => ({
                    ...prev,
                    province: provinceName,
                    provinceId: province.PROVINCE_ID,
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
        if (!canUpdate) {
            showNotification("Không thể cập nhật thông tin khi đơn hàng đang giao hàng hoặc đã hoàn tất!");
            return;
        }

        setIsLoading(true);
        try {
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

            const result = await onUpdate({
                customerName: formData.customerName.trim(),
                phone: formData.phone.trim(),
                address: fullAddress
            });

            setShowModal(false);
            if (result) {
                showNotification("Cập nhật thành công!");
            }
        } catch (error) {
            console.error('Submit error:', error);
            showNotification(error.message);
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
                        disabled={!canUpdate} // Vô hiệu hóa nút nếu không được phép cập nhật
                    >
                        Cập nhật
                    </Button>
                </Card.Header>
                <Card.Body>
                    <p><strong>Tên:</strong> {customer.customerName}</p>
                    <p><strong>Số điện thoại:</strong> {customer.phone}</p>
                    <p><strong>Địa chỉ:</strong> {customer.address}</p>
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
                                        disabled={!canUpdate}
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
                                        disabled={!canUpdate}
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
                                        disabled={!canUpdate}
                                    >
                                        <option value="">Chọn tỉnh/thành</option>
                                        {provinces.map(province => (
                                            <option
                                                key={province.PROVINCE_ID}
                                                value={province.PROVINCE_NAME}
                                            >
                                                {province.PROVINCE_NAME}
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
                                        onChange={(e) => handleDistrictChange(e.target.value)}
                                        disabled={!canUpdate || !formData.province || isLoading}
                                    >
                                        <option value="">Chọn quận/huyện</option>
                                        {districts.map(district => (
                                            <option
                                                key={district.DISTRICT_ID}
                                                value={district.DISTRICT_NAME}
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
                                        disabled={!canUpdate || !formData.district || isLoading || wards.length === 0}
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
                                disabled={!canUpdate}
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
                        disabled={isLoading || !canUpdate}
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