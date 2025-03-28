import React, { useEffect, useState } from 'react';
import { getSizes, createSize } from '../service/SizeService';
import Select from 'react-select';
import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const SizeContainer = ({ sizeIds, setSizeIds }) => {
    const [sizeOptions, setSizeOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newSizeName, setNewSizeName] = useState("");

    useEffect(() => {
        fetchSizes();
    }, []);

    const fetchSizes = async () => {
        getSizes().then(response => {
            const formattedSizes = response.data.data.map(size => ({
                value: size.id,
                label: size.sizeName
            }));
            setSizeOptions(formattedSizes);
        });
    }

    const handleAddSize = async () => {
        if (!newSizeName.trim()) {
            alert("Vui lòng nhập tên kích cỡ!");
            return;
        }

        try {
            const sizeResp = await getSizes();
            const sizes = sizeResp.data.data;
            const sizeExists = sizes.some(size => size.sizeName.toLowerCase() === newSizeName.toLowerCase());

            if (sizeExists) {
                toast.error("Kích cỡ đã tồn tại!");
                return;
            }
            const response = await createSize({ sizeName: newSizeName });
            toast.success("Thêm kích cỡ thành công!");
            setShowModal(false);
            setNewSizeName("");
            fetchSizes();
        } catch (error) {
            console.error("Lỗi khi thêm kích cỡ:", error);
            alert("Lỗi khi thêm kích cỡ!");
        }
    };

    return (
        <div>
            <Form.Group className="row">
                <label className="col-sm-3 col-form-label">Kích cỡ:</label>
                <div className="col-sm-7">
                    <Select
                        isMulti
                        options={sizeOptions}
                        value={sizeIds || []}
                        onChange={(selected) => setSizeIds(selected || [])}
                        classNamePrefix="react-select"
                    />
                </div>
                <div className="col-sm-2">
                    <button type="button" className="btn btn-outline-secondary btn-rounded btn-icon" onClick={() => setShowModal(true)}>
                        <i className='mdi mdi-plus'></i>
                    </button>
                </div>
            </Form.Group>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm kích cỡ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Tên kích cỡ</Form.Label>
                        <Form.Control
                            type="text"
                            value={newSizeName}
                            onChange={(e) => setNewSizeName(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleAddSize}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SizeContainer;