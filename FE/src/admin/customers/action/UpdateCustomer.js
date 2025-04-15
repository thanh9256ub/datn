import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import Select from 'react-select'; // Import react-select
import { addAddressCustomer, addCustomer, deleteAddressCustomer, getCusomer, listCustomer, updateAddressCustomer, updateCustomer } from '../service/CustomersService';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { Spinner } from 'react-bootstrap';

const UpdateCustomer = () => {

    const { id } = useParams();

    const [customers, setCustomers] = useState([]);

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

    const [update, setUpdate] = useState({});

    const [totalPage, setTotalPage] = useState(999);

    const [page, setPage] = useState(1);

    const [loading, setLoading] = useState(false);

    const handleAddAddress = () => {
        setAddresses([...addresses, {}]) // Thêm địa chỉ mới vào danh sách
    };

    const handleInputChange = (index, field, value) => {
        const newAddresses = [...addresses];
        newAddresses[index] = {
            ...newAddresses[index],
            [field]: value
        };
        setAddresses(newAddresses);
    };

    useEffect(() => {
        // Fetch provinces from API
        delete axios.defaults.headers.common["Authorization"];
        axios.get("https://partner.viettelpost.vn/v2/categories/listProvinceById?provinceId=-1")
            .then(response => setProvinces(response.data.data || []))
            .catch(error => console.error("Lỗi lấy tỉnh/thành phố:", error));
    }, []);

    const handleProvinceChange = (index, selectedOption) => {
        setSelectedProvince(selectedOption);
        setSelectedDistrict(null);
        setSelectedWard(null);
        setDistricts([]);
        setWards([]);
        handleInputChange(index, 'city', selectedOption?.label);
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
        handleInputChange(index, 'district', selectedOption?.label);
        // Fetch wards based on selected district
        if (selectedOption) {
            axios.get(`https://partner.viettelpost.vn/v2/categories/listWards?districtId=${selectedOption.value}`)
                .then(response => setWards(response.data.data || []))
                .catch(error => console.error("Lỗi lấy phường/xã:", error));
        }
    };

    const handleWardChange = (index, selectedOption) => {
        setSelectedWard(selectedOption);
        handleInputChange(index, 'ward', selectedOption?.label);
    };
    const handleSetDefaultAddress = (index) => {
        // Cập nhật địa chỉ mặc định
        setDefaultAddressIndex(index);
    };
    const handleRemoveAddress = (id, index) => {
        if (!!id) {
            deleteAddressCustomer(id).then(response => {
                alert('Bạn đã xóa 1 địa chỉ')
            })
        }

        // Nếu địa chỉ đang xóa là địa chỉ mặc định, cần cập nhật lại
        if (defaultAddressIndex === index) {
            setDefaultAddressIndex(-1); // Xóa địa chỉ mặc định
        }

        const newAddresses = addresses.filter((_, i) => i !== index); // Loại bỏ địa chỉ tại index
        setAddresses(newAddresses);
    };


    const handleAddOrUpdateAddress = (idAddress, index) => {
        const newAddresses = [...addresses];
        const defaultAddress = defaultAddressIndex === index;
        const address = {
            ...newAddresses[index],
            defaultAddress: defaultAddress,
            customerId: id,
            status: defaultAddress ? 1 : 0,
            updatedAt: null,
            createdAt: null
        };
        if (!!idAddress) {
            updateAddressCustomer(idAddress, address).then(response => {
                alert('Bạn đã cập nhật 1 địa chỉ')
            });
        } else {
            addAddressCustomer(address).then(response => {
                newAddresses[index] = {
                    ...newAddresses[index],
                    id: response.data.id
                }
                if(!!response.data.defaultAddress) setDefaultAddressIndex(index);
                setAddresses(newAddresses);
            })
        }
    };

    useEffect(() => {
        const fetchCustomer = async () => {
            setLoading(true);
            try {
                const response = await getCusomer(id);
                console.log(response.data);
                setUpdate(response.data);
                setDefaultAddressIndex(response.data.addressList?.findIndex((address) => address.defaultAddress));
                setAddresses(response.data.addressList)
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomer();
    }, [id]);

    const handleUpdateCustomer = () => {
        if (window.confirm('Bạn có chắc chắn muốn cập nhật thông tin?')) {
            const updateCustomerInfo = {
                fullName: update.fullName,
                birthDate: update.birthDate,
                gender: update.gender,
                phone: update.phone,
                email: update.email,
                status: update.status
            };
            updateCustomer(id, updateCustomerInfo).then(data => {
                localStorage.setItem("successMessage", "Cập nhật khách hàng thành công!");
                history.push('/admin/customers');
            });
        }
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
                            <h3 style={{ textAlign: "center" }}>Cập nhật khách hàng</h3>
                            <hr></hr>
                            <form className="form-sample" >
                                <div className="row g-4">
                                    {/* Cột 1 */}
                                    <div className="col-md-6 col-12">
                                        <Form.Group className="mb-3">
                                            <label className="form-label">Mã khách hàng</label>
                                            <Form.Control type="text" id="customerCodeInput"
                                                value={update.customerCode}
                                                disabled={true}
                                                onChange={(e) => {
                                                    setUpdate({ ...update, customerCode: e.target.value });
                                                }} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <label className="form-label">Tên khách hàng</label>
                                            <Form.Control type="text" id="fullNameInput"
                                                value={update.fullName}
                                                onChange={(e) => {
                                                    setUpdate({ ...update, fullName: e.target.value });
                                                }} />
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
                                                        checked={update.gender === 1}
                                                        onChange={(e) => setUpdate({ ...update, gender: e.target.value ? 1 : 0 })}
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
                                                        checked={update.gender === 0}
                                                        onChange={(e) => setUpdate({ ...update, gender: e.target.value ? 0 : 1 })}
                                                        id="genderNu"
                                                        custom
                                                    />
                                                </div>
                                            </div>
                                        </Form.Group>
                                        <Form.Group>
                                            <label className="form-label">Trạng thái</label>
                                            <Select
                                                options={[{ value: 1, label: "Đang hoạt động" }, { value: 0, label: "Không hoạt động" }]}
                                                value={{ value: update.status, label: update.status === 1 ? "Đang hoạt động" : "Không hoạt động" }}
                                                onChange={(selected) => setUpdate({ ...update, status: selected.value })}
                                            />
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
                                            <label className="form-label">Ngày sinh</label>
                                            <Form.Control type="date" id="birthDateInput"
                                                value={update.birthDate}
                                                onChange={(e) => {
                                                    setUpdate({ ...update, birthDate: e.target.value });
                                                }} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <label className="form-label">Email</label>
                                            <Form.Control type="email" id="emailInput"
                                                value={update.email}
                                                onChange={(e) => {
                                                    setUpdate({ ...update, email: e.target.value });
                                                }} />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <label className="form-label">Số điện thoại</label>
                                            <Form.Control type="tel" id="phoneInput"
                                                value={update.phone}
                                                onChange={(e) => {
                                                    setUpdate({ ...update, phone: e.target.value });
                                                }} />
                                        </Form.Group>

                             
                                    </div>

                                </div>
                                <hr></hr>
                                <div>
                                    {/* Button to add new address */}
                                    {/* Render multiple address forms */}
                                    {addresses?.map((address, index) => (
                                        <div key={index} className="address-form">
                                            <h4>Địa chỉ {index + 1}</h4>
                                            <div className="row g-4">
                                                {/* Tỉnh/thành phố */}
                                                <div className="col-md-4">
                                                    <Form.Group className="mb-4">
                                                        <label className="form-label">Tỉnh/thành phố</label>
                                                        <Select
                                                            options={provinces.map((province) => ({
                                                                value: province.PROVINCE_ID,
                                                                label: province.PROVINCE_NAME,
                                                            }))}
                                                            value={{ label: address.city }}
                                                            onChange={(selectedOption) => handleProvinceChange(index, selectedOption)}
                                                            placeholder="Chọn tỉnh/thành phố"
                                                        />
                                                    </Form.Group>
                                                </div>

                                                {/* Quận/huyện */}
                                                <div className="col-md-4">
                                                    <Form.Group className="mb-4">
                                                        <label className="form-label">Quận/huyện</label>
                                                        <Select
                                                            options={districts.map((district) => ({
                                                                value: district.DISTRICT_ID,
                                                                label: district.DISTRICT_NAME,
                                                            }))}
                                                            value={{ label: address.district }}
                                                            onChange={(selectedOption) => handleDistrictChange(index, selectedOption)}
                                                            isDisabled={!address.city}
                                                            placeholder="Chọn quận/huyện"
                                                        />
                                                    </Form.Group>
                                                </div>

                                                {/* Phường/xã */}
                                                <div className="col-md-4">
                                                    <Form.Group className="mb-4">
                                                        <label className="form-label">Phường/xã</label>
                                                        <Select
                                                            options={wards.map((ward) => ({
                                                                value: ward.WARDS_ID,
                                                                label: ward.WARDS_NAME,
                                                            }))}
                                                            value={{ label: address.ward }}
                                                            onChange={(selectedOption) => handleWardChange(index, selectedOption)}
                                                            isDisabled={!address.district}
                                                            placeholder="Chọn phường/xã"
                                                        />
                                                    </Form.Group>
                                                </div>

                                                {/* Địa chỉ chi tiết */}
                                                <div className="col-md-12">
                                                    <Form.Group className="mb-3">
                                                        <label className="form-label">Địa chỉ chi tiết</label>
                                                        <Form.Control
                                                            type="text"
                                                            value={address.detailedAddress}
                                                            onChange={(e) => handleInputChange(index, 'detailedAddress', e.target.value)}
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
                                                    onClick={() => handleRemoveAddress(address.id, index)}
                                                    disabled={addresses.length === 1} // Không cho xóa nếu chỉ còn 1 địa chỉ
                                                >
                                                    Xóa địa chỉ
                                                </Button>
                                                <Button
                                                    variant={!!address.id ? "warning" : "info"}
                                                    onClick={() => handleAddOrUpdateAddress(address.id, index)}
                                                >
                                                    {!!address.id ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
                                                </Button>
                                            </div>
                                            <hr />
                                        </div>
                                    ))}

                                    <div className="d-flex justify-content-end mt-7">
                                        <Button onClick={handleAddAddress} variant="primary" className="btn btn-gradient-primary btn-icon-text">
                                            Thêm địa chỉ mới
                                        </Button>
                                        <Button onClick={handleUpdateCustomer} variant="primary" className="btn btn-gradient-primary btn-icon-text">
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

export default UpdateCustomer
