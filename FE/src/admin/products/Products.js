import React, { useEffect, useState } from 'react';
import { getProducts } from './service/ProductService';
import { useHistory } from 'react-router-dom';
import { Alert, Button, Modal, Table } from 'react-bootstrap';
import { getProductDetailByProductId } from './service/ProductDetailService';

const Products = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [selectedProductDetails, setSelectedProductDetails] = useState([]);
    const [selectedProductName, setSelectedProductName] = useState("");

    const history = useHistory();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts();
                setProducts(response.data.data);
            } catch (err) {
                setError('Đã xảy ra lỗi khi tải sản phẩm.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();

        const message = localStorage.getItem("successMessage");
        if (message) {
            setSuccessMessage(message);
            localStorage.removeItem("successMessage");
        }
    }, []);

    const handleAddProduct = () => {
        history.push('/admin/products/add');
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

<<<<<<< HEAD
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

=======
>>>>>>> parent of ffb91c3 (Merge branch 'long' of https://github.com/thanh9256ub/datn into long)
    return (
        <div>
            <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title">Danh sách sản phẩm</h3>
                        <div className='row'>
                            <div className='col-md-10'></div>
                            <div className='col-md-2'>
                                <button type="button" className="btn btn-primary" onClick={handleAddProduct}>
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
                            <div>Đang tải sản phẩm...</div>
                        ) : error ? (
                            <div className="text-danger">{error}</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Mã sản phẩm</th>
                                            <th>Tên sản phẩm</th>
                                            <th>Thương hiệu</th>
                                            <th>Danh mục</th>
                                            <th>Chất liệu</th>
                                            <th>Ảnh chính</th>
                                            <th>Tổng số lượng</th>
                                            <th>Trạng thái</th>
                                            <th>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.length > 0 ? (
                                            products.map((product, index) => (
                                                <tr key={product.id}>
                                                    <td>{index + 1}</td>
                                                    <td>{product.productCode}</td>
                                                    <td>{product.productName}</td>
                                                    <td>{product.brand.brandName}</td>
                                                    <td>{product.category.categoryName}</td>
                                                    <td>{product.material.materialName}</td>
                                                    <td>
                                                        <span>img.png</span>
                                                    </td>
                                                    <td>{product.totalQuantity}</td>
                                                    <td>
                                                        <span className={`badge ${product.status === 1 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '7px' }}>
                                                            {product.status === 1 ? 'Hoạt động' : 'Ngừng bán'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-warning btn-sm" onClick={() => handleShowProductDetail(product.id, product.productName)}>
                                                            <i className='mdi mdi-eye'></i>
                                                        </button>
                                                        <button className="btn btn-danger btn-sm ml-2">
                                                            <i className='mdi mdi-border-color'></i>
                                                        </button>
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

            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết sản phẩm: {selectedProductName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedProductDetails.length > 0 ? (
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Màu sắc</th>
                                    <th>Kích cỡ</th>
                                    <th>Số lượng</th>
                                    <th>Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedProductDetails.map((variant, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{variant.color.colorName}</td>
                                        <td>{variant.size.sizeName}</td>
                                        <td>{variant.quantity}</td>
                                        <td>{variant.price}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p className="text-center">Không có biến thể nào.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Products