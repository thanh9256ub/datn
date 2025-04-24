import React from 'react'
import {
    Form,
    Input,
    Button,
    message,
    Typography,
} from 'antd';
import {
    LockOutlined,
} from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;

const CustomerChangePassword = ({ setLoading, customerId, form, loading }) => {
    return (
        <div>
            <div>
                <Title level={4} style={{ marginBottom: 24 }}>Thay đổi mật khẩu</Title>

                <Form
                    layout="vertical"
                    onFinish={async (allPassword) => {
                        try {
                            let token = localStorage.getItem('token');
                            const body = {
                                oldPassword: allPassword.currentPassword,
                                newPassword: allPassword.newPassword,
                            }
                            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                            const response = await axios.post("http://localhost:8080/customer/change-password-customer", body)
                            message.success('Đổi mật khẩu thành công');
                            form.resetFields();
                        } catch (error) {
                            message.error(error.response.data.message);
                        } finally {
                            setLoading(false);
                        }
                    }}
                >
                    <Form.Item
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[
                            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
                            { max: 20, message: 'Mật khẩu không được quá 20 ký tự' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('currentPassword') !== value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu mới không được giống mật khẩu hiện tại'));
                                },
                            }),
                            
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={['newPassword']}
                        rules={[
                            { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('newPassword') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            style={{ width: '100%' }}
                            loading={loading}
                        >
                            Đổi mật khẩu
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default CustomerChangePassword