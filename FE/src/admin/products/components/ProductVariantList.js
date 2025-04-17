import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import ReactSelect from 'react-select';
import { deleteOrRestoreProductDetails, updateProductDetail } from '../service/ProductDetailService';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useHistory } from 'react-router-dom';

const ProductVariantList = ({
    productDetails,
    selectedVariant,
    setSelectedVariant,
    colors,
    sizes,
    handleVariantClick,
    refreshProductDetail
}) => {
    const [showModalUpdate, setShowModalUpdate] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [originalVariant, setOriginalVariant] = useState(null);
    const [selectedVariants, setSelectedVariants] = useState([]);
    const history = useHistory();

    // Xử lý khi selectedVariant thay đổi
    useEffect(() => {
        if (selectedVariant) {
            handleVariantClick(selectedVariant);
        }
    }, [selectedVariant]);

    // Mở modal chỉnh sửa
    const handleShowModalUpdate = (productDetail) => {
        setOriginalVariant({ ...productDetail });
        setSelectedVariant(productDetail);
        setShowModalUpdate(true);
    };

    // Đóng modal chỉnh sửa
    const handleCloseModal = () => {
        setShowModalUpdate(false);
        setSelectedVariant(originalVariant);
    };

    // Chọn/bỏ chọn một biến thể
    const handleSelectVariant = (variantId) => {
        setSelectedVariants(prev =>
            prev.includes(variantId)
                ? prev.filter(id => id !== variantId)
                : [...prev, variantId]
        );
    };

    // Chọn/bỏ chọn tất cả biến thể
    const handleSelectAllVariants = () => {
        if (selectedVariants.length === productDetails.length) {
            setSelectedVariants([]);
        } else {
            setSelectedVariants(productDetails.map(v => v.id));
        }
    };

    // Xóa các biến thể đã chọn
    const handleDeleteSelectedVariants = async () => {
        if (selectedVariants.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một biến thể để xóa!");
            return;
        }

        const result = await Swal.fire({
            title: "Xác nhận xóa",
            text: `Bạn có chắc chắn muốn xóa ${selectedVariants.length} biến thể đã chọn?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy"
        });

        if (!result.isConfirmed) return;

        try {
            await deleteOrRestoreProductDetails(selectedVariants);
            toast.success(`Đã xóa thành công ${selectedVariants.length} biến thể!`);

            // Refresh danh sách
            refreshProductDetail();

            // Reset selected variants
            setSelectedVariants([]);

            // Nếu biến thể đang chọn bị xóa, reset selectedVariant
            if (selectedVariant && selectedVariants.includes(selectedVariant.id)) {
                setSelectedVariant(null);
            }
        } catch (error) {
            console.error("Lỗi khi xóa biến thể:", error);
            toast.error("Có lỗi xảy ra khi xóa biến thể!");
        }
    };

    // Cập nhật biến thể
    const handleUpdateVariant = async () => {
        if (!selectedVariant) return;

        // Kiểm tra trùng size cùng màu
        const sameColorVariants = productDetails.filter(
            variant => variant.color.id === selectedVariant.color.id &&
                variant.id !== selectedVariant.id
        );

        const isSizeDuplicate = selectedVariant.size &&
            sameColorVariants.some(variant => variant.size?.id === selectedVariant.size?.id);

        if (isSizeDuplicate) {
            toast.error("Biến thể cùng màu đã có kích cỡ này!");
            return;
        }

        // Validate dữ liệu
        if (selectedVariant.quantity === '' || selectedVariant.quantity < 0) {
            toast.error("Số lượng không được để trống và phải ≥ 0!");
            return;
        }

        if (selectedVariant.price === '' || selectedVariant.price < 0) {
            toast.error("Giá sản phẩm không được để trống và phải ≥ 0!");
            return;
        }

        // Xác nhận cập nhật
        const result = await Swal.fire({
            title: "Xác nhận cập nhật",
            text: "Bạn có chắc muốn cập nhật thông tin biến thể này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy"
        });

        if (!result.isConfirmed) return;

        setIsSaving(true);

        try {
            const updateData = {
                quantity: selectedVariant.quantity,
                price: selectedVariant.price,
                status: selectedVariant.quantity > 0 ? 1 : 0,
                colorId: selectedVariant.color?.id,
                sizeId: selectedVariant.size?.id
            };

            await updateProductDetail(selectedVariant.id, updateData);
            refreshProductDetail();
            setShowModalUpdate(false);
            toast.success("Cập nhật biến thể thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật biến thể:", error);
            toast.error("Có lỗi xảy ra khi cập nhật biến thể!");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div className="d-flex justify-content-between mb-3">
                <div>
                    {selectedVariants.length > 0 && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={handleDeleteSelectedVariants}
                            className="me-2"
                        >
                            <i className="mdi mdi-delete"></i> Xóa ({selectedVariants.length})
                        </Button>
                    )}
                </div>
                <div>
                    <small className="text-muted">
                        {selectedVariants.length > 0 ? `Đã chọn ${selectedVariants.length}/${productDetails.length}` : ''}
                    </small>
                </div>
            </div>

            <div className='table-responsive' style={{ height: '225px', overflowY: 'auto' }}>
                <table className='table'>
                    <thead>
                        <tr>
                            {/* Thêm cột checkbox */}
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAllVariants}
                                    checked={selectedVariants.length === productDetails.length && productDetails.length > 0}
                                />
                            </th>
                            <th>Danh sách biến thể:</th>
                            <th></th>
                            {localStorage.getItem("role") === "ADMIN" &&
                                <th style={{ width: '80px' }}></th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {productDetails.length > 0 ? (
                            productDetails.map((productDetail, index) => (
                                <tr key={productDetail.id}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: selectedVariant?.id === productDetail.id ? "#f0f8ff" : "transparent",
                                        transition: "background-color 0.3s ease"
                                    }}
                                    onClick={() => handleVariantClick(productDetail)}
                                >
                                    {/* Thêm ô checkbox */}
                                    <td onClick={(e) => e.stopPropagation()}>
                                        <input
                                            type="checkbox"
                                            checked={selectedVariants.includes(productDetail.id)}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                handleSelectVariant(productDetail.id);
                                            }}
                                        />
                                    </td>
                                    <td>
                                        Màu: <i>{productDetail.color.colorName}</i><br />
                                        <small style={{ color: "#999" }}>Số lượng: {productDetail.quantity} </small>
                                    </td>
                                    <td>
                                        Kích cỡ: <b>{productDetail.size.sizeName}</b><br />
                                        <small> </small>
                                    </td>
                                    {localStorage.getItem("role") === "ADMIN" &&
                                        <td style={{ display: 'flex', alignItems: 'center', verticalAlign: 'center', height: '60px' }}>
                                            <Button variant="link"
                                                style={{ padding: '0px', marginRight: "10px" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleShowModalUpdate(productDetail);
                                                }}
                                            >
                                                <i className='mdi mdi-pencil'></i>
                                            </Button>
                                        </td>
                                    }
                                </tr>
                            ))
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
                                        if (newValue > 1000000) {
                                            toast.error("Số lượng không được vượt quá 1 triệu");
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
                                    onChange={(e) => {
                                        const newValue = e.target.value === "" ? "" : Number(e.target.value);
                                        if (newValue > 100000000) {
                                            toast.error("Giá không được vượt quá 100 triệu");
                                            return;
                                        }
                                        setSelectedVariant({ ...selectedVariant, price: newValue });
                                    }
                                    }
                                // disabled
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
                        {isSaving ? "Đang lưu..." : "Lưu"}</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProductVariantList;