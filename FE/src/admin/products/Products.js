import React, { useEffect, useState } from 'react';
import { getProducts, updateStatus } from './service/ProductService';
import { useHistory } from 'react-router-dom';
import { Alert, Form, Modal, Spinner } from 'react-bootstrap';
import { getProductDetailByProductId } from './service/ProductDetailService';
import ModalProductDetail from './components/ModalProductDetail'
import Switch from 'react-switch';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [selectedProductDetails, setSelectedProductDetails] = useState([]);
    const [selectedProductName, setSelectedProductName] = useState("");

    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const history = useHistory();

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await getProducts();
            setProducts(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải sản phẩm.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();

        const message = localStorage.getItem("successMessage");
        if (message) {
            toast.success(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            localStorage.removeItem("successMessage");
        }
    }, []);

    const handleAddProduct = () => {
        history.push('/admin/products/add');
    }

    const handleUpdateProduct = (id) => {
        history.push(`/admin/products/edit/${id}`)
    }

    const handleShowProductDetail = async (productId, productName) => {
        try {
            const response = await getProductDetailByProductId(productId);
            console.log("API Response:", response.data);
            setSelectedProductDetails(response.data.data);
            setSelectedProductName(productName);
            setShowModal(true);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách biến thể:", error);
        }
    };

    const handleToggleStatus = async (productId, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;

            await updateStatus(productId, newStatus);

            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === productId ? { ...product, status: newStatus } : product
                )
            );
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
        }
    };

    const handleShowImageModal = (imageUrl) => {
        setImageUrl(imageUrl);
        setShowImageModal(true);
    };

    return (
        <div>
            <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title">Danh sách sản phẩm</h3>
                        <div className='row'>
                            <div className='col-md-9'></div>
                            <div className='col-md-3'>
                                <button type="button" className="btn btn-gradient-primary float-right" onClick={handleAddProduct}>
                                    <i className='mdi mdi-plus'></i> Thêm mới
                                </button>
                            </div>
                        </div>
                        <div style={{ marginBottom: '20px' }}></div>
                        {successMessage && (
                            <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
                                {successMessage}
                            </Alert>
                        )}
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                                <Spinner animation="border" variant="primary" />
                                <span className="ml-2">Đang tải dữ liệu...</span>
                            </div>
                        ) : error ? (
                            <div className="text-danger">{error}</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Ảnh chính</th>
                                            <th>Mã sản phẩm</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Thương hiệu</th>
                                            <th>Danh mục</th>
                                            <th>Chất liệu</th>
                                            <th>Mô tả</th>
                                            <th style={{ width: '50px' }}>Tổng số lượng</th>
                                            <th style={{ width: '150px' }}>Trạng thái</th>
                                            <th style={{ width: '100px' }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.length > 0 ? (
                                            products
                                                .filter(product => product.status === 1)
                                                .map((product, index) => (
                                                    <tr key={product.id}>
                                                        <td>
                                                            <div className="form-check">
                                                                <label className="form-check-label">
                                                                    <input type="checkbox" className="form-check-input" />
                                                                    <i className="input-helper"></i>
                                                                </label>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {product.mainImage != "image.png" ? (
                                                                <img
                                                                    src={product.mainImage}
                                                                    alt="Product"
                                                                    style={{ width: '100px', height: 'auto', cursor: 'pointer', borderRadius: '5%', objectFit: 'contain' }}
                                                                    onClick={() => handleShowImageModal(product.mainImage)}  // Mở modal khi click vào ảnh
                                                                />
                                                            ) : (
                                                                <span>No Image</span>
                                                            )}
                                                        </td>
                                                        <td>{product.productCode}</td>
                                                        <td>{product.productName}</td>
                                                        <td>{product.brand.brandName}</td>
                                                        <td>{product.category.categoryName}</td>
                                                        <td>{product.material.materialName}</td>
                                                        <td className="long-content">{product.description}</td>
                                                        <td>{product.totalQuantity}</td>
                                                        <td>
                                                            <span className={`badge ${product.status === 1 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '7px' }}>
                                                                {product.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                gap: '10px',
                                                                textAlign: 'center',
                                                                height: '100%',
                                                                padding: '10px'
                                                            }} >
                                                                <button className="btn btn-outline-warning btn-sm btn-rounded btn-icon"
                                                                    onClick={() => handleShowProductDetail(product.id, product.productName)}
                                                                >
                                                                    <i className='mdi mdi-eye'></i>
                                                                </button>
                                                                <Switch
                                                                    checked={product.status === 1}
                                                                    onChange={() => handleToggleStatus(product.id, product.status)}
                                                                    offColor="#888"
                                                                    onColor="#0d6efd"
                                                                    uncheckedIcon={false}
                                                                    checkedIcon={false}
                                                                    height={20}
                                                                    width={40}
                                                                />
                                                                <button className="btn btn-outline-danger btn-sm btn-rounded btn-icon"
                                                                    onClick={() => handleUpdateProduct(product.id)}
                                                                >
                                                                    <i className='mdi mdi mdi-wrench'></i>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center">Không có sản phẩm nào</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
                <Modal.Body>
                    <img
                        src={imageUrl}
                        alt="Large Product"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </Modal.Body>
            </Modal>

            <ModalProductDetail
                showModal={showModal}
                setShowModal={setShowModal}
                selectedProductName={selectedProductName}
                selectedProductDetails={selectedProductDetails}
                setSelectedProductDetails={setSelectedProductDetails}
                refreshProducts={fetchProducts}
            />

            <ToastContainer />
        </div>
    )
}

export default Products