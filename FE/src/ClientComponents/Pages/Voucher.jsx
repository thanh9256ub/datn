import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { Pen, Trash } from "react-bootstrap-icons";



const Voucher = () => {

    const [vouchers, setVoucher] = useState([
        {
            id: 1,
            voucherCode: "b",
            voucherName: "khuyen_mai_kha_ngon",
            condition: "Don hang tren 100k",
            discountValue: 1.1,
            quantity: 1111,
            startDate: "2100-10-10T00:00:00",
            endDate: "2100-10-10T00:00:00",
            maxDiscountValue: 50.0,
            discountType: "Theo %",
            status: "Đang sử dụng",
            createdAt: "2100-10-10T00:00:00",
            updateAt: "2100-10-10T00:00:00"},
        {   id: 2,
            voucherCode: "b",
            voucherName: "khuyen_mai_kha_ngon",
            condition: "Don hang tren 100k",
            discountValue: 1.1,
            quantity: 1111,
            startDate: "2100-10-10T00:00:00",
            endDate: "2100-10-10T00:00:00",
            maxDiscountValue: 50.0,
            discountType: "Theo %",
            status: "Đang sử dụng",
            createdAt: "2100-10-10T00:00:00",
            updateAt: "2100-10-10T00:00:00"}

    ]);

    const [showModal, setShowModal] = useState(false);

    const [detail, setDetail] = useState({});
    // Hàm mở Modal
    const handleShow = (v) => {
        setShowModal(true);
        setDetail(v);
    };
    const handleClose = () => setShowModal(false);


    const removeItem = (nv) => {
        setVoucher(vouchers.filter((_, i) => i !== nv));
    };
    return (
        <div className="border border-primary rounded p-3" style={{ marginLeft: "5px" }} >
            <h5>Khuyến Mại</h5>
            <hr />
            <div className="d-flex justify-content-between mb-3" >
                { <Button variant="light" disabled>Tìm kiếm</Button> }
            </div>
            <Table bordered hover >
                <thead>
                    <tr>
                        <th>Mã khuyến mại</th>
                        <th>Tên khuyến mại</th>
                        <th>Điều kiện</th>
                        <th>Giá trị</th>
                        <th>Số lượng</th>
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Giá trị tối đa</th>
                        <th>Loại giảm giá</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Ngày sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {vouchers.map((v, index) => (
                        <tr key={index}>
                            <td>{v.id}</td>
                            <td>{v.voucherCode}</td>
                            <td>{v.voucherName}</td>
                            <td>{v.discountValue}</td>
                            <td>{v.quantity}</td>
                            <td>{v.startDate}</td>
                            <td>{v.endDate}</td>
                            <td>{v.maxDiscountValue}</td>
                            <td>{v.discountType}</td>
                            <td>{v.status}</td>
                            <td>{v.createdAt}</td>
                            <td>{v.updateAt}</td>
                            <td>
                                <Button variant="link" onClick={() => handleShow(v)}>
                                    <Pen size={50} />
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
                    <Modal.Title>Voucher</Modal.Title>
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
    )
}

export default Voucher