import React from 'react'
import {
    Form,
    Input,
    Button,
    Row,
    Col,
    Space,
    Typography,
    DatePicker,
    Select,
} from 'antd';
import {
    UserOutlined,
    EditOutlined,
    SaveOutlined,
    PhoneOutlined,
    MailOutlined,
    HomeOutlined,
    CalendarOutlined,
    ManOutlined,
    WomanOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const CustomerInfo = ({ editing, setEditing, form, customer, loading, onFinish }) => {
    return (
        <div>
            <div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16
                }}>
                    <Title level={4} style={{ margin: 0 }}>Thông tin tài khoản</Title>
                    {!editing ? (
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={() => {
                                form.setFieldsValue({
                                    ...customer,
                                    birthDate: customer.birthDate ? dayjs(customer.birthDate) : null
                                });
                                setEditing(true);
                            }}
                        >
                            Chỉnh sửa
                        </Button>
                    ) : (
                        <Space>
                            <Button
                                onClick={() => {
                                    setEditing(false);
                                    form.resetFields();
                                }}
                            >
                                Hủy
                            </Button>
                            {/* <Button
                                type="primary"
                                onClick={() => form.submit()}
                                loading={loading}
                                icon={<SaveOutlined />}
                            >
                                Lưu thay đổi
                            </Button> */}
                        </Space>
                    )}
                </div>

                <Form
                    form={form}
                    layout="vertical"
                    initialValues={customer}
                    onFinish={onFinish}
                >
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="customerCode"
                                label="Mã khách hàng"
                            >
                                <Input prefix="KH" disabled size="large" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="fullName"
                                label="Họ và tên"
                                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    disabled={!editing}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="birthDate"
                                label="Ngày sinh"
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    size="large"
                                    disabled={!editing}
                                    suffixIcon={<CalendarOutlined />}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="gender"
                                label="Giới tính"
                            >
                                <Select
                                    size="large"
                                    disabled={!editing}
                                    options={[
                                        { value: 1, label: <span><ManOutlined /> Nam</span> },
                                        { value: 0, label: <span><WomanOutlined /> Nữ</span> }
                                    ]}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="email"
                                label="Email"
                            >
                                <Input
                                    prefix={<MailOutlined />}
                                    disabled
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="phone"
                                label="Số điện thoại"
                                rules={[
                                    { pattern: /^[0-9]+$/, message: 'Số điện thoại không hợp lệ' }
                                ]}
                            >
                                <Input
                                    prefix={<PhoneOutlined />}
                                    disabled={!editing}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    {editing && (
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                icon={<SaveOutlined />}
                                size="large"
                                block
                            >
                                Lưu thay đổi
                            </Button>
                        </Form.Item>
                    )}
                </Form>
            </div>
        </div>
    )
}

export default CustomerInfo