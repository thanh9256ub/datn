import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { getProductDetailByProductId } from './service/ProductDetailService';
import { getImagesByProductColor, getProductById, getProductColorsByProductId } from './service/ProductService';
import { getColors } from './service/ColorService';
import { getSizes } from './service/SizeService';
import ProductInfo from './components/ProductInfo';
import ProductVariantList from './components/ProductVariantList';
import ProductVariantDetail from './components/ProductVariantDetail';
import { toast, ToastContainer } from 'react-toastify';
import { Modal, Button } from 'react-bootstrap';
import { getBinDetails, deleteOrRestoreProductDetails } from './service/ProductDetailService';
import Swal from 'sweetalert2';

const ProductDetail = () => {
    const { id } = useParams();
    const history = useHistory();

    const [product, setProduct] = useState({});
    const [productDetails, setProductDetails] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [colors, setColors] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [colorImages, setColorImages] = useState([]);
    const [productColorList, setProductColorList] = useState([]);

    const [showBinModal, setShowBinModal] = useState(false);
    const [deletedVariants, setDeletedVariants] = useState([]);
    const [selectedDeletedVariants, setSelectedDeletedVariants] = useState([]);

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const productResponse = await getProductById(id);
            setProduct(productResponse.data.data);

            const response = await getProductDetailByProductId(id);
            const pd = response.data.data;
            setProductDetails(pd);

            const colorResponse = await getColors();
            setColors(colorResponse.data.data);

            const sizeResponse = await getSizes();
            setSizes(sizeResponse.data.data);

            const productColorResponse = await getProductColorsByProductId(id);
            setProductColorList(productColorResponse.data.data);

            if (!selectedVariant || !pd.some(variant => variant.id === selectedVariant.id)) {
                setSelectedVariant(pd[0]);
            }

        } catch (error) {
            console.log("Lỗi lấy dữ liệu product details: ", error);
            toast.error("Lỗi khi tải dữ liệu sản phẩm");
        }
    };

    const handleVariantClick = async (selectedVariant) => {
        setSelectedVariant(selectedVariant);

        const selectedColorId = selectedVariant?.color?.id || null;
        const selectedProductId = selectedVariant?.product?.id || null;

        if (selectedColorId && selectedProductId) {
            const productColor = productColorList.find(pc =>
                pc.product.id === selectedProductId && pc.color.id === selectedColorId
            );

            if (productColor) {
                try {
                    const imagesResponse = await getImagesByProductColor(productColor.id);
                    setColorImages(imagesResponse.data.data);
                } catch (error) {
                    console.log("Lỗi khi lấy ảnh màu sắc:", error);
                    setColorImages([]);
                }
            } else {
                setColorImages([]);
            }
        } else {
            setColorImages([]);
        }
    };

    const handleUpdateProduct = () => {
        history.push(`/admin/products/edit/${product.id}`);
    };

    const fetchDeletedVariants = async () => {
        try {
            const response = await getBinDetails(id);
            setDeletedVariants(response.data.data || []);
        } catch (error) {
            console.error("Lỗi khi lấy biến thể đã xóa:", error);
            toast.error("Lỗi khi tải dữ liệu thùng rác");
        }
    };

    const handleOpenBinModal = () => {
        fetchDeletedVariants();
        setShowBinModal(true);
    };

    const handleRestoreVariants = async () => {
        if (selectedDeletedVariants.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một biến thể để khôi phục!");
            return;
        }

        const result = await Swal.fire({
            title: "Xác nhận",
            text: `Bạn có chắc chắn muốn khôi phục ${selectedDeletedVariants.length} biến thể đã chọn?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteOrRestoreProductDetails(selectedDeletedVariants);
            toast.success("Khôi phục biến thể thành công!");
            fetchDeletedVariants();
            setSelectedDeletedVariants([]);
            fetchProductDetails();
        } catch (error) {
            console.error("Lỗi khi khôi phục biến thể:", error);
            toast.error("Có lỗi xảy ra khi khôi phục biến thể!");
        }
    };

    return (
        <div>
            <div className="row">
                {localStorage.getItem("role") === "ADMIN" && (
                    <>
                        <div className="col-md-2">
                            <div
                                style={{ cursor: "pointer", textDecoration: "none" }}
                                onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                                onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                                onClick={handleOpenBinModal}
                            >
                                <i className='mdi mdi-delete'></i>
                                Thùng rác
                            </div>
                        </div>
                        <div className="col-md-10" style={{ marginBottom: "20px" }}>
                            <button
                                type='button'
                                className='btn btn-gradient-primary btn-sm float-right'
                                onClick={handleUpdateProduct}
                            >
                                <i className='mdi mdi-pencil'></i>Chỉnh sửa
                            </button>
                        </div>
                    </>
                )}
                <div className="col-lg-6 grid-margin stretch-card">
                    <div className='row'>
                        <div className="col-lg-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <ProductInfo product={product} />
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <ProductVariantList
                                        productDetails={productDetails}
                                        selectedVariant={selectedVariant}
                                        setSelectedVariant={setSelectedVariant}
                                        handleVariantClick={handleVariantClick}
                                        colors={colors}
                                        sizes={sizes}
                                        refreshProductDetail={fetchProductDetails}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="card">
                        <div className="card-body">
                            <ProductVariantDetail
                                selectedVariant={selectedVariant}
                                setSelectedVariant={setSelectedVariant}
                                colorImages={colorImages}
                                productDetails={productDetails}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal thùng rác */}
            <Modal
                show={showBinModal}
                onHide={() => setShowBinModal(false)}
                size="lg"
                centered
                scrollable
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="mdi mdi-delete mr-2"></i>
                        Thùng rác - Biến thể sản phẩm
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-between mb-3">
                        <div>
                            {selectedDeletedVariants.length > 0 && (
                                <Button
                                    variant="primary"
                                    onClick={handleRestoreVariants}
                                >
                                    <i className="mdi mdi-restore"></i> Khôi phục ({selectedDeletedVariants.length})
                                </Button>
                            )}
                        </div>
                        <div>
                            <span className="text-muted">
                                Tổng số: {deletedVariants.length} biến thể đã xóa
                            </span>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedDeletedVariants(deletedVariants.map(v => v.id));
                                                } else {
                                                    setSelectedDeletedVariants([]);
                                                }
                                            }}
                                            checked={selectedDeletedVariants.length === deletedVariants.length && deletedVariants.length > 0}
                                        />
                                    </th>
                                    <th>Màu sắc</th>
                                    <th>Kích cỡ</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                    <th>Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deletedVariants.length > 0 ? (
                                    deletedVariants.map(variant => (
                                        <tr key={variant.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedDeletedVariants.includes(variant.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedDeletedVariants([...selectedDeletedVariants, variant.id]);
                                                        } else {
                                                            setSelectedDeletedVariants(selectedDeletedVariants.filter(id => id !== variant.id));
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td>{variant.color?.colorName || 'N/A'}</td>
                                            <td>{variant.size?.sizeName || 'N/A'}</td>
                                            <td>{variant.quantity}</td>
                                            <td>{variant.price?.toLocaleString() || '0'}đ</td>
                                            <td>
                                                <span className="badge bg-secondary">Đã xóa</span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-4">
                                            Không có biến thể nào trong thùng rác
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBinModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
};

export default ProductDetail;