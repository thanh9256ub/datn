import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { getBrands, createBrand } from '../service/BrandService';
import { Button, Form, Modal } from 'react-bootstrap';
import BrandSelect from '../select/BrandSelect';

const BrandContainer = ({ brandId, setBrandId, id }) => {
    const [showModal, setShowModal] = useState(false);
    const [newBrandName, setNewBrandName] = useState("");
    const [refresh, setRefresh] = useState(false);

    const handleAddBrand = async () => {
        const normalizedName = newBrandName.trim().replace(/\s+/g, ' ');
        if (!normalizedName) {
            toast.error("Vui lòng nhập tên thương hiệu!");
            return;
        }

        try {
            const brandResp = await getBrands();
            const brands = brandResp.data.data;
            const brandExists = brands.some(brand =>
                brand.brandName.trim().replace(/\s+/g, ' ').toLowerCase() === normalizedName.toLowerCase()
            );

            if (brandExists) {
                toast.error("Thương hiệu đã tồn tại!");
                return;
            }

            const response = await createBrand({ brandName: newBrandName });
            toast.success("Thêm thương hiệu thành công")
            setShowModal(false);
            setNewBrandName("");
            setRefresh(prev => !prev);
        } catch (error) {
            console.error("Lỗi khi thêm thương hiệu:", error);
            alert("Lỗi khi thêm thương hiệu!");
        }
    };


    return (
        <div>
            <Form.Group className="row d-flex align-items-center">
                <label className="col-sm-3 col-form-label">Thương hiệu:</label>
                <div className="col-sm-7">
                    <BrandSelect brandId={brandId} setBrandId={setBrandId} refresh={refresh} id={id} />
                </div>
                <div className="col-sm-2">
                    <button type="button" className="btn btn-outline-secondary btn-rounded btn-icon" onClick={() => setShowModal(true)}>
                        <i className='mdi mdi-plus'></i>
                    </button>
                </div>
            </Form.Group>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm Thương Hiệu</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Tên thương hiệu</Form.Label>
                        <Form.Control
                            type="text"
                            value={newBrandName}
                            onChange={(e) => setNewBrandName(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleAddBrand}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BrandContainer;
