import React, { useState, useEffect } from 'react'
import { Button, Modal } from "react-bootstrap";
import { listEmployee } from './service/EmployeeService';


const Employees = () => {

    const [employees, setEmployees] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [detail, setDetail] = useState({});
    // Hàm mở Modal
    const handleShow = (employee) => {
        setShowModal(true);
        setDetail(employee);
    };

    // Hàm đóng Modal
    const handleClose = () => setShowModal(false);

    useEffect(async () => {
        // getAllEmployees()
        let req = await listEmployee();

        setEmployees(req.data.data);

    }, [])

    // function getAllEmployees(){
    //     listEmployee.then((response) => {
    //         setEmployees(response.);
    //     }).catch(error => {
    //         console.error(error);
    //     })
    // }

    return (
        <div>
            <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Danh sách nhân viên</h4>
                        {/* <p className="card-description"> Add className <code>.table-hover</code>
                        </p> */}
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Mã</th>
                                        <th>Họ tên</th>
                                        <th>Giới tính</th>
                                        <th>Ngày sinh</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        employees.map((employee) => (
                                            <tr key={employee.id}>
                                                <td>{employee.employeeCode}</td>
                                                <td>{employee.fullName}</td>
                                                <td>{employee.gender}</td>
                                                <td>{employee.birthDate}</td>
                                                <td>
                                                    <Button variant="link" onClick={() => handleShow(employee)}>
                                                    <i className='mdi mdi-border-color'></i>
                                                    </Button>
                                                </td>
                                            </tr>))
                                    }
                                </tbody>
                            </table>


                            <Modal show={showModal} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>Nhan vien</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {/* Nội dung của Modal */}
                                    <form>
                                        <div className="mb-3">
                                            <label htmlFor="editInput" className="form-label">
                                                Ma nhan vien
                                            </label>
                                            <input type="text" className="form-control" id="editInput" 
                                            // value={detail.employeeCode}
                                            />
                                            

                                        </div>
                                        <Button variant="primary" type="submit">
                                            Lưu thay đổi
                                        </Button>
                                    </form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Đóng
                                    </Button>
                                </Modal.Footer>
                            </Modal>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Employees