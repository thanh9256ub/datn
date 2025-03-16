
import React, { useState, useEffect } from 'react'
import { Button, Modal, Col, InputGroup, Container, Form } from "react-bootstrap";
import { addEmployee, getEmployee, listEmployee, listRole, updateEmployee } from '../service/EmployeeService';
import { useParams, useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Select from 'react-select';



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

    const handleUpdate = (id, employee) => {
        if (window.confirm('Bạn có chắc chắn muốn cập nhật thông tin nhân viên này?')) {
            updateEmployee(id, employee).then(data => {
                getAllEmployee();
                history.push('/admin/employees');
            });
        }
    };

    function getAllEmployee() {
        listEmployee(page).then((response) => {
            if (response.status === 200) {
                setEmployees(response.data.data);
                setTotalPage(response.data.totalPage);
            }
            else if (response.status === 401) {
                history.push('/admin/user-pages/login-1');
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
                                                    {newEmployee.image ? (
                                                        <img
                                                            src={newEmployee.image}
                                                            alt="Employee"
                                                            style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div style={{ width: '150px', height: '150px', border: '1px dashed gray', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                                            Chọn ảnh
                                                        </div>
                                                    )}
                                                </label>
                                                <Form.Control type="file" id="imageUpload" accept="image/*" hidden />
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
                                        </Form.Group>

                                        <Form.Group>
                                            <label className="form-label">Username</label>
                                            <Form.Control type="text" value={detail.username} // Change value to detail.username
                                                onChange={(e) => {
                                                    setDetail({ ...detail, username: e.target.value }); // Change to update username
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
                                                        checked={detail.gender === 'Nam'}
                                                        onChange={(e) => setDetail({ ...detail, gender: e.target.value })}
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
                                                        checked={detail.gender === 'Nữ'}
                                                        onChange={(e) => setDetail({ ...detail, gender: e.target.value })}
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
                                            />
                                        </Form.Group>
                                    </div>
                                </div>
                                <hr></hr>
                                {/* Nút Thêm nhân viên */}
                                <div className="text-end mt-4">
                                    <button type="button" className="btn btn-primary" onClick={() => handleUpdate(detail.id, detail)}>
                                        Lưu
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