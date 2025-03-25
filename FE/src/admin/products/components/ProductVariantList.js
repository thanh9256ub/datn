import React, { useEffect } from 'react'
import { getImagesByProductColor } from '../service/ProductService';

const ProductVariantList = ({ productDetails, selectedVariant, setSelectedVariant, setColorImages, productColorList, id, handleVariantClick }) => {

    useEffect(() => {
        if (selectedVariant) {
            handleVariantClick(selectedVariant);
        }
    }, [selectedVariant]);

    return (
        <div>
            {/* <button type="button" className="btn btn-gradient-primary btn-sm float-right">
                Thêm biến thể
            </button> */}
            <div className='table-responsive'>
                <table className='table'>
                    <thead>
                        <tr>
                            <th>Danh sách biến thể:</th>
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
                                            <strong>Màu:</strong> {productDetail.color.colorName}<br />
                                            <small style={{ color: "#999" }}>Số lượng: {productDetail.quantity} </small>

                                        </td>
                                        <td>
                                            <strong>Kích cỡ:</strong> {productDetail.size.sizeName}<br />

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
        </div>
    )
}

export default ProductVariantList