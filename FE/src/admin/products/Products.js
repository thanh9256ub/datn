import React, { useEffect, useState } from 'react';
import { getProducts, searchProducts, updateStatus } from './service/ProductService';
import { useHistory } from 'react-router-dom';
import { Alert, Modal, Pagination, Spinner } from 'react-bootstrap';
import Switch from 'react-switch';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchProducts from './action/SearchProducts';

const Products = () => {
    const [products, setProducts] = useState([]);
        const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const [filters, setFilters] = useState({
        name: '',
        brandId: '',
        categoryId: '',
        materialId: '',
        status: ''
    });

    const history = useHistory();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const fetchProducts = async (page = currentPage, size = pageSize) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProducts(page, size);
            const data = response.data?.data;

            setProducts(data?.content || []);
            setTotalPages(data?.totalPages || 1);
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm:", err);
            setError("Đã xảy ra lỗi khi tải sản phẩm.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage, pageSize);

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

        history.push(`/admin/products?page=${currentPage}&size=${pageSize}`);
    }, [currentPage, pageSize]);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            fetchProducts(page);
            history.push(`/admin/products?page=${page}&size=${pageSize}`);
        }
    };

    const pageSizeOptions = [
        { value: 5, label: "5 sản phẩm" },
        { value: 10, label: "10 sản phẩm" },
        { value: 20, label: "20 sản phẩm" },
        { value: 50, label: "50 sản phẩm" }
    ];

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value));
        setCurrentPage(0);
    };

    const handleAddProduct = () => {
        history.push('/admin/products/add');
    }

    const handleUpdateProduct = (id, productName) => {
        history.push(`/admin/products/edit/${id}`)
    }

    const handleProductDetail = (id, productName) => {
        history.push({
            pathname: `/admin/products/${id}/detail`,
            state: { productName: productName }
        });
    }

    const handleToggleStatus = async (productId, currentStatus) => {
        try {
            const newStatus = currentStatus === 1 ? 0 : 1;

            await updateStatus(productId, newStatus);

            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === productId ? { ...product, status: newStatus } : product
                )
            );

            fetchProducts();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
        }
    };

    const handleShowImageModal = (imageUrl) => {
        setImageUrl(imageUrl);
        setShowImageModal(true);
    };

    const fetchFilteredProducts = async () => {
        setLoading(true);
        try {
            const response = await searchProducts(filters, currentPage, pageSize);
            setProducts(response.data?.data?.content || []);
            setTotalPages(response.data?.data?.totalPages || 1);
            setLoading(false);
        } catch (err) {
            setError('Lỗi khi tìm kiếm sản phẩm.');
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchFilteredProducts();
    // }, []);

    const handleSearch = () => {
        setCurrentPage(0);
        fetchFilteredProducts();
    };

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    Danh sách sản phẩm
                </h3>
            </div>
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className='row'>
                                <div className='col-md-10'>
                                    <SearchProducts filters={filters} setFilters={setFilters} onSearch={handleSearch} />                                </div>
                                <div className='col-md-2'>
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
                                <>
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
                                                    <th>Trạng thái</th>
                                                    <th style={{ width: '100px' }}>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.length > 0 ? (
                                                    products
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
                                                                        {product.status === 1 ? 'Đang bán' : 'Hết hàng'}
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
                                                                            onClick={() => handleProductDetail(product.id, product.productName)}
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
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column", // Xếp theo cột
                                        alignItems: "center", // Căn giữa theo chiều ngang
                                        marginTop: "20px",
                                        gap: "10px",
                                        width: "100%"
                                    }}>
                                        <Pagination className="justify-content-center">
                                            <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0} />
                                            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />

                                            {[...Array(totalPages)].map((_, index) => (
                                                <Pagination.Item
                                                    key={index}
                                                    active={index === currentPage}
                                                    onClick={() => handlePageChange(index)}
                                                >
                                                    {index + 1}
                                                </Pagination.Item>
                                            ))}

                                            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} />
                                            <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage === totalPages - 1} />
                                        </Pagination>
                                        <div style={{ minWidth: "80px", textAlign: "center" }}>
                                            <select
                                                value={pageSize}
                                                onChange={handlePageSizeChange}
                                                className="form-control"
                                            >
                                                {pageSizeOptions.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
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

            {/* <ModalProductDetail
                showModal={showModal}
                setShowModal={setShowModal}
                selectedProductName={selectedProductName}
                selectedProductDetails={selectedProductDetails}
                setSelectedProductDetails={setSelectedProductDetails}
                refreshProducts={fetchProducts}
            /> */}

            <ToastContainer />
        </div >
    )
}

export default Products