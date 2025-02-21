import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { Pen, Trash } from "react-bootstrap-icons";



export default function BangNhanVien() {
    const [nhanVien, setNhanVien] = useState([
        { employee_code: "NV01", full_name: "Nguyen Van A", gender: "Nam", birth_date: "1998-09-08", phone: "0987654322", address: "Ha Noi", username: "nva123", status: "Dang hoat dong" },
        { employee_code: "NV02", full_name: "Nguyen Van B", gender: "Nam", birth_date: "2000-09-08", phone: "098765321", address: "Hai Phong", username: "nvb456", status: "Dang hoat dong" }

    ]);

    const [showModal, setShowModal] = useState(false);

    const [detail, setDetail] = useState({});
    // Hàm mở Modal
    const handleShow = (nv) => {
        setShowModal(true);
        setDetail(nv);
    };

    // Hàm đóng Modal
    const handleClose = () => setShowModal(false);


    const removeItem = (nv) => {
        setNhanVien(nhanVien.filter((_, i) => i !== nv));
    };

    return (
        <div className="border border-primary rounded p-3" style={{ marginLeft: "5px" }} >
            <h5>Nhan vien </h5>
            <hr />
            <div className="d-flex justify-content-between mb-3" >
                {/* <Button variant="light" disabled>Tìm kiếm</Button> */}
            </div>
            <Table bordered hover >
                <thead>
                    <tr>
                        <th>Ma nhan vien</th>
                        <th>Ten nhan vien</th>
                        <th>Gioi tinh</th>
                        <th>Ngay sinh</th>
                        <th>So dien thoai</th>
                        <th>Dia chi</th>
                        <th>Ten dang nhap</th>
                        <th>Trang thai</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {nhanVien.map((nv, index) => (
                        <tr key={index}>
                            <td>{nv.employee_code}</td>
                            <td>{nv.full_name}</td>
                            <td>{nv.gender}</td>
                            <td>{nv.birth_date}</td>
                            <td>{nv.phone}</td>
                            <td>{nv.address}</td>
                            <td>{nv.username}</td>
                            <td>{nv.status}</td>
                            <td>
                                <Button variant="link" onClick={() => handleShow(nv)}>
                                    <Pen size={20} />
                                </Button>
                            </td>
                            <td>
                                <Button variant="link" onClick={() => removeItem(index)}>
                                    <Trash size={20} />
                                </Button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </Table>
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
                            <input type="text" className="form-control" id="editInput" value={detail.employee_code} />
                            <label htmlFor="editInput" className="form-label">
                                Tên
                            </label>
                            <input type="text" className="form-control" id="editInput" value={detail.full_name} />
                            <label htmlFor="editInput" className="form-label">
                                Gioi tinh
                            </label>
                            <input type="text" className="form-control" id="editInput" value={detail.gender} />
                            <label htmlFor="editInput" className="form-label">
                                Ngay sinh
                            </label>
                            <input type="text" className="form-control" id="editInput" value={detail.birth_date} />
                            <label htmlFor="editInput" className="form-label">
                                So dien thoai
                            </label>
                            <input type="text" className="form-control" id="editInput" value={detail.phone} />
                            <label htmlFor="editInput" className="form-label">
                                Dia chi
                            </label>
                            <input type="text" className="form-control" id="editInput" value={detail.address} />
                            <label htmlFor="editInput" className="form-label">
                                Tên dang nhap
                            </label>
                            <input type="text" className="form-control" id="editInput" value={detail.username} />
                            <label htmlFor="editInput" className="form-label">
                                Trang thai
                            </label>
                            <input type="text" className="form-control" id="editInput" value={detail.status} />

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
    );
}