import React, { useEffect, useState } from 'react';
import { getProducts } from './service/ProductService';
import { useHistory } from 'react-router-dom';

const Products = () => {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    }, []);

    const handleAddProduct = () => {
        history.push('/admin/products/add');
    }

    return (
        <div>
            <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title">Danh sách sản phẩm</h3>
                        <button type="button" className="btn btn-primary" onClick={handleAddProduct}>
                            <i className='mdi mdi-plus'></i> Thêm mới
                        </button>
                        <div style={{ marginBottom: '20px' }}></div>
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
                                                        <button className="btn btn-warning btn-sm">
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
        </div>
    )
}

export default Products