import React from 'react'

const ProductInfo = ({ product }) => {
    return (
        <div>
            <div style={{ marginBottom: '20px' }}>
                <h4><strong>Thông tin sản phẩm:</strong></h4>
            </div>
            <hr />
            <div className="row">
                <div className='col-md-8'>
                    <div>
                        <strong>Mã sản phẩm:</strong> {product?.productCode ?? "Đang tải..."}
                    </div>
                    <div>
                        <strong>Tên sản phẩm:</strong> {product?.productName ?? "Đang tải..."}
                    </div>
                    <div><strong>Thương hiệu:</strong> {product?.brand?.brandName ?? "Đang tải..."}</div>
                    <div><strong>Danh mục:</strong> {product?.category?.categoryName ?? "Đang tải..."}</div>
                    <div><strong>Chất liệu:</strong> {product?.material?.materialName ?? "Đang tải..."}</div>
                    <div><strong>Ngày tạo:</strong> {product?.createdAt ?? "Đang tải..."}</div>
                    {/* <div className="col-md-12" style={{ maxWidth: "100%", overflow: "hidden" }}>
                                                <strong>Mô tả:</strong> {product?.description ?? "Đang tải..."}
                                            </div> */}
                </div>
                <div className='col-md-4' style={{ textAlign: 'center' }}>
                    <img
                        src={product.mainImage === "image.png" ? "" : product.mainImage}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default ProductInfo
