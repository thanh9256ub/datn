
import React, { useState, useEffect } from 'react'
import { Form } from "react-bootstrap";
import { existsEmail, getEmployee, listEmployee, listRole, updateEmployee, uploadImageToCloudinary } from '../service/EmployeeService';
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Select from 'react-select';
import { Spinner } from 'react-bootstrap';
import "./CreateEmployee.css";


const UpdateEmployee = () => {

    const { id } = useParams();

    const [employees, setEmployees] = useState([]);

    const [newEmployee, setNewEmployee] = useState({ birthDate: '' });

    const [showPassword, setShowPassword] = useState(false); // Thêm state để theo dõi trạng thái hiển thị mật khẩu

    const [roleOptions, setRoleOptions] = useState([]);

    const [page, setPage] = useState(1);

    const [totalPage, setTotalPage] = useState(999);

    const history = useHistory();

    const [detail, setDetail] = useState({});

    const [birthDateError, setBirthDateError] = useState('');

    const [loading, setLoading] = useState(false);

    const [fullNameError, setFullNameError] = useState('');

    const [addressError, setAddressError] = useState('');

    const [usernameError, setUsernameError] = useState('');

    const [emailError, setEmailError] = useState('');

    const [phoneError, setPhoneError] = useState('');

    const [roleIdError, setRoleIdError] = useState('');


    useEffect(() => {
        const fetchEmployee = async () => {
            try {


                const response = await getEmployee(id);
                console.log(response.data);
                setDetail(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };
        fetchEmployee();
    }, [id]);




    const handleUpdate = async (id, employee) => {
        if (window.confirm('Bạn có chắc chắn muốn cập nhật thông tin nhân viên này?')) {

            setFullNameError('');

            setAddressError('');

            setUsernameError('');

            setEmailError('');

            setPhoneError('');

            setRoleIdError('');

            setBirthDateError('');

            let isValid = true;

            const nameRegex = /^[a-zA-Z ]*$/;


            if (!detail.fullName) {
                setFullNameError('Vui lòng nhập tên nhân viên.');
                isValid = false;
            } else if (detail.fullName.length < 2) {
                setFullNameError('Tên nhân viên phải có ít nhất 2 ký tự.');
                isValid = false;
            } else if (detail.fullName.length > 100) {
                setFullNameError('Tên nhân viên không được vượt quá 100 ký tự.');
                isValid = false;
            }
            else if (!/^[\p{L} ]+$/u.test(detail.fullName)) {
                setFullNameError('Tên nhân viên không hợp lệ.');
                isValid = false;
            }


            if (!detail.address) {
                setAddressError('Vui lòng nhập địa chỉ.');
                isValid = false;
            }
            else if (detail.address.length < 2) {
                setAddressError('Địa chỉ phải có ít nhất 2 ký tự.');
                isValid = false;
            }
            else if (detail.address.length > 250) {
                setAddressError('Địa chỉ không được vượt quá 250 ký tự.');
                isValid = false;
            }

            if (!detail.username) {
                setUsernameError('Vui lòng nhập username.');
                isValid = false;
            }

            else if (detail.username.length < 3) {
                setUsernameError('Username phải có ít nhất 3 ký tự.');
                isValid = false;
            }
            else if (detail.username.length > 50) {
                setUsernameError('Username không được vượt quá 50 ký tự.');
                isValid = false;
            }

            else if (detail.username.includes(" ")) {
                setUsernameError('Username không được chứa khoảng trắng.');
                isValid = false;
            }

            if (!detail.email) {
                setEmailError('Vui lòng nhập email.');
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(detail.email)) {
                setEmailError('Email không hợp lệ.');
                isValid = false;
            }
            else if (detail.email.length > 100) {
                setEmailError('Email không được vượt quá 100 ký tự.');
                isValid = false;
            }
            else if (detail.email.length < 5) {
                setEmailError('Email phải có ít nhất 5 ký tự.');
                isValid = false;
            }
            else if (detail.email.includes(" ")) {
                setEmailError('Email không được chứa khoảng trắng.');
                isValid = false;
            }


            if (!detail.phone) {
                setPhoneError('Vui lòng nhập số điện thoại.');
                isValid = false;
            } else if (!/^\d{10}$/.test(detail.phone)) {
                setPhoneError('Số điện thoại không hợp lệ (10 chữ số).');
                isValid = false;
            } else if (!/^0\d{9}$/.test(detail.phone)) {
                setPhoneError('Số điện thoại phải bắt đầu bằng số 0 và có tổng cộng 10 chữ số.');
                isValid = false;
            }


            if (!detail.roleId) {
                setRoleIdError('Vui lòng chọn vai trò.');
                isValid = false;
            }

            if (!detail.birthDate) {
                setBirthDateError('Vui lòng chọn ngày sinh.');
                isValid = false;
            } else {
                const selectedDate = new Date(detail.birthDate);
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
                let image = "" || null;
                if (detail.image) {
                    const imageUrl = await uploadImageToCloudinary(detail.image);
                    if (imageUrl) {
                        setDetail({ ...detail, image: imageUrl });
                        image = imageUrl;
                    } else {
                        // Handle error when uploading image
                        return;
                    }
                }

                await updateEmployee(id, { ...employee, image }); // Ensure you wait for the update to finish
                getAllEmployee();
                localStorage.setItem("successMessage", "Cập nhật nhân viên thành công!");
                history.push('/admin/employees');
            } catch (error) {
                console.error('Error updating employee:', error);
            } finally {
                setLoading(false); // Set loading to false after the update completes
            }
        }
    };

    function getAllEmployee() {
        listEmployee(page).then((response) => {
            if (response.status === 200) {
                setEmployees(response.data.data);
                setTotalPage(response.data.totalPage);
            }
            else if (response.status === 401) {
                history.push('/login-nhan-vien');
            }
        }).catch(error => {
            console.error(error);
        })
    }

    useEffect(async () => {
        // getAllROle()
        let req = await listRole();
        setRoleOptions(req.data?.data?.
            map(role => ({ value: role.id, label: role.roleName })).
            filter(option => option.value !== 1));
    }, [])



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
                            <h2 style={{ textAlign: "center" }}>Cập nhật nhân viên</h2>
                            <hr></hr>
                            <form className="form-sample">
                                <div className="row">
                                    {/* Cột 1 */}
                                    <div className="col-md-4">
                                        <div>
                                            <Form.Group className="text-center">
                                                <label htmlFor="imageUpload" style={{ cursor: 'pointer' }}>
                                                    {detail.image ? (
                                                        <img
                                                            src={typeof detail.image === 'string' ? detail.image : URL.createObjectURL(detail.image)}
                                                            alt="Employee"
                                                            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: '150px', height: '150px', border: '1px dashed gray', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            Chọn ảnh
                                                        </div>
                                                    )}
                                                </label>
                                                <Form.Control type="file" id="imageUpload" accept="image/*" hidden onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    setDetail({ ...detail, image: file }); // Cập nhật ảnh mới vào state detail
                                                }} />
                                            </Form.Group>

                                            <Form.Group>
                                                <label className="form-label">Mã nhân viên</label>
                                                <Form.Control type="text"
                                                    value={detail.employeeCode}
                                                    disabled={true}
                                                    onChange={(e) => {
                                                        setDetail({ ...detail, employeeCode: e.target.value });
                                                    }} />
                                            </Form.Group>

                                            <Form.Group>
                                                <label className="form-label">Tên nhân viên</label>
                                                <Form.Control type="text" value={detail.fullName}
                                                    onChange={(e) => {
                                                        setDetail({ ...detail, fullName: e.target.value });
                                                    }} />
                                                {fullNameError && <div style={{ color: "red" }}>{fullNameError}</div>}

                                            </Form.Group>

                                            <Form.Group>
                                                <label className="form-label">Ngày sinh</label>
                                                <Form.Control type="date"
                                                    disabled={true}
                                                    value={detail.birthDate}
                                                    onChange={(e) => {
                                                        setDetail({ ...detail, birthDate: e.target.value });
                                                    }} />
                                            </Form.Group>
                                        </div>
                                    </div>

                                    {/* Cột 2 */}
                                    <div className="col-md-4">


                                        <Form.Group>
                                            <label className="form-label">Email</label>
                                            <Form.Control type="email" value={detail.email}
                                                onChange={(e) => {
                                                    setDetail({ ...detail, email: e.target.value });
                                                }} />
                                            {emailError && <div style={{ color: "red" }}>{emailError}</div>}

                                        </Form.Group>

                                        <Form.Group>
                                            <label className="form-label">Username</label>
                                            <Form.Control type="text" value={detail.username} // Change value to detail.username
                                                onChange={(e) => {
                                                    setDetail({ ...detail, username: e.target.value }); // Change to update username
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
                                                        checked={detail.gender === 1}
                                                        onChange={(e) => setDetail({ ...detail, gender: e.target.value ? 1 : 0 })}
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
                                                        checked={detail.gender === 0}
                                                        onChange={(e) => setDetail({ ...detail, gender: e.target.value ? 0 : 1 })}
                                                        id="genderNu"
                                                        custom
                                                    />
                                                </div>
                                            </div>
                                        </Form.Group>
                                        <Form.Group>
                                            <label className="form-label">Địa chỉ</label>
                                            <Form.Control type="text" value={detail.address}
                                                onChange={(e) => {
                                                    setDetail({ ...detail, address: e.target.value });
                                                }} />
                                            {addressError && <div style={{ color: "red" }}>{addressError}</div>}

                                        </Form.Group>
                                        <Form.Group>
                                            <label className="form-label">Trạng thái</label>
                                            <Select
                                                options={[{ value: 1, label: "Đang hoạt động" }, { value: 0, label: "Không hoạt động" }]}
                                                value={{ value: detail.status, label: detail.status === 1 ? "Đang hoạt động" : "Không hoạt động" }}
                                                onChange={(selected) => setDetail({ ...detail, status: selected.value })}
                                            />
                                        </Form.Group>

                                    </div>

                                    {/* Cột 3 */}
                                    <div className="col-md-4">
                                        <Form.Group>
                                            <label className="form-label">Số điện thoại</label>
                                            <Form.Control type="tel" value={detail.phone}
                                                onChange={(e) => {
                                                    setDetail({ ...detail, phone: e.target.value });
                                                }} />
                                            {phoneError && <div style={{ color: "red" }}>{phoneError}</div>}

                                        </Form.Group>
                                        <Form.Group>
                                            <label className="form-label">Ngày tạo</label>
                                            <Form.Control type="date"
                                                id="createdAtInput" // Thay đổi id
                                                disabled={true}
                                                value={detail.createdAt}
                                            />
                                        </Form.Group>

                                        <Form.Group>
                                            <label className="form-label">Ngày cập nhật gần nhất</label>
                                            <Form.Control type="date"
                                                id="updatedAtInput" // Thay đổi id
                                                disabled={true}
                                                value={detail.updatedAt}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <label className="form-label">Vai trò</label>
                                            <Select
                                                options={roleOptions} // Lọc ra vai trò customer
                                                value={roleOptions.find(option => option.value === detail.roleId) || null}
                                                onChange={(selected) => setDetail({ ...detail, roleId: selected.value })}
                                                // không cho sửa vai trò admin
                                                isDisabled={detail.roleId === 3 || detail.roleId === 2} // Disable if roleId is 3 or 1
                                                
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <hr></hr>
                                <div className="d-flex justify-content-end mt-4">
                                    <button type="button" className="btn btn-primary" onClick={() => handleUpdate(detail.id, detail)}>
                                        Lưu thông tin
                                    </button>
                                </div>
                            </form>
                        </div >
                    </div >
                </div >
            </div >
        </div >
    )

}

export default UpdateEmployee
