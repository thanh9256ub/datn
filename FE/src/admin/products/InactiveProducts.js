import React, { useEffect, useState } from 'react';
import { getInactiveProducts, updateStatus } from './service/ProductService';
import { Spinner } from 'react-bootstrap';
import Switch from 'react-switch';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InactiveProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await getInactiveProducts();
            setProducts(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải sản phẩm.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleToggleStatus = async (productId, currentStatus) => {
        try {
            const newStatus = currentStatus === 0 ? 1 : 0;
            await updateStatus(productId, newStatus);

            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === productId ? { ...product, status: newStatus } : product
                )
            );
            toast.success("Cập nhật trạng thái thành công!");

            fetchProducts();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
            toast.error("Cập nhật trạng thái thất bại!");
        }
    };

    return (
        <div>
            <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title"><i className='mdi mdi-archive'></i>KHO LƯU TRỮ</h3>
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
                                            <th>#</th>
                                            <th>Ảnh chính</th>
                                            {/* <th>Mã sản phẩm</th> */}
                                            <th>Tên sản phẩm</th>
                                            <th>Thương hiệu</th>
                                            <th>Danh mục</th>
                                            <th>Chất liệu</th>
                                            <th style={{ width: '50px' }}>Tổng số lượng</th>
                                            <th style={{ width: '150px' }}>Trạng thái</th>
                                            <th style={{ width: '100px' }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.length > 0 ? (
                                            products.map((product, index) => (
                                                <tr key={product.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <span>img.png</span>
                                                    </td>
                                                    {/* <td>{product.productCode}</td> */}
                                                    <td>{product.productName}</td>
                                                    <td>{product.brand.brandName}</td>
                                                    <td>{product.category.categoryName}</td>
                                                    <td>{product.material.materialName}</td>
                                                    <td>{product.totalQuantity}</td>
                                                    <td>
                                                        <span className={`badge ${product.status === 1 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '7px' }}>
                                                            {product.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                                        </span>
                                                    </td>
                                                    <td>
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
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center">Không có sản phẩm nào</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default InactiveProducts;
