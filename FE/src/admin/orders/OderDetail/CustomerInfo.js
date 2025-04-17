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
    Spinner,
    Alert
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
    const [errors, setErrors] = useState({});

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

    const validateForm = () => {
        const newErrors = {};

        // Validate customerName (cho phép ký tự tiếng Việt)
        if (!formData.customerName.trim()) {
            newErrors.customerName = "Tên khách hàng không được để trống";
        } else if (formData.customerName.length > 100) {
            newErrors.customerName = "Tên khách hàng không được vượt quá 100 ký tự";
        } else if (!/^[\p{L}\s]+$/u.test(formData.customerName.trim())) {
            newErrors.customerName = "Tên khách hàng chỉ được chứa chữ cái và khoảng trắng";
        }

        // Validate phone
        if (!formData.phone.trim()) {
            newErrors.phone = "Số điện thoại không được để trống";
        } else if (!/^\d{10}$/.test(formData.phone.trim())) {
            newErrors.phone = "Số điện thoại phải có đúng 10 chữ số và không chứa ký tự đặc biệt";
        }

        // Validate addressDetail (cho phép ký tự tiếng Việt và dấu /)
        if (!formData.addressDetail.trim()) {
            newErrors.addressDetail = "Địa chỉ chi tiết không được để trống";
        } else if (formData.addressDetail.length > 255) {
            newErrors.addressDetail = "Địa chỉ chi tiết không được vượt quá 255 ký tự";
        } else if (!/^[\p{L}\p{N}\s\/]+$/u.test(formData.addressDetail.trim())) {
            newErrors.addressDetail = "Địa chỉ chi tiết chỉ được chứa chữ, số, khoảng trắng và dấu /";
        }

        // Validate province
        if (!formData.province) {
            newErrors.province = "Vui lòng chọn tỉnh/thành phố";
        }

        // Validate district
        if (!formData.district) {
            newErrors.district = "Vui lòng chọn quận/huyện";
        }

        // Validate ward
        if (!formData.ward) {
            newErrors.ward = "Vui lòng chọn phường/xã";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleWardChange = (wardName) => {
        const selectedWard = wards.find(w => w.WARDS_NAME === wardName);
        setFormData(prev => ({
            ...prev,
            ward: wardName,
            wardId: selectedWard?.WARDS_ID || ''
        }));
        setErrors(prev => ({ ...prev, ward: null }));
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
                setErrors(prev => ({ ...prev, province: null, district: null, ward: null }));
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
                setErrors(prev => ({ ...prev, district: null, ward: null }));
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

        if (!validateForm()) {
            showNotification("Vui lòng kiểm tra lại thông tin nhập vào!");
            return;
        }

        setIsLoading(true);
        try {
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
                        disabled={!canUpdate}
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
                                        isInvalid={!!errors.customerName}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.customerName}
                                    </Form.Control.Feedback>
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
                                        isInvalid={!!errors.phone}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.phone}
                                    </Form.Control.Feedback>
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
                                        isInvalid={!!errors.province}
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
                                    <Form.Control.Feedback type="invalid">
                                        {errors.province}
                                    </Form.Control.Feedback>
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
                                        isInvalid={!!errors.district}
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
                                    <Form.Control.Feedback type="invalid">
                                        {errors.district}
                                    </Form.Control.Feedback>
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
                                        isInvalid={!!errors.ward}
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
                                    <Form.Control.Feedback type="invalid">
                                        {errors.ward}
                                    </Form.Control.Feedback>
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
                                isInvalid={!!errors.addressDetail}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.addressDetail}
                            </Form.Control.Feedback>
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