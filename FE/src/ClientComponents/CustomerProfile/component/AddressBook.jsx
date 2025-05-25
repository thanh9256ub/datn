import React, { useState, useEffect } from 'react';
import { Modal, Form, Select, Input, Checkbox, message, Button, Card, Space, Tag, Typography } from 'antd';
import { EnvironmentOutlined, HomeOutlined } from '@ant-design/icons';
import { fetchProvinces, fetchDistricts, fetchWards, addAddress, setDefaultAddress } from '../AddressService';
import { useAuth } from '../../../context/AuthContext';

const { Option } = Select;
const { Text } = Typography;

const AddressBook = ({ addressData = [], onAddressUpdate }) => {
    const { customerId } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [form] = Form.useForm();

    // Log addressData to debug
    console.log('addressData prop:', addressData);

    useEffect(() => {
        const loadProvinces = async () => {
            try {
                setLoading(true);
                const data = await fetchProvinces();
                console.log('Provinces data:', data);
                if (!Array.isArray(data)) {
                    throw new Error('Invalid provinces data');
                }
                const validProvinces = data.filter(
                    (p) => p.PROVINCE_ID != null && p.PROVINCE_NAME != null
                );
                const uniqueIds = new Set(validProvinces.map((p) => p.PROVINCE_ID));
                if (uniqueIds.size !== validProvinces.length) {
                    console.warn('Duplicate province IDs detected!');
                }
                setProvinces(validProvinces);
                if (validProvinces.length === 0) {
                    message.warning('Không có dữ liệu tỉnh/thành phố');
                }
            } catch (error) {
                console.error('Failed to load provinces:', error);
                message.error('Không thể tải danh sách tỉnh/thành phố');
            } finally {
                setLoading(false);
            }
        };
        loadProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            const loadDistricts = async () => {
                try {
                    setLoading(true);
                    const data = await fetchDistricts(selectedProvince);
                    console.log('Districts data:', data);
                    if (!Array.isArray(data)) {
                        throw new Error('Invalid districts data');
                    }
                    const validDistricts = data.filter(
                        (d) => d.DISTRICT_ID != null && d.DISTRICT_NAME != null
                    );
                    const uniqueIds = new Set(validDistricts.map((d) => d.DISTRICT_ID));
                    if (uniqueIds.size !== validDistricts.length) {
                        console.warn('Duplicate district IDs detected!');
                    }
                    setDistricts(validDistricts);
                    setSelectedDistrict('');
                    setWards([]);
                    form.setFieldsValue({ district: undefined, ward: undefined });
                    if (validDistricts.length === 0) {
                        message.warning('Không có dữ liệu quận/huyện');
                    }
                } catch (error) {
                    console.error('Failed to load districts:', error);
                    message.error('Không thể tải danh sách quận/huyện');
                } finally {
                    setLoading(false);
                }
            };
            loadDistricts();
        } else {
            setDistricts([]);
            setWards([]);
            form.setFieldsValue({ district: undefined, ward: undefined });
        }
    }, [selectedProvince, form]);

    useEffect(() => {
        if (selectedDistrict) {
            const loadWards = async () => {
                try {
                    setLoading(true);
                    const data = await fetchWards(selectedDistrict);
                    console.log('Wards data:', data);
                    if (!Array.isArray(data)) {
                        throw new Error('Invalid wards data');
                    }
                    const validWards = data.filter(
                        (w) => w.WARDS_ID != null && w.WARDS_NAME != null
                    );
                    const uniqueIds = new Set(validWards.map((w) => w.WARDS_ID));
                    if (uniqueIds.size !== validWards.length) {
                        console.warn('Duplicate ward IDs detected!');
                    }
                    setWards(validWards);
                    form.setFieldsValue({ ward: undefined });
                    if (validWards.length === 0) {
                        message.warning('Không có dữ liệu phường/xã');
                    }
                } catch (error) {
                    console.error('Failed to load wards:', error);
                    message.error('Không thể tải danh sách phường/xã');
                } finally {
                    setLoading(false);
                }
            };
            loadWards();
        } else {
            setWards([]);
            form.setFieldsValue({ ward: undefined });
        }
    }, [selectedDistrict, form]);

    const handleOk = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            // Validate city, district, and ward
            if (!values.city || !values.district || !values.ward) {
                throw new Error('Vui lòng chọn tỉnh/thành phố, quận/huyện và phường/xã');
            }

            // Prepare address data for API
            const newAddress = {
                customerId: customerId,
                detailedAddress: values.detailedAddress,
                city: provinces.find((p) => String(p.PROVINCE_ID) === values.city)?.PROVINCE_NAME || '',
                district: districts.find((d) => String(d.DISTRICT_ID) === values.district)?.DISTRICT_NAME || '',
                ward: wards.find((w) => String(w.WARDS_ID) === values.ward)?.WARDS_NAME || '',
                status: values.defaultAddress ? 1 : 0,
                defaultAddress: values.defaultAddress || false,
            };

            // Validate customerId and address fields
            if (!newAddress.customerId) {
                throw new Error('Yêu cầu ID khách hàng');
            }
            if (!newAddress.city || !newAddress.district || !newAddress.ward) {
                throw new Error('Yêu cầu tỉnh/thành phố, quận/huyện và phường/xã');
            }

            // Call API to add address
            const response = await addAddress(newAddress);
            console.log('Add address API response:', response);

            // Update parent component with new address
            onAddressUpdate([
                ...addressData,
                {
                    id: response.id,
                    detailedAddress: response.detailedAddress,
                    ward: response.ward,
                    district: response.district,
                    city: response.city,
                    defaultAddress: response.status === 1,
                }
            ]);

            // Reset form and state
            form.resetFields();
            setSelectedProvince('');
            setSelectedDistrict('');
            setIsModalOpen(false);
            message.success('Đã thêm địa chỉ mới');
        } catch (error) {
            console.error('Failed to add address:', error);
            message.error(error.message || 'Không thể thêm địa chỉ');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setSelectedProvince('');
        setSelectedDistrict('');
        setIsModalOpen(false);
    };

    const handleSetDefault = async (addressId) => {
        try {
            setLoading(true);
            const response = await setDefaultAddress(addressId);
            console.log('Set default address response:', response);

            // Cập nhật danh sách địa chỉ: đặt địa chỉ được chọn làm mặc định, các địa chỉ khác thành không mặc định
            const updatedAddresses = addressData.map((addr) => ({
                ...addr,
                defaultAddress: addr.id === addressId ? true : false,
            }));

            onAddressUpdate(updatedAddresses);
            message.success('Đã đặt địa chỉ làm mặc định');
        } catch (error) {
            console.error('Failed to set default address:', error);
            message.error(error.message || 'Không thể đặt địa chỉ làm mặc định');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Button type="primary" icon={<HomeOutlined />} onClick={() => setIsModalOpen(true)}>
                Thêm địa chỉ mới
            </Button>
            {/* Display the list of addresses */}
            <div style={{ marginTop: 16 }}>
                {addressData.length > 0 ? (
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        {addressData.map((address, index) => (
                            <Card
                                key={address.id || index}
                                size="small"
                                style={{
                                    borderRadius: 8,
                                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                                    backgroundColor: address.defaultAddress ? '#e6f7ff' : '#fff',
                                }}
                                title={
                                    <Space>
                                        <HomeOutlined />
                                        <Text strong>
                                            Địa chỉ {index + 1} {address.defaultAddress ? '(mặc định)' : ''}
                                        </Text>
                                        {address.defaultAddress && (
                                            <Tag color="green">Địa chỉ mặc định</Tag>
                                        )}
                                    </Space>
                                }
                                extra={
                                    !address.defaultAddress && (
                                        <Button
                                            type="link"
                                            onClick={() => handleSetDefault(address.id)}
                                            disabled={loading}
                                        >
                                            Đặt làm mặc định
                                        </Button>
                                    )
                                }
                            >
                                <Text>
                                    {address.detailedAddress}, {address.ward}, {address.district}, {address.city}
                                </Text>
                            </Card>
                        ))}
                    </Space>
                ) : (
                    <Text type="secondary">Chưa có địa chỉ nào</Text>
                )}
            </div>
            <Modal
                title="Thêm địa chỉ mới"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Thêm"
                cancelText="Hủy"
                okButtonProps={{ loading }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="city"
                        label="Tỉnh/Thành phố"
                        rules={[{ required: true, message: 'Vui lòng chọn tỉnh/thành phố' }]}
                    >
                        <Select
                            placeholder="Chọn tỉnh/thành phố"
                            onChange={(value) => setSelectedProvince(value)}
                            loading={loading}
                            suffixIcon={<EnvironmentOutlined />}
                            showSearch
                            optionFilterProp="children"
                            notFoundContent={provinces.length === 0 ? 'Không có dữ liệu' : null}
                        >
                            {provinces.map((province, index) => (
                                <Option
                                    key={province.PROVINCE_ID || `province-${index}`}
                                    value={String(province.PROVINCE_ID)}
                                >
                                    {province.PROVINCE_NAME}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="district"
                        label="Quận/Huyện"
                        rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                    >
                        <Select
                            placeholder="Chọn quận/huyện"
                            onChange={(value) => setSelectedDistrict(value)}
                            disabled={!selectedProvince}
                            loading={loading}
                            suffixIcon={<EnvironmentOutlined />}
                            showSearch
                            optionFilterProp="children"
                            notFoundContent={districts.length === 0 ? 'Không có dữ liệu' : null}
                        >
                            {districts.map((district, index) => (
                                <Option
                                    key={district.DISTRICT_ID || `district-${index}`}
                                    value={String(district.DISTRICT_ID)}
                                >
                                    {district.DISTRICT_NAME}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="ward"
                        label="Phường/Xã"
                        rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
                    >
                        <Select
                            placeholder="Chọn phường/xã"
                            disabled={!selectedDistrict}
                            loading={loading}
                            suffixIcon={<EnvironmentOutlined />}
                            showSearch
                            optionFilterProp="children"
                            notFoundContent={wards.length === 0 ? 'Không có dữ liệu' : null}
                        >
                            {wards.map((ward, index) => (
                                <Option
                                    key={ward.WARDS_ID || `ward-${index}`}
                                    value={String(ward.WARDS_ID)}
                                >
                                    {ward.WARDS_NAME}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="detailedAddress"
                        label="Địa chỉ chi tiết"
                        rules={[{ required: true, message: 'Vui lòng nhập địa chỉ chi tiết' }]}
                    >
                        <Input placeholder="Số nhà, tên đường..." />
                    </Form.Item>

                    <Form.Item name="defaultAddress" valuePropName="checked">
                        <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AddressBook;