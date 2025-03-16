import React, { useState, useEffect } from 'react'
import { Button, Modal, Col, InputGroup, Container, Form, Row } from "react-bootstrap";
import { addEmployee, listEmployee, listRole } from '../service/EmployeeService';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Select from 'react-select';



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
            <div className="row">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h3 style={{ textAlign: "center" }}>Thêm nhân viên</h3>
                            <hr />
                            <form className="form-sample">
                                <div className="row g-4"> {/* g-4 tạo khoảng cách đều giữa các cột */}
                                    {/* Cột 1 */}
                                    <div className="col-md-4 col-12">
                                        <Form.Group className="text-center mb-3">
                                            <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                                                {"" ? (
                                                    <img
                                                        // src={newEmployee.image}
                                                        alt="Employee"
                                                        style={{
                                                            width: '150px',
                                                            height: '150px',
                                                            borderRadius: '50%',
                                                            objectFit: 'cover',
                                                            border: '1px solid #ddd'
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '150px',
                                                            height: '150px',
                                                            border: '1px dashed gray',
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center'
                                                        }}
                                                    >
                                                        Chọn ảnh
                                                    </div>
                                                )}
                                            </label>
                                            <Form.Control type="file" id="imageUpload" accept="image/*" hidden />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <label className="form-label">Tên nhân viên</label>
                                            <Form.Control type="text"

                                                id="fullNameInput" // Thay đổi id 
                                                value={newEmployee.fullName}
                                                onChange={(e) => {
                                                    setNewEmployee({ ...newEmployee, fullName: e.target.value });
                                                }} />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <label className="form-label">Địa chỉ</label>
                                            <Form.Control as="textarea"
                                                id="addressInput"
                                                value={newEmployee.address}
                                                onChange={(e) => {
                                                    setNewEmployee({ ...newEmployee, address: e.target.value });
                                                }} />
                                        </Form.Group>
                                    </div>

                                    {/* Cột 2 */}
                                    <div className="col-md-4 col-12" style={{ marginTop: "15px" }}>
                                        <Form.Group className="mb-3">
                                            <label className="form-label">Username</label>
                                            <Form.Control type="text" // Use "text" for username

                                                id="usernameInput" // Change id to usernameInput
                                                value={newEmployee.username} // Change value to detail.username
                                                onChange={(e) => {
                                                    setNewEmployee({ ...newEmployee, username: e.target.value }); // Change to update username
                                                }} />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <label className="form-label">Giới tính</label>
                                            <div className="d-flex align-items-center">
                                                {/* Nam */}
                                                <div className="form-check me-4">
                                                    <Form.Check
                                                        type="radio"
                                                        label="Nam"
                                                        name="gender"
                                                        value="Nam"
                                                        checked={newEmployee.gender === 'Nam'}
                                                        onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value })}
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
                                                        value="Nữ"
                                                        checked={newEmployee.gender === 'Nữ'}
                                                        onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value })}
                                                        id="genderNu"
                                                        custom
                                                    />
                                                </div>
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <label className="form-label">Email</label>
                                            <Form.Control type="email"
                                                id="emailInput"
                                                value={newEmployee.email}
                                                onChange={(e) => {
                                                    setNewEmployee({ ...newEmployee, email: e.target.value });
                                                }} />
                                        </Form.Group>


                                    </div>

                                    {/* Cột 3 */}
                                    <div className="col-md-4 col-12" style={{ marginTop: "15px" }}>
                                        <Form.Group className="mb-3">
                                            <label className="form-label">Ngày sinh</label>
                                            <Form.Control type="date" id="birthDateInput"
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
                                                }} />
                                            {birthDateError && (
                                                <div style={{ color: "red", marginTop: "5px" }}>{birthDateError}</div>
                                            )}
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <label className="form-label">Số điện thoại</label>
                                            <Form.Control type="tel" id="phoneInput"
                                                value={newEmployee.phone}
                                                onChange={(e) => {
                                                    setNewEmployee({ ...newEmployee, phone: e.target.value });
                                                }} />
                                        </Form.Group>

                                        <Form.Group className="mb-3" style={{ marginTop: "20px" }}>
                                            <label className="form-label">Vai trò</label>
                                            <Select
                                                options={roles.map(role => ({ value: role.id, label: role.roleName })).filter(role => role.value !== 1)}
                                                value={roles.find(role => role.id === newEmployee.roleId) ? { value: newEmployee.roleId, label: roles.find(role => role.id === newEmployee.roleId).roleName } : null}
                                                onChange={(selectedOption) => setNewEmployee({ ...newEmployee, roleId: selectedOption.value })}
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <hr></hr>
                                {/* Nút Thêm nhân viên */}
                                <div className="text-end mt-4">
                                    <button type="button" className="btn btn-gradient-primary btn-icon-text" onClick={() => handleAddEmployee()}>
                                        Thêm nhân viên
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div >

    )

}

export default CreateEmployee