import React, { useState, useEffect } from 'react'
import { Button, Modal, Col, InputGroup, Container, Form, Row } from "react-bootstrap";
import { addEmployee, listEmployee, listRole } from '../service/EmployeeService';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';



const CreateEmployee = () => {


    const [employees, setEmployees] = useState([]);

    const [newEmployee, setNewEmployee] = useState({ birthDate: '' });

    const [birthDateError, setBirthDateError] = useState('');

    const [showPassword, setShowPassword] = useState(false); // Thêm state để theo dõi trạng thái hiển thị mật khẩu

    const [roles, setRoles] = useState([]);

    const [page, setPage] = useState(1);

    const [totalPage, setTotalPage] = useState(999);

    const history = useHistory();

    useEffect(async () => {
        // getAllROle()
        let req = await listRole();
        setRoles(req.data.data);
    }, [])




    // const handleAddEmployee = () => {
    //     setNewEmployee({ ...newEmployee })
    //     if (window.confirm('Bạn có chắc chắn muốn thêm nhân viên?')) {
    //         addEmployee(newEmployee).then(data => {
    //             listEmployee(1).then((response) => {
    //                 setEmployees(response.data.data);
    //                 setTotalPage(response.data.totalPage);
    //                 history.push('/admin/employees')
    //             }).catch(error => {
    //                 console.error(error);
    //             })
    //         });

    //     };
    // }

    const handleAddEmployee = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn thêm nhân viên?')) return;

        try {
            // Gọi API để thêm nhân viên
            await addEmployee(newEmployee);

            // Sau khi thêm nhân viên, lấy lại danh sách nhân viên mới
            const response = await listEmployee(1);

            // Cập nhật danh sách nhân viên và tổng số trang
            setEmployees(response.data.data);
            setTotalPage(response.data.totalPage);

            localStorage.setItem("successMessage", "Sản phẩm đã được thêm thành công!");
            // Chuyển hướng đến trang quản lý nhân viên
            history.push('/admin/employees');
        } catch (error) {
            console.error('Lỗi khi thêm nhân viên:', error);
            alert('Có lỗi xảy ra khi thêm nhân viên. Vui lòng thử lại!');
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword); // Hàm để thay đổi trạng thái hiển thị mật khẩu
    };

    return (
        <div>
            <div className="col-lg-15 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body"></div>
                    <h2 style={{ textAlign: "center" }}>Thêm nhân viên</h2>
                    <hr></hr>
                    <form>
                        <div style={{ display: "flex" }}>
                            <div style={{ width: "30%" }}>
                                <div>
                                    <label htmlFor="imageUpload" style={{ cursor: 'pointer', marginBottom: '10px' }}>
                                        {"" ? (
                                            <img alt="Employee" style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />
                                        ) : (
                                            <div style={{ width: '150px', height: '150px', border: '1px dashed gray', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                Chọn ảnh
                                            </div>
                                        )}
                                    </label>
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        accept="image/*"
                                    // onChange={handleImageChange}
                                    // style={{ display: 'none' }}
                                    />
                                </div>
                            </div>
                            <div style={{ display: 'flex', width: "100%" }}>
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
                                                    fontSize: '16px', width: "90%"
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
                                                    fontSize: '16px', width: "90%"
                                                }}
                                                type="text"
                                                className="form-control"
                                                id="fullNameInput"
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
                                                <input type="radio" className="form-check-input" name="gender" id="male" value="Nam"
                                                    checked={newEmployee.gender === "Nam"}
                                                    onChange={(e) => {
                                                        setNewEmployee({ ...newEmployee, gender: e.target.value });
                                                    }}

                                                />
                                                <label htmlFor="male" className="form-check-label">Nam</label>
                                            </div>
                                            <div style={{ marginLeft: "50px" }} >
                                                <input type="radio" className="form-check-input" name="gender" id="female" value="Nữ"
                                                    checked={newEmployee.gender === "Nữ"}
                                                    onChange={(e) => {
                                                        setNewEmployee({ ...newEmployee, gender: e.target.value });
                                                    }}


                                                />
                                                <label htmlFor="female" className="form-check-label">Nữ</label>
                                            </div>
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
                                                    border: '1px solid black', padding: '8px',
                                                    borderRadius: '4px', fontSize: '16px', width: "90%"
                                                }}
                                                type="email"
                                                className="form-control"
                                                id="emailInput"
                                                value={newEmployee.email}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
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
                                                    border: '1px solid black', padding: '8px',
                                                    borderRadius: '4px', fontSize: '16px', width: "90%"
                                                }}
                                                type="text"
                                                className="form-control"
                                                id="usernameInput"
                                                value={newEmployee.username}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div style={{ width: "50%" }}>
                                    <div style={{}}>
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
                                                    fontSize: '16px', width: "90%"
                                                }}
                                                type={showPassword ? 'text' : 'password'} // Use "text" for password
                                                className="form-control"
                                                id="passwordInput" // Change id to passwordInput
                                                value={newEmployee.password} // Change value to detail.username

                                                onChange={(e) => {
                                                    setNewEmployee({ ...newEmployee, password: e.target.value }); // Change to update username
                                                }}
                                            />
                                            {/* <i
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
                                                        </i> */}

                                        </div>
                                    </div>
                                    <div style={{ marginTop: "10px" }} >
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
                                                    borderRadius: '4px', fontSize: '16px', width: "90%"
                                                }}
                                                type="date"
                                                className="form-control"
                                                id="birthDateInput"
                                                value={newEmployee.birthDate}
                                                onChange={(e) => {
                                                    const selectedDate = new Date(e.target.value);
                                                    const currentYear = 2025;
                                                    const minBirthYear = currentYear - 18;
                                                    const selectedYear = selectedDate.getFullYear();
                                                    if (selectedYear <= minBirthYear) {
                                                        setNewEmployee({ ...newEmployee, birthDate: e.target.value });
                                                        setBirthDateError("");
                                                    } else {
                                                        setBirthDateError("Tuổi phải từ 18 trở lên.");
                                                        setNewEmployee({ ...newEmployee, birthDate: "" });
                                                    }
                                                }}
                                            />
                                            {birthDateError && (<div style={{ color: "red", marginTop: "5px" }}>{birthDateError}</div>)}
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
                                                    border: '1px solid black', padding: '8px',
                                                    borderRadius: '4px', fontSize: '16px', width: "90%"
                                                }}
                                                type="tel"
                                                className="form-control"
                                                id="phoneInput"
                                                value={newEmployee.phone}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
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
                                                    fontSize: '16px', width: "90%"
                                                }}
                                                className="form-select"
                                                id="roleIdInput"
                                                onChange={(e) => {
                                                    setNewEmployee({ ...newEmployee, roleId: e.target.value });
                                                }}
                                            >
                                                {roles.map((role) => (
                                                    <option key={role.id} value={role.id} selected={role.id === newEmployee.roleId}>
                                                        {role.roleName}
                                                    </option>
                                                ))}
                                            </select>
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
                                                    border: '1px solid black', padding: '8px',
                                                    borderRadius: '4px', fontSize: '16px', width: "90%"
                                                }}
                                                className="form-control"
                                                id="addressInput"
                                                value={newEmployee.address}
                                                onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ marginTop: '20px', marginLeft: "80%" }}>
                            <button type="button" className="btn btn-primary" onClick={() => handleAddEmployee()} >
                                Thêm nhân viên
                            </button>
                        </div>
                    </form >
                </div >
            </div >
        </div >

    )

}

export default CreateEmployee