import React, { useState } from "react";
import { Button, Col, InputGroup, Container, Modal } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";


function ThemNhanVien() {

    const [showModal, setShowModal] = useState(false);

    // Hàm mở Modal
    const handleShow = () => setShowModal(true);

    // Hàm đóng Modal
    const handleClose = () => setShowModal(false);

    return (
        <Container className="my-4" style={{ marginLeft: "400px" }}>
            <Col>
                <InputGroup>
                    <Button onClick={() => handleShow()}>
                        <Plus size={20} />
                        Nhan vien
                    </Button>
                </InputGroup>

            </Col>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Them nhan vien</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Nội dung của Modal */}
                    <form>
                        <div className="mb-3">
                            <label htmlFor="editInput" className="form-label">
                                Ma nhan vien
                            </label>
                            <input type="text" className="form-control" id="editInput" />
                            <label htmlFor="editInput" className="form-label">
                                Tên
                            </label>
                            <input type="text" className="form-control" id="editInput" />
                            <label htmlFor="editInput" className="form-label">
                                Gioi tinh
                            </label>
                            <input type="text" className="form-control" id="editInput" />
                            <label htmlFor="editInput" className="form-label">
                                Ngay sinh
                            </label>
                            <input type="text" className="form-control" id="editInput" />
                            <label htmlFor="editInput" className="form-label">
                                So dien thoai
                            </label>
                            <input type="text" className="form-control" id="editInput" />
                            <label htmlFor="editInput" className="form-label">
                                Dia chi
                            </label>
                            <input type="text" className="form-control" id="editInput" />
                            <label htmlFor="editInput" className="form-label">
                                Tên dang nhap
                            </label>
                            <input type="text" className="form-control" id="editInput" />
                            <label htmlFor="editInput" className="form-label">
                                Trang thai
                            </label>
                            <input type="text" className="form-control" id="editInput" />

                        </div>
                        <Button variant="primary" type="submit">
                            Lưu
                        </Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
            
        </Container>

    );
    
}

export default ThemNhanVien;