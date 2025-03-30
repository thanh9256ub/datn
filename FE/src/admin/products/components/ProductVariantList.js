import React, { useEffect, useState } from 'react'
import { getImagesByProductColor } from '../service/ProductService';
import { Button, Form, Modal } from 'react-bootstrap';
import ReactSelect from 'react-select';
import { updateProductDetail } from '../service/ProductDetailService';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ColorContainer from './ColorContainer';
import SizeContainer from './SizeContainer';

const ProductVariantList = ({ productDetails, selectedVariant, setSelectedVariant, colors, sizes, handleVariantClick, refreshProductDetail }) => {

    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [isSaving, setIsSaving] = useState(false)
    const [originalVariant, setOriginalVariant] = useState(null);

    useEffect(() => {
        if (selectedVariant) {
            handleVariantClick(selectedVariant);
        }
    }, [selectedVariant]);

    const handleShowModalUpdate = (productDetail) => {
        setOriginalVariant({ ...productDetail });
        setSelectedVariant(productDetail);
        setShowModalUpdate(true);
    };

    const handleCloseModal = () => {
        setShowModalUpdate(false);
        setSelectedVariant(originalVariant);
    };

    const handleUpdateVariant = async () => {
        if (!selectedVariant) return;

        const sameColorVariants = productDetails.filter(
            (variant) => variant.color.id === selectedVariant.color.id && variant.id !== selectedVariant.id
        );

        // Kiểm tra xem có biến thể cùng màu đã có cùng size chưa
        const isSizeDuplicate = selectedVariant.size && sameColorVariants.some(
            (variant) => variant.size?.id === selectedVariant.size?.id
        );

        if (isSizeDuplicate) {
            toast.error("Biến thể cùng màu đã có kích cỡ này!");
            return;
        }

        if (selectedVariant.quantity === '' || selectedVariant.quantity < 0) {
            toast.error("Số lượng không được để trống và nhỏ hơn 0!");
            return;
        }

        if (selectedVariant.price === '' || selectedVariant.price < 0) {
            toast.error("Giá sản phẩm không được để trống và nhỏ hơn 0!");
            return;
        }

        const result = await Swal.fire({
            title: "Bạn có chắc muốn cập nhật?",
            text: "Thao tác này sẽ cập nhật thông tin biến thể!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy"
        });

        if (!result.isConfirmed) return;

        setIsSaving(true);

        const updateData = {
            quantity: selectedVariant.quantity,
            price: selectedVariant.price,
            status: selectedVariant.status,
            colorId: selectedVariant.color?.id,
            sizeId: selectedVariant.size?.id
        };

        try {
            const response = await updateProductDetail(selectedVariant.id, updateData);
            const updatedVariant = response.data;

            refreshProductDetail();

            setShowModalUpdate(false);

            toast.success("Cập nhật biến thể thành công!");

        } catch (error) {
            console.error("Lỗi khi cập nhật biến thể:", error);
            alert("Có lỗi xảy ra khi cập nhật biến thể!");
        }
        setIsSaving(false);
    };

    return (
        <div>
            <div className='table-responsive' style={{ maxHeight: '300px', overflowY: 'auto' }}>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Danh sách biến thể:</th>
                            <th></th>
                            <th style={{ width: '20px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {productDetails.length > 0 ? (
                            productDetails
                                .map((productDetail, index) => (
                                    <tr key={productDetail.id}
                                        style={{
                                            cursor: 'pointer',
                                            backgroundColor: selectedVariant?.id === productDetail.id ? "#f0f8ff" : "transparent",
                                            transition: "background-color 0.3s ease"
                                        }}
                                        onClick={() => handleVariantClick(productDetail)}
                                    >
                                        <td>
                                            Màu: <i>{productDetail.color.colorName}</i><br />
                                            <small style={{ color: "#999" }}>Số lượng: {productDetail.quantity} </small>

                                        </td>
                                        <td>
                                            Kích cỡ: <b>{productDetail.size.sizeName}</b><br />
                                            <small> </small>
                                        </td>
                                        <td>
                                            <Button variant="link"
                                                onClick={() => handleShowModalUpdate(productDetail)}
                                            >
                                                <i className='mdi mdi-pencil'></i>
                                            </Button>
                                        </td>
                                    </tr>
                                )
                                )
                        ) : (
                            <tr>
                                <td colSpan="10" className="text-center">Không có biến thể nào</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Modal show={showModalUpdate} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật biến thể</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedVariant && (
                        <Form>
                            <Form.Group>
                                <Form.Label>
                                    <strong>Màu sắc:</strong>
                                </Form.Label>
                                <ReactSelect
                                    value={
                                        selectedVariant?.color
                                            ? {
                                                value: selectedVariant.color.id,
                                                label: selectedVariant.color.colorName,
                                            }
                                            : null
                                    }
                                    onChange={(selectedOption) => {
                                        setSelectedVariant({
                                            ...selectedVariant,
                                            color: colors.find((c) => c.id === selectedOption.value),
                                        });
                                    }}
                                    options={colors.map((color) => ({
                                        value: color.id,
                                        label: color.colorName,
                                    }))}
                                    isDisabled={!!selectedVariant?.color?.id}
                                />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>
                                    <strong>Kích cỡ:</strong>
                                </Form.Label>
                                <ReactSelect
                                    value={
                                        selectedVariant?.size
                                            ? {
                                                value: selectedVariant.size.id,
                                                label: selectedVariant.size.sizeName,
                                            }
                                            : null
                                    }
                                    onChange={(selectedOption) => {
                                        setSelectedVariant({
                                            ...selectedVariant,
                                            size: sizes.find((s) => s.id === selectedOption.value),
                                        });
                                    }}
                                    options={sizes.map((size) => ({
                                        value: size.id,
                                        label: size.sizeName,
                                    }))}
                                    isDisabled={!!selectedVariant?.size?.id}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    <strong>Số lượng:</strong>
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    min={0}
                                    value={selectedVariant.quantity}
                                    onChange={(e) => {
                                        const newValue = e.target.value === "" ? "" : Number(e.target.value);
                                        if (newValue > 1000000000) {
                                            toast.error("Số lượng quá lớn, vui lòng nhập lại giá trị");
                                            return;
                                        }
                                        setSelectedVariant({ ...selectedVariant, quantity: newValue });
                                    }}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>
                                    <strong>Giá:</strong>
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    value={selectedVariant.price}
                                    onChange={(e) =>
                                        setSelectedVariant({ ...selectedVariant, price: e.target.value })
                                    }
                                    disabled
                                />
                            </Form.Group>
                        </Form>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Đóng</Button>
                    <Button
                        variant="primary"
                        onClick={handleUpdateVariant}
                        disabled={isSaving}
                    >
                        {isSaving ? "Đang lưu..." : "Sửa"}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ProductVariantList
