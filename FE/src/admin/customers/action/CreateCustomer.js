
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Select from 'react-select'; // Import react-select
import { addCustomer, existsEmail, existsPhone } from '../service/CustomersService';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Spinner } from 'react-bootstrap';
import "./ActionCustomer.css";


const CreateCustomer = () => {

    const history = useHistory();

    const [provinces, setProvinces] = useState([]);

    const [districts, setDistricts] = useState([]);

    const [wards, setWards] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState(null);

    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const [selectedWard, setSelectedWard] = useState(null);

    const [addresses, setAddresses] = useState([{}]);

    const [defaultAddressIndex, setDefaultAddressIndex] = useState(0);

    const [customer, setCustomer] = useState({});

    const [loading, setLoading] = useState(false);

    const [fullNameError, setFullNameError] = useState('');

    const [emailError, setEmailError] = useState('');

    const [phoneError, setPhoneError] = useState('');

    const [birthDateError, setBirthDateError] = useState('');

    const [typingTimeout, setTypingTimeout] = useState(null);

    const handleSaveCustomer = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn thêm khách hàng?')) return;

        setFullNameError('');

        setEmailError('');

        setPhoneError('');

        setBirthDateError('');


        let isValid = true;

        const nameRegex = /^[a-zA-Z ]*$/;

        if (!customer.fullName) {
            setFullNameError('Vui lòng nhập tên khách hàng.');
            isValid = false;
        }
        else if (customer.fullName.length < 2) {
            setFullNameError('Tên khách hàng phải có ít nhất 2 ký tự.');
            isValid = false;
        } else if (customer.fullName.length > 100) {
            setFullNameError('Tên khách hàng không được vượt quá 100 ký tự.');
            isValid = false;
        } 
        // tên khách hàng phải có dấu
        else if (!/^[\p{L} ]+$/u.test(customer.fullName)) {
            setFullNameError('Tên khách hàng không hợp lệ.');
            isValid = false;
        }

        if (!customer.email) {
            setEmailError('Vui lòng nhập email.');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
            setEmailError('Email không hợp lệ.');
            isValid = false;
        } else if (customer.email.length > 100) {
            setEmailError('Email không được vượt quá 100 ký tự.');
            isValid = false;
        } else if (customer.email.length < 15) {
            setEmailError('Email phải có ít nhất 15 ký tự.');
            isValid = false;
        } else if (customer.email.includes(" ")) {
            setEmailError('Email không được chứa khoảng trắng.');
            isValid = false;
        }
        else {
            const emailExists = await existsEmail(customer.email);
            if (emailExists) {
                setEmailError('Email đã tồn tại.');
                isValid = false;
            }
        }


        if (!customer.phone) {
            setPhoneError('Vui lòng nhập số điện thoại.');
            isValid = false;
        } else if (!/^\d{10}$/.test(customer.phone)) {
            setPhoneError('Số điện thoại không hợp lệ (10 chữ số).');
            isValid = false;
        } else if (!/^0\d{9}$/.test(customer.phone)) {
            setPhoneError('Số điện thoại phải bắt đầu bằng số 0 và có tổng cộng 10 chữ số.');
            isValid = false;
        }
        else{
            const phoneExists = await existsPhone(customer.phone);
            if (phoneExists) {
                setPhoneError('Số điện thoại đã tồn tại.');
                isValid = false;
            }
        }
 


        if (!customer.birthDate) {
            setBirthDateError('Vui lòng chọn ngày sinh.');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        setLoading(true);

        // Cập nhật các địa chỉ với thuộc tính defaultAddress
        const updatedAddresses = addresses.map((address, index) => ({
            ...address,
            city: address.province?.label,
            district: address.district?.label,
            ward: address.ward?.label,
            detailedAddress: address.detail,
            province: null,
            detail: null,
            defaultAddress: index === defaultAddressIndex,  // Gán defaultAddress là true cho địa chỉ mặc định
        }));

        // Gửi dữ liệu lên API
        console.log("Địa chỉ sau khi cập nhật:", updatedAddresses);
        const updatedCustomer = { ...customer, address: updatedAddresses };
        addCustomer(updatedCustomer)
            .then(response => {
                console.log("Thêm khách hàng thành công:", response);
                localStorage.setItem("successMessage", "Thêm khách hàng thành công!");
                history.push('/admin/customers');
            })
            .catch(error => {
                console.error("Lỗi thêm khách hàng:", error);
                alert("Lỗi thêm khách hàng");
            }).finally(() => {
                setLoading(false);
            })// Gọi hàm addCustomer từ CustomersService          

    };

    const handleAddAddress = () => {
        setAddresses([...addresses, {}]); // Thêm địa chỉ mới vào danh sách
    };

    const handleInputChange = (index, field, value) => {
        const newAddresses = [...addresses];
        newAddresses[index] = {
            ...newAddresses[index],
            [field]: value,
        };
        setAddresses(newAddresses);
    };

    useEffect(() => {
        // Fetch provinces from API 
        delete axios.defaults.headers.common["Authorization"];
        axios.get("https://partner.viettelpost.vn/v2/categories/listProvinceById?provinceId=-1")
            .then(response => {
                setProvinces(response.data.data || []);
                console.log("Tỉnh/thành phố:", response.data.data)
            })

            .catch(error => console.error("Lỗi lấy tỉnh/thành phố:", error));
    }, []);

    // useEffect(() => {

    //     // Xoá timeout cũ nếu đang gõ tiếp
    //     if (typingTimeout) clearTimeout(typingTimeout);

    //     const timeout = setTimeout(() => {
    //         checkEmailExists(customer.email);
    //     }, 500); // Đợi 0.5s trước khi gọi API

    //     setTypingTimeout(timeout);

    //     // Dọn dẹp timeout khi component unmount hoặc email thay đổi
    //     return () => clearTimeout(timeout);
    // }, [customer]);

    // const checkEmailExists = async (email) => {
    //     const emailExists = await existsEmail(email);
    //     if (emailExists) {
    //         setEmailError('Email đã tồn tại.');
    //     }else {
    //         setEmailError('');
    //     } 
    // }
    // const checkPhoneExists = async (phone) => {
    //     const phoneExists = await existsPhone(phone);
    //     if (phoneExists) {
    //         setPhoneError('Số điện thoại đã tồn tại.');
    //     }else {
    //         setPhoneError('');
    //     } 
    // }

    const handleProvinceChange = (index, selectedOption) => {
        setSelectedProvince(selectedOption);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setDistricts([]);
        setWards([]);
        handleInputChange(index, 'province', selectedOption);
        // Fetch districts based on selected province
        if (selectedOption) {
            delete axios.defaults.headers.common["Authorization"];
            axios.get(`https://partner.viettelpost.vn/v2/categories/listDistrict?provinceId=${selectedOption.value}`)
                .then(response => setDistricts(response.data.data || []))
                .catch(error => console.error("Lỗi lấy quận/huyện:", error));
        }
    };

    const handleDistrictChange = (index, selectedOption) => {
        setSelectedDistrict(selectedOption);
        setSelectedWard(null);
        setWards([]);
        handleInputChange(index, 'district', selectedOption);
        // Fetch wards based on selected district
        if (selectedOption) {
            axios.get(`https://partner.viettelpost.vn/v2/categories/listWards?districtId=${selectedOption.value}`)
                .then(response => setWards(response.data.data || []))
                .catch(error => console.error("Lỗi lấy phường/xã:", error));
        }
    };

    const handleWardChange = (index, selectedOption) => {
        setSelectedWard(selectedOption);
        handleInputChange(index, 'ward', selectedOption);
    };
    const handleSetDefaultAddress = (index) => {
        // Cập nhật địa chỉ mặc định
        setDefaultAddressIndex(index);
    };
    const handleRemoveAddress = (index) => {
        // Nếu địa chỉ đang xóa là địa chỉ mặc định, cần cập nhật lại
        if (defaultAddressIndex === index) {
            setDefaultAddressIndex(0); // Xóa địa chỉ mặc định
        }

        const newAddresses = addresses.filter((_, i) => i !== index); // Loại bỏ địa chỉ tại index
        setAddresses(newAddresses);
    };
    return (
        <div>
            {loading && (
                <div className="loading-overlay">
                    <Spinner animation="border" role="status" />
                    <span>Đang xử lý...</span>
                </div>
            )}
            <div className="row">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h3 style={{ textAlign: "center" }}>Thêm khách hàng</h3>
                            <hr></hr>
                            <form className="form-sample" >
                                <div className="row g-4">
                                    {/* Cột 1 */}
                                    <div className="col-md-6 col-12">
                                        <Form.Group className="mb-3">
                                            <label className="form-label">Tên khách hàng</label>
                                            <Form.Control type="text" id="fullNameInput"
                                                value={customer.fullName}
                                                onChange={(e) => {
                                                    setCustomer({ ...customer, fullName: e.target.value });
                                                    setFullNameError(''); // Reset lỗi khi người dùng nhập lại
                                                }} />
                                            {fullNameError && <div style={{ color: "red" }}>{fullNameError}</div>}

                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <label className="form-label">Giới tính</label>
                                            <div className="d-flex align-items-center">
                                                {/* Nam */}
                                                <div className="form-check me-3">
                                                    <Form.Check
                                                        type="radio"
                                                        label="Nam"
                                                        name="gender"
                                                        value="1"
                                                        checked={customer.gender === 1}
                                                        onChange={(e) => setCustomer({ ...customer, gender: e.target.value ? 1 : 0 })} // Nếu chọn Nam thì gán 1, Nữ thì gán 0
                                                        id="genderNam"
                                                        custom
                                                    />
                                                </div>

                                                {/* Nữ */}
                                                <div className="form-check" style={{ marginLeft: "20px" }}>
                                                    <Form.Check
                                                        type="radio"
                                                        label="Nữ"
                                                        name="gender"
                                                        value="0"
                                                        checked={customer.gender === 0}
                                                        onChange={(e) => setCustomer({ ...customer, gender: e.target.value ? 0 : 1 })} // Nếu chọn Nam thì gán 1, Nữ thì gán 0
                                                        id="genderNu"
                                                        custom
                                                    />
                                                </div>
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <label className="form-label">Ngày sinh</label>
                                            <Form.Control type="date" id="birthDateInput"
                                                value={customer.birthDate}
                                                onChange={(e) => {
                                                    setCustomer({ ...customer, birthDate: e.target.value });
                                                    setBirthDateError(''); // Reset lỗi khi người dùng nhập lại
                                                }} />
                                                
                                            {birthDateError && (
                                                <div style={{ color: "red" }}>{birthDateError}</div>
                                            )}

                                        </Form.Group>
                                    </div>

                                    {/* Cột 2 */}
                                    <div className="col-md-6 col-12">
                                        {/* <Form.Group className="mb-3">
                                            <label className="form-label">Username</label>
                                            <Form.Control type="text" id="usernameInput" value={customer.fullName}
                                            onChange={(e) => {
                                                setCustomer({ ...customer, fullName: e.target.value });
                                            }} />
                                        </Form.Group> */}

                                        <Form.Group className="mb-3">
                                            <label className="form-label">Email</label>
                                            <Form.Control type="email" id="emailInput"
                                                value={customer.email}
                                                onChange={(e) => {
                                                    setCustomer({ ...customer, email: e.target.value });
                                                    setEmailError(''); // Reset lỗi khi người dùng nhập lại
                                                }} />
                                            {emailError && <div style={{ color: "red" }}>{emailError}</div>}

                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <label className="form-label">Số điện thoại</label>
                                            <Form.Control type="tel" id="phoneInput"
                                                value={customer.phone}
                                                onChange={(e) => {
                                                    setCustomer({ ...customer, phone: e.target.value });
                                                    setPhoneError(''); // Reset lỗi khi người dùng nhập lại
                                                }} />
                                            {phoneError && <div style={{ color: "red" }}>{phoneError}</div>}


                                        </Form.Group>
                                    </div>

                                </div>
                                <hr></hr>
                                <div>
                                    {/* Button to add new address */}


                                    {/* Render multiple address forms */}
                                    {addresses.map((address, index) => (
                                        <div key={index} className="address-form">
                                            <h4>Địa chỉ {index + 1}</h4>
                                            <div className="row g-3">
                                                {/* Tỉnh/thành phố */}
                                                <div className="col-md-3">
                                                    <Form.Group className="mb-3">
                                                        <label className="form-label">Tỉnh/thành phố</label>
                                                        <Select
                                                            options={provinces.map((province) => ({
                                                                value: province.PROVINCE_ID,
                                                                label: province.PROVINCE_NAME,
                                                            }))}
                                                            value={address.province}
                                                            onChange={(selectedOption) => handleProvinceChange(index, selectedOption)}
                                                            placeholder="Chọn tỉnh/thành phố"
                                                        />
                                                    </Form.Group>
                                                </div>

                                                {/* Quận/huyện */}
                                                <div className="col-md-3">
                                                    <Form.Group className="mb-3">
                                                        <label className="form-label">Quận/huyện</label>
                                                        <Select
                                                            options={districts.map((district) => ({
                                                                value: district.DISTRICT_ID,
                                                                label: district.DISTRICT_NAME,
                                                            }))}
                                                            value={address.district}
                                                            onChange={(selectedOption) => handleDistrictChange(index, selectedOption)}
                                                            isDisabled={!address.province}
                                                            placeholder="Chọn quận/huyện"
                                                        />
                                                    </Form.Group>
                                                </div>

                                                {/* Phường/xã */}
                                                <div className="col-md-3">
                                                    <Form.Group className="mb-3">
                                                        <label className="form-label">Phường/xã</label>
                                                        <Select
                                                            options={wards.map((ward) => ({
                                                                value: ward.WARDS_ID,
                                                                label: ward.WARDS_NAME,
                                                            }))}
                                                            value={address.ward}
                                                            onChange={(selectedOption) => handleWardChange(index, selectedOption)}
                                                            isDisabled={!address.district}
                                                            placeholder="Chọn phường/xã"
                                                        />
                                                    </Form.Group>
                                                </div>

                                                {/* Địa chỉ chi tiết */}
                                                <div className="col-md-6">
                                                    <Form.Group className="mb-3">
                                                        <label className="form-label">Địa chỉ chi tiết</label>
                                                        <Form.Control
                                                            type="text"
                                                            value={address.detail}
                                                            onChange={(e) => handleInputChange(index, 'detail', e.target.value)}
                                                        />
                                                    </Form.Group>
                                                </div>
                                            </div>

                                            {/* Chọn làm địa chỉ mặc định */}
                                            <div>
                                                <div className="mt-6 flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        className="h-16 w-16 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                        checked={defaultAddressIndex === index}  // Nếu là địa chỉ mặc định, checkbox sẽ được chọn
                                                        onChange={() => handleSetDefaultAddress(index)}  // Khi chọn địa chỉ, sẽ set nó là mặc định
                                                    />
                                                    <span className="ml-6 text-4xl text-gray-900 font-extrabold">Chọn làm địa chỉ mặc định</span>
                                                </div>
                                            </div>
                                            <div className="mt-3">
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleRemoveAddress(index)}
                                                    disabled={addresses.length === 1} // Không cho xóa nếu chỉ còn 1 địa chỉ
                                                >
                                                    Xóa địa chỉ
                                                </Button>
                                            </div>
                                            <hr />
                                        </div>
                                    ))}

                                    <div className="d-flex justify-content-end mt-7">
                                        <Button onClick={handleAddAddress} variant="primary" className="btn btn-gradient-primary btn-icon-text">
                                            Thêm địa chỉ mới
                                        </Button>
                                        <Button onClick={handleSaveCustomer} variant="primary" className="btn btn-gradient-primary btn-icon-text">
                                            Lưu thông tin
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateCustomer
