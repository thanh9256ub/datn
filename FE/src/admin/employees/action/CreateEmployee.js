import React, { useState, useEffect } from 'react'
import { Button, Modal, Col, InputGroup, Container, Form, Row } from "react-bootstrap";
import { addEmployee, listEmployee, listRole, uploadImageToCloudinary } from '../service/EmployeeService';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Select from 'react-select';
import { Spinner } from 'react-bootstrap';
import "./CreateEmployee.css";


const CreateEmployee = () => {

    const [employees, setEmployees] = useState([]);

    const [newEmployee, setNewEmployee] = useState({ birthDate: '' });

    const [birthDateError, setBirthDateError] = useState('');

    const [showPassword, setShowPassword] = useState(false); // Thêm state để theo dõi trạng thái hiển thị mật khẩu

    const [roles, setRoles] = useState([]);

    const [page, setPage] = useState(1);

    const [totalPage, setTotalPage] = useState(999);

    const history = useHistory();

    const [loading, setLoading] = useState(false);

    const [fullNameError, setFullNameError] = useState('');

    const [addressError, setAddressError] = useState('');

    const [usernameError, setUsernameError] = useState('');

    const [emailError, setEmailError] = useState('');

    const [phoneError, setPhoneError] = useState('');

    const [roleIdError, setRoleIdError] = useState('');

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

        setFullNameError('');

        setAddressError('');

        setUsernameError('');

        setEmailError('');

        setPhoneError('');

        setRoleIdError('');

        setBirthDateError('');

        let isValid = true;

        if (!newEmployee.fullName) {
            setFullNameError('Vui lòng nhập tên nhân viên.');
            isValid = false;
        }

        if (!newEmployee.address) {
            setAddressError('Vui lòng nhập địa chỉ.');
            isValid = false;
        }

        if (!newEmployee.username) {
            setUsernameError('Vui lòng nhập username.');
            isValid = false;
        }

        if (!newEmployee.email) {
            setEmailError('Vui lòng nhập email.');
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(newEmployee.email)) {
            setEmailError('Email không hợp lệ.');
            isValid = false;
        }

        if (!newEmployee.phone) {
            setPhoneError('Vui lòng nhập số điện thoại.');
            isValid = false;
        } else if (!/^\d{10}$/.test(newEmployee.phone)) {
            setPhoneError('Số điện thoại không hợp lệ (10 chữ số).');
            isValid = false;
        }

        if (!newEmployee.roleId) {
            setRoleIdError('Vui lòng chọn vai trò.');
            isValid = false;
        }

        if (!newEmployee.birthDate) {
            setBirthDateError('Vui lòng chọn ngày sinh.');
            isValid = false;
        } else {
            const selectedDate = new Date(newEmployee.birthDate);
            const currentYear = new Date().getFullYear(); // Sử dụng năm hiện tại
            const minBirthYear = currentYear - 18;

            const selectedYear = selectedDate.getFullYear();

            if (selectedYear > minBirthYear) {
                setBirthDateError("Tuổi phải từ 18 trở lên.");
                isValid = false;
            }
        }

        if (!isValid) {
            return;
        }



        setLoading(true);

        try {
            let image = "";
            if (newEmployee.image) {
                const imageUrl = await uploadImageToCloudinary(newEmployee.image);
                if (imageUrl) {
                    setNewEmployee({ ...newEmployee, image: imageUrl });
                    image = imageUrl;
                } else {
                    // Handle error when uploading image
                    return;
                }
            }

            // Gọi API để thêm nhân viên
            await addEmployee({ ...newEmployee, image: image });

            // Sau khi thêm nhân viên, lấy lại danh sách nhân viên mới
            const response = await listEmployee(1);

            // Cập nhật danh sách nhân viên và tổng số trang
            setEmployees(response.data.data);
            setTotalPage(response.data.totalPage);



            localStorage.setItem("successMessage", "Thêm nhân viên thành công!");
            // Chuyển hướng đến trang quản lý nhân viên
        } catch (error) {
            console.error('Lỗi khi thêm nhân viên:', error);
            alert('Có lỗi xảy ra khi thêm nhân viên. Vui lòng thử lại!');
        } finally {
            setLoading(false);
        }
        history.push('/admin/employees'); 
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword); // Hàm để thay đổi trạng thái hiển thị mật khẩu
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
                            <h3 style={{ textAlign: "center" }}>Thêm nhân viên</h3>
                            <hr />
                            <form className="form-sample">
                                <div className="row g-4"> {/* g-4 tạo khoảng cách đều giữa các cột */}
                                    {/* Cột 1 */}
                                    <div className="col-md-4 col-12">
                                        <Form.Group className="text-center mb-3">
                                            <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                                                {newEmployee.image ? (
                                                    <img
                                                        src={typeof newEmployee.image === 'string' ? newEmployee.image : URL.createObjectURL(newEmployee.image)}
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
                                            <Form.Control type="file" id="imageUpload" accept="image/*" hidden onChange={(e) => setNewEmployee({ ...newEmployee, image: e.target.files[0] })} />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <label className="form-label">Tên nhân viên</label>
                                            <Form.Control type="text"

                                                id="fullNameInput" // Thay đổi id 
                                                value={newEmployee.fullName}
                                                onChange={(e) => {
                                                    setNewEmployee({ ...newEmployee, fullName: e.target.value });
                                                }} />
                                            {fullNameError && <div style={{ color: "red" }}>{fullNameError}</div>}
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <label className="form-label">Địa chỉ</label>
                                            <Form.Control as="textarea"
                                                id="addressInput"
                                                value={newEmployee.address}
                                                onChange={(e) => {
                                                    setNewEmployee({ ...newEmployee, address: e.target.value });
                                                }} />
                                            {addressError && <div style={{ color: "red" }}>{addressError}</div>}
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
                                            {usernameError && <div style={{ color: "red" }}>{usernameError}</div>}
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
                                                        value="1"
                                                        checked={newEmployee.gender === 1}
                                                        onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value ? 1 : 0 })} //
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
                                                        checked={newEmployee.gender === 0}
                                                        onChange={(e) => setNewEmployee({ ...newEmployee, gender: e.target.value ? 0 : 1 })}
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
                                            {emailError && <div style={{ color: "red" }}>{emailError}</div>}
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
                                                <div style={{ color: "red" }}>{birthDateError}</div>
                                            )}
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <label className="form-label">Số điện thoại</label>
                                            <Form.Control type="tel" id="phoneInput"
                                                value={newEmployee.phone}
                                                onChange={(e) => {
                                                    setNewEmployee({ ...newEmployee, phone: e.target.value });
                                                }} />
                                            {phoneError && <div style={{ color: "red" }}>{phoneError}</div>}
                                        </Form.Group>

                                        <Form.Group className="mb-3" style={{ marginTop: "20px" }}>
                                            <label className="form-label">Vai trò</label>
                                            <Select
                                                options={roles.map(role => ({ value: role.id, label: role.roleName })).filter(role => role.value !== 1)}
                                                value={roles.find(role => role.id === newEmployee.roleId) ? { value: newEmployee.roleId, label: roles.find(role => role.id === newEmployee.roleId).roleName } : null}
                                                onChange={(selectedOption) => setNewEmployee({ ...newEmployee, roleId: selectedOption.value })}
                                            />
                                            {roleIdError && <div style={{ color: "red" }}>{roleIdError}</div>}
                                        </Form.Group>
                                    </div>
                                </div>
                                <hr></hr>
                                {/* Nút Thêm nhân viên */}
                                <div className="d-flex justify-content-end mt-4">
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
