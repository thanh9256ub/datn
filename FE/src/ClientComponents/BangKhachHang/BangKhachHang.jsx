import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { Pen } from "react-bootstrap-icons";

export default function BangKhachHang() {
    const [khachHang, setKhachHang] = useState([
        { full_name: "Nguyen Van A", gender: "Nam", birth_date: "1998-09-08", phone: "0987654322",created_at:"2024-02-09", email: "nva12345@gmail.com"},
        { full_name: "Nguyen Van B", gender: "Nam", birth_date: "2000-09-08", phone: "098765321", created_at:"2024-02-09",email: "nvb45678@gmail.com"}

    ]);

    const [showModal, setShowModal] = useState(false);

    const [detail, setDetail] = useState({});
    // Hàm mở Modal
    const handleShow = (kh) => {
        setShowModal(true);
        setDetail(kh);
    };

    // Hàm đóng Modal
    const handleClose = () => setShowModal(false);


    return (
        <div className="border border-primary rounded p-3" style={{ marginLeft: "5px" }} >
            <h5>Khach hang </h5>
            <hr />
            <div className="d-flex justify-content-between mb-3" >
                {/* <Button variant="light" disabled>Tìm kiếm</Button> */}
            </div>
            <Table bordered hover >
                <thead>
                    <tr>
                        <th>Khach hang</th>
                        <th>Gioi tinh</th>
                        <th>Ngay sinh</th>
                        <th>So dien thoai</th>
                        <th>Ngay tao</th>
                        <th>email</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {khachHang.map((kh, index) => (
                        <tr key={index}>
                            <td>{kh.full_name}</td>
                            <td>{kh.gender}</td>
                            <td>{kh.birth_date}</td>
                            <td>{kh.phone}</td>
                            <td>{kh.created_at}</td>
                            <td>{kh.email}</td>
                            <td>
                                <Button variant="link" onClick={() => handleShow(kh)}>
                                    <Pen size={20} />
                                </Button>
                            </td>
                        </tr>

                    ))}
                </tbody>
            </Table>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Khach Hang</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Nội dung của Modal */}
                    <form>
                        <div className="mb-3">
                            <label htmlFor="editInput" className="form-label">
                                Tên khach hang
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
                                Ngay tao
                            </label>
                            <input type="text" className="form-control" id="editInput" value={detail.created_at} />
                            <label htmlFor="editInput" className="form-label">
                                Email
                            </label>
                            <input type="text" className="form-control" id="editInput" value={detail.email} />
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