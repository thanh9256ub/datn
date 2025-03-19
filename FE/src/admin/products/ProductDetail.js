import { QRCodeCanvas } from 'qrcode.react';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { getProductDetailByProductId, updateProductDetail } from './service/ProductDetailService';
import { Spinner } from 'react-bootstrap';
import Switch from 'react-switch';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';

const ProductDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const [productDetails, setProductDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const productName = location.state?.productName || "";

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        setLoading(true);
        try {
            const response = await getProductDetailByProductId(id);
            setProductDetails(response.data.data);
            console.log(response.data.data)
            setLoading(false);
        } catch (error) {
            console.log("Lỗi lấy dữ liệu product details: ", error);
            setLoading(false);
        }
    }

    const handleStatusChange = (index) => {
        const updatedDetails = [...productDetails];
        updatedDetails[index].status = updatedDetails[index].status === 1 ? 0 : 1;
        setProductDetails(updatedDetails);

        updateProductDetail(
            updatedDetails[index].id,
            updatedDetails[index].quantity,
            updatedDetails[index].status
        );
    };

    return (
        <div>
            <div className="page-header">
                <h3 className="page-title">
                    Chi tiết sản phẩm: {productName}
                </h3>
            </div>
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                                    <Spinner animation="border" variant="primary" />
                                    <span className="ml-2">Đang tải dữ liệu...</span>
                                </div>
                            ) : productDetails.length > 0 ? (
                                <table className='table' style={{ tableLayout: 'fixed', width: '100%' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ width: '50px' }}>#</th>
                                            <th>Thương hiệu</th>
                                            <th>Danh mục</th>
                                            <th>Chất liệu</th>
                                            <th>Màu sắc</th>
                                            <th>Kích cỡ</th>
                                            <th>Số lượng</th>
                                            <th>Giá</th>
                                            <th>QR Code</th>
                                            <th>Trạng thái</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {productDetails.map((productDetail, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td style={{ textAlign: 'center' }}>{productDetail.product.brand.brandName}</td>
                                                <td>{productDetail.product.category.categoryName}</td>
                                                <td>{productDetail.product.material.materialName}</td>
                                                <td>{productDetail.color.colorName}</td>
                                                <td>{productDetail.size.sizeName}</td>
                                                <td>{productDetail.quantity}</td>
                                                <td>{productDetail.price}</td>
                                                <td>
                                                    {productDetail.qr ? (
                                                        <QRCodeCanvas value={productDetail.qrCode} size={50} />
                                                    ) : (
                                                        <span className="text-muted">Chưa có QR</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`badge ${productDetail.status === 1 ? 'badge-success' : 'badge-danger'}`} style={{ padding: '7px' }}>
                                                        {productDetail.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <Switch
                                                        checked={productDetail.status === 1}
                                                        onChange={() => handleStatusChange(index)}
                                                        offColor="#888"
                                                        onColor="#0d6efd"
                                                        uncheckedIcon={false}
                                                        checkedIcon={false}
                                                        height={20}
                                                        width={40}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-center">Không có biến thể nào.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail