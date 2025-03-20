import React, { useEffect, useRef, useState } from 'react'
import { Button, Modal, Col, InputGroup, Container, Form, Alert, Spinner } from "react-bootstrap";
import { addCustomer, listAddress, listCustomer, listRole, updateCustomer, addAddressCustomer } from './service/CustomersService.js';
import './Customer.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min.js';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const Customers = () => {

    const [customers, setCustomers] = useState([]);

    const [page, setPage] = useState(1);

    const [totalPage, setTotalPage] = useState(999);

    const [search, setSearch] = useState('');

    const [roles, setRoles] = useState([]);

    const [addressCusstomer, setAddressCusstomer] = useState({});

    const [detail, setDetail] = useState({});

    const [showModal, setShowModal] = useState(false);

    const [showModalAdd, setShowModalAdd] = useState(false);

    const [showModalAddress, setShowModalAddress] = useState(false);

    const [newCustomer, setNewCustomer] = useState({});

    const toggleShowPassword = () => {
        setShowPassword(!showPassword); // Hàm để thay đổi trạng thái hiển thị mật khẩu
    };

    const [showPassword, setShowPassword] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");

    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(true);

    // Hàm mở Modal
    const handleShow = (customer) => {
        setShowModal(true);
        setDetail(customer);
    };
    // Hàm đóng Modal
    const handleClose = () => setShowModal(false);

    const handleCloseAdd = () => setShowModalAdd(false);

    const handleCloseAddress = () => setShowModalAddress(false);

    const history = useHistory();

    useEffect(async () => {
        // getAllCusomers()
        setLoading(true);
        listCustomer(search, page).then((response) => {
            setCustomers(response.data.data);
            setTotalPage(response.data.totalPage);
            setLoading(false);
        }).catch(error => {
            console.error(error);
        })
    }, [])

    useEffect(async () => {
        // getAllRole()
        let req = await listRole();
        setRoles(req.data.data);

    }, [])


    const handleTruoc = (async () => {
        if (page > 1) {
            setPage(page - 1);
            let req = await listCustomer(search, page - 1);
            setCustomers(req.data.data);
            setTotalPage(req.data.totalPage);
        }


    });
    const handleSau = (async () => {
        if (page < totalPage) {
            setPage(page + 1);
            let req = await listCustomer(search, page + 1);
            setCustomers(req.data.data);
            setTotalPage(req.data.totalPage);
        }
    });


    function getAllCusomers() {
        listCustomer(search, page).then((response) => {
            setCustomers(response.data.data);
            setTotalPage(response.data.totalPage);
        }).catch(error => {
            console.error(error);
        })
    }


    // useEffect(() => {
    //     async function fetchData() {
    //         try {
    //             let req = await listAddress();
    //             setAddress(req.data.data);
    //         } catch (error) {
    //             console.error("Error fetching addresses:", error);
    //         }
    //     }
    //     fetchData();
    // }, [listAddress]);



    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);




    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSearch = () => {
        setPage(1)
        listCustomer(search, 1).then((response) => {
            setCustomers(response.data.data);
            setTotalPage(response.data.totalPage);
        }).catch(error => {
            console.error(error);
        })
    };


    const handleAddCustomer = () => {
        setNewCustomer({ ...newCustomer })
        if (window.confirm('Bạn có chắc chắn muốn thêm khách hàng?')) {
            addCustomer(newCustomer).then(async data => {
                setAddressCusstomer({ ...addressCusstomer, defaultAddress: true, customerId: data.data.id })
                addAddressCustomer(addressCusstomer)
                setShowModalAdd(false);
                setPage(1);
                setSearch("");
                listCustomer("", 1).then((response) => {
                    setCustomers(response.data.data);
                    setTotalPage(response.data.totalPage);
                }).catch(error => {
                    console.error(error);
                })
            });

        };
    }

    const handleUpdate = (id, customer) => {
        if (window.confirm('Bạn có chắc chắn muốn cập nhật thông tin nhân viên này?')) {
            updateCustomer(id, customer).then(data => {
                setShowModal(false);
                getAllCusomers();
            });
        }
    };

    const handleAdd = () => {
        history.push('/admin/customers/add');
    }

    const handleUpdateCustomer = (id) => {
        history.push(`/admin/customers/update/${id}`)
    }


    // Thông báo thành công
    const message = localStorage.getItem("successMessage");
    if (message) {
        toast.success(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
        localStorage.removeItem("successMessage");
    }

    return (
        <div>
            <div className='container' style={{ display: "flex", marginBottom: "10px" }}>
                <div style={{ width: "300px", overflow: "hidden" }}>
                    <InputGroup>
                        <Form.Control
                            placeholder="Tìm kiếm..."
                            style={{ border: "none", outline: "none", padding: "8px 12px" }}
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <Button variant="light" style={{ border: "none", padding: "8px 15px" }} onClick={handleSearch}>Tìm kiếm</Button>
                    </InputGroup>
                </div>
                <div style={{ marginLeft: "580px" }}>
                    <Button
                        onClick={handleAdd}
                    // onClick={() => setShowModalAdd(true)} 
                    >Thêm khách hàng</Button >
                </div>
            </div>

            <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h3 style={{ textAlign: "center" }}>Danh sách khách hàng</h3>
                        {/* <p className="card-description"> Add className <code>.table-hover</code>
                        </p> */}
                        {successMessage && (
                            <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
                                {successMessage}
                            </Alert>
                        )}
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                                <Spinner animation="border" variant="primary" />
                                <span className="ml-2">Đang tải dữ liệu...</span>
                            </div>
                        ) : error ? (
                            <div className="text-danger">{error}</div>
                        ) : (
                            <div>
                                <div style={{ height: "400px" }}>
                                    <table className="table table-hover text-center">
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Mã</th>
                                                <th>Họ tên</th>
                                                <th>Giới tính</th>
                                                <th>Số điện thoại</th>
                                                <th>Địa chỉ</th>
                                                <th>Chỉnh sửa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                customers.map((customer, index) => (
                                                    <React.Fragment key={customer.id}>
                                                        <tr key={customer.id}>
                                                            <td>{index + 1}</td>
                                                            <td>{customer.customerCode}</td>
                                                            <td>{customer.fullName}</td>
                                                            <td>{customer.gender ? "Nam" : "Nữ"}</td>
                                                            <td>{customer.phone}</td>
                                                            <td>{customer.address}</td>
                                                            {/* <td>
                                                            <Button variant="link" onClick={() => handleShow(customer)}>
                                                                Chi tiết
                                                            </Button>
                                                        </td> */}
                                                            <td>
                                                                <Button variant="link" onClick={() => handleShow(customer)}>
                                                                    <i className='mdi mdi-eye'></i>
                                                                </Button>
                                                                <Button variant="link" onClick={() => handleUpdateCustomer(customer.id)}>
                                                                    <i className='mdi mdi-border-color'></i>
                                                                </Button>
                                                            </td>
                                                            <td>
                                                                {/* <div>
                                                                <Button className="dropdown-trigger" ref={dropdownRef} onClick={toggleDropdown}>
                                                                    ...
                                                                </Button>
                                                                {isOpen && (
                                                                    <div className="dropdown-menu">
                                                                        <ul>
                                                                            <li>Detail</li>
                                                                            <li>Tùy chọn</li>
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div> */}
                                                            </td>
                                                        </tr>

                                                    </React.Fragment>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div>
                                    <label onClick={() => handleTruoc()}><i className='mdi mdi-arrow-left-bold'></i></label>
                                    <label>Trang: {page}/{totalPage}</label>
                                    <label onClick={() => handleSau()}><i className='mdi mdi-arrow-right-bold'></i></label>
                                </div>

                                <Modal show={showModal} onHide={handleClose} size='lg'>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Thông tin khách hàng</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {/* Nội dung của Modal */}
                                        <form >
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: "50%" }}>
                                                    <div>
                                                        <div>
                                                            <label htmlFor="customerCodeInput" className="form-label">
                                                                Mã khách hàng
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input

                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}

                                                                disabled={true}
                                                                type="text"
                                                                className="form-control"
                                                                id="customerCodeInput" // Thay đổi id
                                                                value={detail.customerCode}
                                                                onChange={(e) => {
                                                                    setDetail({ ...detail, customerCode: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="fullNameInput" className="form-label">
                                                                Tên khách hàng
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input
                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}
                                                                type="text"
                                                                className="form-control"
                                                                id="fullNameInput" // Thay đổi id 
                                                                value={detail.fullName}
                                                                onChange={(e) => {
                                                                    setDetail({ ...detail, fullName: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="genderLabel" className="form-label">
                                                                Giới tính
                                                            </label>
                                                        </div>
                                                        <div className='container' style={{ display: "flex", marginBottom: "10px", fontSize: '20px' }}>
                                                            <div>
                                                                <input

                                                                    type="radio" className="form-check-input" name="gender" id="male"
                                                                    value="Nam"
                                                                    checked={detail.gender === "Nam"}
                                                                    onChange={(e) => {
                                                                        setDetail({ ...detail, gender: e.target.value });
                                                                    }}
                                                                />
                                                                <label htmlFor="male" className="form-check-label">Nam</label>
                                                            </div>

                                                            <div style={{ marginLeft: "60px" }} >
                                                                <input

                                                                    type="radio" className="form-check-input" name="gender" id="female"
                                                                    value="Nữ"
                                                                    checked={detail.gender === "Nữ"}
                                                                    onChange={(e) => {
                                                                        setDetail({ ...detail, gender: e.target.value });
                                                                    }}

                                                                />
                                                                <label htmlFor="female" className="form-check-label">Nữ</label>
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="phoneInput" className="form-label">
                                                                Số điện thoại
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input
                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}
                                                                type="tel"
                                                                className="form-control"
                                                                id="phoneInput"
                                                                value={detail.phone}
                                                                onChange={(e) => {
                                                                    setDetail({ ...detail, phone: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="addressInput" className="form-label">
                                                                Địa chỉ
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <textarea style={{
                                                                border: '1px solid black',
                                                                padding: '8px',
                                                                borderRadius: '4px',
                                                                fontSize: '16px', width: "100%"
                                                            }}
                                                                className="form-control"
                                                                id="addressInput"
                                                                value={detail.address}
                                                                onChange={(e) => {
                                                                    setDetail({ ...detail, address: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>




                                                </div>

                                                <div style={{ width: "50%", marginLeft: "50px" }}>
                                                    <div>
                                                        <div>
                                                            <label htmlFor="birthDateInput" className="form-label">
                                                                Ngày sinh
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input
                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}

                                                                type="date"
                                                                className="form-control"
                                                                id="birthDateInput"
                                                                value={detail.birthDate}
                                                                onChange={(e) => {
                                                                    setDetail({ ...detail, birthDate: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div>
                                                            <label htmlFor="emailInput" className="form-label">
                                                                Email
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input
                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}
                                                                type="email"
                                                                className="form-control"
                                                                id="emailInput"
                                                                value={detail.email}
                                                                onChange={(e) => {
                                                                    setDetail({ ...detail, email: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* <div style={{ marginTop: "10px" }}>
                                                    <div>
                                                        <label htmlFor="passwordInput" className="form-label">
                                                            Password
                                                        </label>
                                                    </div>
                                                    <div style={{ position: 'relative' }}>

                                                        <input
                                                            style={{
                                                                border: '1px solid black',
                                                                padding: '8px',
                                                                borderRadius: '4px',
                                                                fontSize: '16px', width: "100%"
                                                            }}
                                                            type={showPassword ? 'text' : 'password'} // Use "text" for password
                                                            className="form-control"
                                                            id="passwordInput" // Change id to passwordInput
                                                            value={newCustomer.password} // Change value to detail.username

                                                            onChange={(e) => {
                                                                setNewCustomer({ ...newCustomer, password: e.target.value }); // Change to update username
                                                            }}
                                                        />
                                                        <i
                                                            type="button"
                                                            onClick={toggleShowPassword}
                                                            className="mdi mdi-eye"
                                                            style={{
                                                                position: 'absolute',
                                                                top: '50%',
                                                                right: '10px',
                                                                transform: 'translateY(-50%)',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            {showPassword ? '' : ''}
                                                        </i>

                                                    </div>
                                                </div> */}
                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="createdAtInput" className="form-label">
                                                                Ngày tạo
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input
                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}
                                                                type="date" // Sử dụng input type "date"
                                                                className="form-control"
                                                                id="createdAtInput"
                                                                disabled={true}
                                                                value={detail.createdAt} // Thay đổi giá trị
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="updatedAtInput" className="form-label">
                                                                Ngày sửa gần nhất
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input
                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}
                                                                type="date" // Sử dụng input type "date"
                                                                className="form-control"
                                                                id="updatedAtInput" // Thay đổi id
                                                                disabled={true}
                                                                value={detail.updatedAt} // Thay đổi giá trị
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="roleIdInput" className="form-label">
                                                                Vai trò
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <select
                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}
                                                                className="form-select"
                                                                id="roleIdInput"

                                                                // value= "Amin"
                                                                onChange={(e) => {
                                                                    setDetail({ ...detail, roleId: e.target.value });
                                                                }}
                                                            >
                                                                {roles.map((role) => (
                                                                    <option key={role.id} value={role.id} selected={role.id === detail.roleId}>
                                                                        {role.roleName}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>



                                                </div>

                                            </div>
                                        </form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <div style={{ display: "flex" }}>
                                            {/* <div>
                                            <Button variant="primary" type="submit" onClick={() => handleUpdate(detail.id, detail)}>
                                                Lưu thay đổi
                                            </Button>
                                        </div> */}
                                            <div>
                                                <Button variant="primary" onClick={handleClose}>
                                                    Đóng
                                                </Button>
                                            </div>
                                        </div>
                                    </Modal.Footer>
                                </Modal>

                                <Modal show={showModalAdd} onHide={handleCloseAdd} size='lg'>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Thêm khách hàng</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {/* Nội dung của Modal */}
                                        <form >
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: "50%" }}>
                                                    <div>
                                                        <div>
                                                            <label htmlFor="customerCodeInput" className="form-label">
                                                                Mã khách hàng
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input
                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}
                                                                type="text"
                                                                className="form-control"
                                                                id="customerCodeInput"
                                                                value={newCustomer.customerCode}
                                                                onChange={(e) => {
                                                                    setNewCustomer({ ...newCustomer, customerCode: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="fullNameInput" className="form-label">
                                                                Tên khách hàng
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input
                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}
                                                                type="text"
                                                                className="form-control"
                                                                id="fullNameInput" // Thay đổi id 
                                                                value={newCustomer.fullName}
                                                                onChange={(e) => {
                                                                    setNewCustomer({ ...newCustomer, fullName: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="genderLabel" className="form-label">
                                                                Giới tính
                                                            </label>
                                                        </div>
                                                        <div className='container' style={{ display: "flex", marginBottom: "10px", fontSize: '20px' }}>
                                                            <div>
                                                                <input

                                                                    type="radio" className="form-check-input" name="gender" id="male"
                                                                    value="Nam"
                                                                    checked={newCustomer.gender === "Nam"}
                                                                    onChange={(e) => {
                                                                        setNewCustomer({ ...newCustomer, gender: e.target.value });
                                                                    }}
                                                                />
                                                                <label htmlFor="male" className="form-check-label">Nam</label>
                                                            </div>

                                                            <div style={{ marginLeft: "60px" }} >
                                                                <input

                                                                    type="radio" className="form-check-input" name="gender" id="female"
                                                                    value="Nữ"
                                                                    checked={newCustomer.gender === "Nữ"}
                                                                    onChange={(e) => {
                                                                        setNewCustomer({ ...newCustomer, gender: e.target.value });
                                                                    }}

                                                                />
                                                                <label htmlFor="female" className="form-check-label">Nữ</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="phoneInput" className="form-label">
                                                                Số điện thoại
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input
                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}
                                                                type="tel"
                                                                className="form-control"
                                                                id="phoneInput"
                                                                value={newCustomer.phone}
                                                                onChange={(e) => {
                                                                    setNewCustomer({ ...newCustomer, phone: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div>
                                                            <label htmlFor="emailInput" className="form-label">
                                                                Email
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input
                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}
                                                                type="email"
                                                                className="form-control"
                                                                id="emailInput"
                                                                value={newCustomer.email}
                                                                onChange={(e) => {
                                                                    setNewCustomer({ ...newCustomer, email: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="passwordInput" className="form-label">
                                                                Password
                                                            </label>
                                                        </div>
                                                        <div style={{ position: 'relative' }}>

                                                            <input
                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}
                                                                type={showPassword ? 'text' : 'password'} // Use "text" for password
                                                                className="form-control"
                                                                id="passwordInput" // Change id to passwordInput
                                                                value={newCustomer.password} // Change value to detail.username

                                                                onChange={(e) => {
                                                                    setNewCustomer({ ...newCustomer, password: e.target.value }); // Change to update username
                                                                }}
                                                            />
                                                            <i
                                                                type="button"
                                                                onClick={toggleShowPassword}
                                                                className="mdi mdi-eye"
                                                                style={{
                                                                    position: 'absolute',
                                                                    top: '50%',
                                                                    right: '10px',
                                                                    transform: 'translateY(-50%)',
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                {showPassword ? '' : ''}
                                                            </i>

                                                        </div>
                                                    </div>
                                                </div>

                                                <div style={{ width: "50%", marginLeft: "50px" }}>
                                                    <div>
                                                        <div>
                                                            <label htmlFor="addressInput" className="form-label">
                                                                Tỉnh/Thành phố
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input style={{
                                                                border: '1px solid black',
                                                                padding: '8px',
                                                                borderRadius: '4px',
                                                                fontSize: '16px', width: "100%"
                                                            }}
                                                                className="form-control"
                                                                id="addressInput"
                                                                value={addressCusstomer.city}
                                                                onChange={(e) => {
                                                                    setAddressCusstomer({ ...addressCusstomer, city: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="addressInput" className="form-label">
                                                                Quận/Huyện
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input style={{
                                                                border: '1px solid black',
                                                                padding: '8px',
                                                                borderRadius: '4px',
                                                                fontSize: '16px', width: "100%"
                                                            }}
                                                                className="form-control"
                                                                id="addressInput"
                                                                value={addressCusstomer.district}
                                                                onChange={(e) => {
                                                                    setAddressCusstomer({ ...addressCusstomer, district: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="addressInput" className="form-label">
                                                                Phường/Xã
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input style={{
                                                                border: '1px solid black',
                                                                padding: '8px',
                                                                borderRadius: '4px',
                                                                fontSize: '16px', width: "100%"
                                                            }}
                                                                className="form-control"
                                                                id="addressInput"
                                                                value={addressCusstomer.ward}
                                                                onChange={(e) => {
                                                                    setAddressCusstomer({ ...addressCusstomer, ward: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="addressInput" className="form-label">
                                                                Địa chỉ chi tiết
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input style={{
                                                                border: '1px solid black',
                                                                padding: '8px',
                                                                borderRadius: '4px',
                                                                fontSize: '16px', width: "100%"
                                                            }}
                                                                className="form-control"
                                                                id="addressInput"
                                                                value={addressCusstomer.detailedAddress}
                                                                onChange={(e) => {
                                                                    setAddressCusstomer({ ...addressCusstomer, detailedAddress: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="addressInput" className="form-label">
                                                                Địa chỉ mặc định
                                                            </label>
                                                        </div>
                                                        <div>
                                                            <input style={{
                                                                border: '1px solid black',
                                                                padding: '8px',
                                                                borderRadius: '4px',
                                                                fontSize: '16px', width: "100%"
                                                            }}
                                                                type='checkbox'
                                                                className="form-control"
                                                                id="addressInput"
                                                                value={false}
                                                                onChange={(e) => {
                                                                    setAddressCusstomer({ ...addressCusstomer, defaultAddress: e.target.checked });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <div style={{ display: "flex" }}>
                                            <div>
                                                <Button variant="primary" type="submit" onClick={() => handleAddCustomer()}>
                                                    Thêm khách hàng
                                                </Button>
                                            </div>
                                            <div>
                                                <Button variant="primary" onClick={handleCloseAdd}>
                                                    Hủy
                                                </Button>
                                            </div>
                                        </div>
                                    </Modal.Footer>
                                </Modal>


                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}

export default Customers