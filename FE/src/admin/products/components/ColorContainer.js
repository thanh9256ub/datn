import React, { useEffect, useState } from 'react';
import { getColors, createColor, getActive } from '../service/ColorService';
import Select from 'react-select';
import { Button, Form, Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const ColorContainer = ({ colorIds, setColorIds }) => {
    const [colorOptions, setColorOptions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newColorName, setNewColorName] = useState("");

    useEffect(() => {
        fetchColors();
    }, []);

    const fetchColors = async () => {
        getActive()
            .then(response => {
                const formattedColors = response.data.data.map(color => ({
                    value: color.id,
                    label: color.colorName
                }));
                setColorOptions(formattedColors);
            })
            .catch(error => {
                console.error("Lỗi khi lấy dữ liệu màu:", error);
            });
    }

    const handleAddColor = async () => {
        if (!newColorName.trim()) {
            alert("Vui lòng nhập tên màu sắc!");
            return;
        }

        try {
            const colorResp = await getColors();
            const colors = colorResp.data.data;
            const colorExists = colors.some(color => color.colorName.toLowerCase() === newColorName.toLowerCase());

            if (colorExists) {
                toast.error("Màu sắc đã tồn tại!");
                return;
            }
            const response = await createColor({ colorName: newColorName });
            toast.success("Thêm màu sắc thành công!");
            setShowModal(false);
            setNewColorName("");
            fetchColors();
        } catch (error) {
            console.error("Lỗi khi thêm màu sắc:", error);
            alert("Lỗi khi thêm màu sắc!");
        }
    };

    return (
        <div>
            <Form.Group className="row">
                <label className="col-sm-3 col-form-label">Màu sắc:</label>
                <div className="col-sm-7">
                    <Select
                        isMulti
                        options={colorOptions}
                        value={colorIds || []}
                        onChange={(selected) => setColorIds(selected || [])}
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
                    <Modal.Title>Thêm màu sắc</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Tên màu sắc</Form.Label>
                        <Form.Control
                            type="text"
                            value={newColorName}
                            onChange={(e) => setNewColorName(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleAddColor}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ColorContainer