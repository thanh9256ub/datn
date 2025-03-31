import React, { useState, useEffect } from 'react'
import { Button, Modal, InputGroup, Form, Alert, Spinner } from "react-bootstrap";
import { addEmployee, deleteEmployee, listEmployee, listRole, updateEmployee, updateEmployeeStatus } from './service/EmployeeService';
import './Employee.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Employees = () => {

    const [employees, setEmployees] = useState([]);

    const [page, setPage] = useState(1);

    const [statusFilter, setStatusFilter] = useState("");

    const [totalPage, setTotalPage] = useState(999);

    const [roles, setRoles] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [showModalAdd, setShowModalAdd] = useState(false);

    const [detail, setDetail] = useState({});

    const [newEmployee, setNewEmployee] = useState({ birthDate: '' });

    const [birthDateError, setBirthDateError] = useState('');

    const [showPassword, setShowPassword] = useState(false); // Thêm state để theo dõi trạng thái hiển thị mật khẩu

    const [search, setSearch] = useState('');

    const history = useHistory();

    const [successMessage, setSuccessMessage] = useState("");

    const [error, setError] = useState(null);

    const [loading, setLoading] = useState(true);

    // Hàm mở Modal
    const handleShow = (employee) => {
        setShowModal(true);
        setDetail(employee);
    };

    // Hàm đóng Modal
    const handleClose = () => setShowModal(false);

    // Hàm đóng ModalAdd
    const handleCloseAdd = () => setShowModalAdd(false);


    useEffect(async () => {
        getAllEmployee();
    }, [])



    useEffect(async () => {
        // getAllROle()
        let req = await listRole();
        setRoles(req.data.data);

    }, [])

    function getAllEmployee() {
        setLoading(true);
        listEmployee(search, page, statusFilter).then((response) => {
            if (response.status === 200) {
                setEmployees(response.data.data);
                setTotalPage(response.data.totalPage);
                setLoading(false);
            }
            else if (response.status === 401) {
                alert("Bạn không có quyền truy cập vào trang này");
                history.push('/admin/dashboard')
            }
        }).catch(error => {
            console.error(error);
            alert("Bạn không có quyền truy cập vào trang này");
            history.push('/admin/dashboard')
        })

    }

    function removeEmployee(id) {
        // navigate(`/remove-employee/${id}`)
        console.log(id)

        deleteEmployee(id).then(response => {
            getAllEmployee()
        }).then(error => {
            console.log(error)
        })
    }

    const handleRemove = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa trạng thái nhân viên này?')) {
            updateEmployeeStatus(id).then(data => {
                getAllEmployee()
            });

        }
    };


    const handleUpdate = (id, employee) => {
        console.log(employee.roleId)
        if (window.confirm('Bạn có chắc chắn muốn cập nhật thông tin nhân viên này?')) {
            updateEmployee(id, employee).then(data => {
                setShowModal(false);
                getAllEmployee();
            });
        }
    };

    const handleAddEmployee = () => {
        setNewEmployee({ ...newEmployee, status: 1 })
        if (window.confirm('Bạn có chắc chắn muốn thêm nhân viên?')) {
            addEmployee(newEmployee).then(data => {
                setShowModalAdd(false);
                setPage(1);
                setSearch("");
                setStatusFilter("");
                listEmployee("", 1, "").then((response) => {
                    setEmployees(response.data.data);
                    setTotalPage(response.data.totalPage);
                }).catch(error => {
                    console.error(error);
                })
            });

        };
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword); // Hàm để thay đổi trạng thái hiển thị mật khẩu
    };

    const handleTruoc = (async () => {
        if (page > 1) {
            setPage(page - 1);
            let req = await listEmployee(search, page - 1, statusFilter);
            setEmployees(req.data.data);
            setTotalPage(req.data.totalPage);
        }


    });
    const handleSau = (async () => {
        if (page < totalPage) {
            setPage(page + 1);
            let req = await listEmployee(search, page + 1, statusFilter);
            setEmployees(req.data.data);
            setTotalPage(req.data.totalPage);
        }
    });

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleSearch = () => {
        setPage(1)
        listEmployee(search, 1, statusFilter).then((response) => {
            setEmployees(response.data.data);
            setTotalPage(response.data.totalPage);
            console.log("Checkkk search:  ", search)
        }).catch(error => {
            console.error(error);
        })
    };

    const handleChangeStatus = (event) => {
        setPage(1)
        setStatusFilter(event.target.value);
        listEmployee(search, 1, event.target.value).then((response) => {
            setEmployees(response.data.data);
            setTotalPage(response.data.totalPage);
            console.log("Checkkk search:  ", search)
        }).catch(error => {
            console.error(error);
        })
    };

    const handleAdd = () => {
        history.push('/admin/employees/add')
    }

    const handleUpdateEmployee = (id) => {
        history.push(`/admin/employees/update/${id}`)
    }

    // Thông báo
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                {/* Tìm kiếm */}
                <div style={{ flex: 1, maxWidth: "300px" }}>
                    <InputGroup>
                        <Form.Control
                            placeholder="Mã, tên nhân viên....."
                            style={{
                                border: "1px solid #ccc",
                                borderRadius: "px",
                                padding: "8px 12px",
                                fontSize: "16px"
                            }}
                            value={search}
                            onChange={handleSearchChange}
                        />
                        <Button
                            variant="light"
                            style={{ border: "1px solid #ccc", padding: "8px 15px", borderRadius: "4px" }}
                            onClick={handleSearch}
                        >
                            Tìm kiếm
                        </Button>
                    </InputGroup>
                </div>

                {/* Bộ lọc */}
                <div>
                    <select
                        style={{
                            border: '1px solid #ccc',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            fontSize: '16px',
                            marginLeft: '20px', // Điều chỉnh khoảng cách giữa các phần tử
                            width: "200px"
                        }}
                        className="form-select"
                        onChange={handleChangeStatus}
                    >
                        <option value={""}>Bộ lọc</option>
                        <option value={"1"}>Đang hoạt động</option>
                        <option value={"0"}>Không hoạt động</option>
                    </select>
                </div>

                {/* Thêm nhân viên */}
                <div>
                    <button type="button" className="btn btn-gradient-primary btn-icon-text" onClick={handleAdd}>
                        Thêm nhân viên
                    </button>
                </div>
            </div>

            <div className="col-lg-15 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h2 style={{ textAlign: "center" }}>Danh sách nhân viên</h2>
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
                                                <th>Ngày sinh</th>
                                                <th>Trạng thái</th>
                                                <th>Chỉnh sửa</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                employees.map((employee, index) => (
                                                    <tr key={employee.id}>
                                                        <td>{index + 1}</td>
                                                        <td>{employee.employeeCode}</td>
                                                        <td>{employee.fullName}</td>
                                                        <td>{employee.gender ? "Nam" : "Nữ"}</td>
                                                        <td>{employee.birthDate}</td>
                                                        <td>{employee.status ? "Đang hoạt động" : "Không hoạt động"}</td>
                                                        <td>
                                                            <Button variant="link"
                                                                onClick={() => handleUpdateEmployee(employee.id)}
                                                            // onClick={() => handleShow(employee)}
                                                            >
                                                                <i className='mdi mdi-border-color'></i>
                                                            </Button>
                                                            <i type="button" onClick={() => handleRemove(employee.id)} className="mdi mdi-delete-forever"></i>
                                                        </td>
                                                    </tr>))
                                            }
                                        </tbody>
                                    </table>
                                </div>
                                <div style={{ marginTop: "10px" }}>
                                    <label onClick={() => handleTruoc()}><i className='mdi mdi-arrow-left-bold'></i></label>
                                    <label>Trang: {page}/{totalPage}</label>
                                    <label onClick={() => handleSau()}><i className='mdi mdi-arrow-right-bold'></i></label>
                                </div>


                                <Modal show={showModal} onHide={handleClose} size='lg'>
                                    <Modal.Header closeButton>
                                        <Modal.Title>Thông tin nhân viên</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {/* Nội dung của Modal */}
                                        <form >
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: "50%" }}>
                                                    {/* <div>
                                                    <div>
                                                        <label htmlFor="employeeCodeInput" className="form-label">
                                                            Mã nhân viên
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
                                                            id="employeeCodeInput" // Thay đổi id
                                                            value={detail.employeeCode}
                                                            onChange={(e) => {
                                                                setDetail({ ...detail, employeeCode: e.target.value });
                                                            }}
                                                        />
                                                    </div>
                                                </div> */}

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="fullNameInput" className="form-label">
                                                                Tên nhân viên
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

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="usernameInput" className="form-label">
                                                                Username
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
                                                                type="text" // Use "text" for username
                                                                className="form-control"
                                                                id="usernameInput" // Change id to usernameInput
                                                                value={detail.username} // Change value to detail.username
                                                                onChange={(e) => {
                                                                    setDetail({ ...detail, username: e.target.value }); // Change to update username
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

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
                                                                id="createdAtInput" // Thay đổi id
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
                                                                <option>Vai trò</option>
                                                                {roles.map((role) => (
                                                                    <option key={role.id} value={role.id} selected={role.id === detail.roleId}>
                                                                        {role.roleName}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="statusInput" className="form-label">
                                                                Trạng thái
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
                                                                id="statusInput"
                                                                value={detail.status}
                                                                onChange={(e) => {
                                                                    setDetail({ ...detail, status: e.target.value });
                                                                }}
                                                            >
                                                                <option value={1} selected={detail.status === 1}>Đang hoạt động</option>
                                                                <option value={0} selected={detail.status === 1}>Không hoạt động</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <div style={{ display: "flex" }}>
                                            <div>
                                                <Button variant="primary" type="submit" onClick={() => handleUpdate(detail.id, detail)}>
                                                    Lưu thay đổi
                                                </Button>
                                            </div>
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
                                        <Modal.Title>Thêm nhân viên</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        {/* Nội dung của Modal */}
                                        <form>
                                            <div style={{ display: 'flex' }}>
                                                <div style={{ width: "50%" }}>
                                                    <div>
                                                        <div>
                                                            <label htmlFor="employeeCodeInput" className="form-label">
                                                                Mã nhân viên
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
                                                                id="employeeCodeInput" // Thay đổi id
                                                                value={newEmployee.employeeCode}
                                                                onChange={(e) => {
                                                                    setNewEmployee({ ...newEmployee, employeeCode: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="fullNameInput" className="form-label">
                                                                Tên nhân viên
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
                                                                value={newEmployee.fullName}
                                                                onChange={(e) => {
                                                                    setNewEmployee({ ...newEmployee, fullName: e.target.value });
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
                                                        <div className='container' style={{ display: "flex", marginBottom: "10px", fontSize: "20px" }}>
                                                            <div>
                                                                <input type="radio" className="form-check-input" name="gender" id="male"
                                                                    value="Nam"
                                                                    checked={newEmployee.gender === "Nam"}
                                                                    onChange={(e) => {
                                                                        setNewEmployee({ ...newEmployee, gender: e.target.value });
                                                                    }}
                                                                />
                                                                <label htmlFor="male" className="form-check-label">Nam</label>
                                                            </div>

                                                            <div style={{ marginLeft: "50px" }} >
                                                                <input type="radio" className="form-check-input" name="gender" id="female"
                                                                    value="Nữ"
                                                                    checked={newEmployee.gender === "Nữ"}
                                                                    onChange={(e) => {
                                                                        setNewEmployee({ ...newEmployee, gender: e.target.value });
                                                                    }}

                                                                />
                                                                <label htmlFor="female" className="form-check-label">Nữ</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
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
                                                                value={newEmployee.birthDate}
                                                                onChange={(e) => {
                                                                    // setNewEmployee({ ...newEmployee, birthDate: e.target.value });
                                                                    const selectedDate = new Date(e.target.value);
                                                                    const currentYear = 2025;
                                                                    const minBirthYear = currentYear - 18;

                                                                    const selectedYear = selectedDate.getFullYear();

                                                                    if (selectedYear <= minBirthYear) {
                                                                        setNewEmployee({ ...newEmployee, birthDate: e.target.value });
                                                                        setBirthDateError(""); // Xóa thông báo lỗi nếu hợp lệ
                                                                    } else {
                                                                        setBirthDateError("Tuổi phải từ 18 trở lên."); // Hiển thị thông báo lỗi
                                                                        setNewEmployee({ ...newEmployee, birthDate: "" });
                                                                    }
                                                                }}
                                                            />
                                                            {birthDateError && (
                                                                <div style={{ color: "red", marginTop: "5px" }}>{birthDateError}</div>
                                                            )}
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
                                                                value={newEmployee.phone}
                                                                onChange={(e) => {
                                                                    setNewEmployee({ ...newEmployee, phone: e.target.value });
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
                                                            <textarea
                                                                style={{
                                                                    border: '1px solid black',
                                                                    padding: '8px',
                                                                    borderRadius: '4px',
                                                                    fontSize: '16px', width: "100%"
                                                                }}
                                                                className="form-control"
                                                                id="addressInput"
                                                                value={newEmployee.address}
                                                                onChange={(e) => {
                                                                    setNewEmployee({ ...newEmployee, address: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ width: "50%", marginLeft: "50px" }}>

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
                                                                value={newEmployee.email}
                                                                onChange={(e) => {
                                                                    setNewEmployee({ ...newEmployee, email: e.target.value });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>

                                                    <div style={{ marginTop: "10px" }}>
                                                        <div>
                                                            <label htmlFor="usernameInput" className="form-label">
                                                                Username
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
                                                                type="text" // Use "text" for username
                                                                className="form-control"
                                                                id="usernameInput" // Change id to usernameInput
                                                                value={newEmployee.username} // Change value to detail.username
                                                                onChange={(e) => {
                                                                    setNewEmployee({ ...newEmployee, username: e.target.value }); // Change to update username
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
                                                                value={newEmployee.password} // Change value to detail.username

                                                                onChange={(e) => {
                                                                    setNewEmployee({ ...newEmployee, password: e.target.value }); // Change to update username
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
                                                                    setNewEmployee({ ...newEmployee, roleId: e.target.value });
                                                                }}
                                                            >
                                                                <option>Vai trò</option>
                                                                {roles.map((role) => (
                                                                    <option key={role.id} value={role.id} selected={role.id === newEmployee.roleId}>
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
                                            <div>
                                                <Button variant="success" type="submit" onClick={() => handleAddEmployee()}>
                                                    Thêm nhân viên
                                                </Button>
                                            </div>
                                            <div>
                                                <Button variant="success" onClick={handleCloseAdd}>
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

export default Employees
