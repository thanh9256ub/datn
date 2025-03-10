import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { getProductById, updateProduct, uploadImageToCloudinary } from '../service/ProductService';
import { getProductDetailByProductId, updateProductDetails } from '../service/ProductDetailService';
import BrandSelect from '../select/BrandSelect';
import CategorySelect from '../select/CategorySelect';
import MaterialSelect from '../select/MaterialSelect';
// import ColorSelect from '../select/ColorSelect';
// import SizeSelect from '../select/SizeSelect';
import ListAutoVariant from '../components/ListAutoVariant';
import MainImage from '../components/MainImage';

const UpdateProduct = () => {
    const { id } = useParams();
    const history = useHistory();

    const [productName, setProductName] = useState("");
    const [brandId, setBrandId] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [materialId, setMaterialId] = useState(null);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [status, setStatus] = useState(0);
    // const [colorIds, setColorIds] = useState([]);
    // const [sizeIds, setSizeIds] = useState([]);
    const [variantList, setVariantList] = useState([]);
    const [mainImage, setMainImage] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                const product = response.data.data;
                setProductName(product.productName);
                setBrandId(product.brand.id);
                setCategoryId(product.category.id);
                setMaterialId(product.material.id);
                setMainImage(product.mainImage)

                const variantResponse = await getProductDetailByProductId(id);
                console.log(variantResponse.data.data)
                setVariantList(variantResponse.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            }
        };

        fetchProduct();
    }, [id]);

    const handleInputChange = (index, field, value) => {
        const updatedVariants = [...variantList];
        updatedVariants[index][field] = value;
        setVariantList(updatedVariants);
    };

    const saveProduct = async () => {
        if (!productName || !brandId || !categoryId || !materialId || !mainImage) {
            alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
            return;
        }

        const isConfirmed = window.confirm("Bạn có chắc chắn muốn sửa sản phẩm này?");
        if (!isConfirmed) return;

        try {
            let imageUrl;

            if (mainImage && mainImage instanceof File) {
                imageUrl = await uploadImageToCloudinary(mainImage);
            }

            const productData = {
                productName,
                brandId: brandId ? parseInt(brandId) : null,
                categoryId: categoryId ? parseInt(categoryId) : null,
                materialId: materialId ? parseInt(materialId) : null,
                mainImage: imageUrl,
                totalQuantity,
                status
            };

            console.log("Dữ liệu gửi lên:", productData);

            const product = await updateProduct(id, productData);

            const formattedVariants = variantList.map(variant => ({
                id: variant.id,
                colorId: variant.color?.id || variant.color,
                sizeId: variant.size?.id || variant.size,
                quantity: Number(variant.quantity),
                price: Number(variant.price)
            }));

            console.log("Dữ liệu gửi lên API updateProductDetails:", formattedVariants);

            await updateProductDetails(id, formattedVariants);

            localStorage.setItem("successMessage", "Sản phẩm đã được cập nhật thành công!");
            history.push('/admin/products');
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            alert("Cập nhật sản phẩm thất bại!");
        }
    };

    return (
        <div>
            <div className="row">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title">Chỉnh sửa sản phẩm</h3>
                            <hr />
                            <form className="form-sample">
                                <div className="row">
                                    <div className="col-md-6">
                                        {/* <MainImage setMainImage={setMainImage} /> */}
                                        <MainImage setMainImage={setMainImage} initialImage={mainImage} />
                                    </div>
                                </div>
                                <div className="row">


                                    <div className="col-md-6">
                                        <Form.Group className="row">
                                            <label className="col-sm-3 col-form-label">Tên sản phẩm:</label>
                                            <div className="col-sm-9">
                                                <Form.Control type="text" value={productName} onChange={(e) => setProductName(e.target.value)} />
                                            </div>
                                        </Form.Group>
                                    </div>
                                    <div className="col-md-6">
                                        <BrandSelect brandId={brandId} setBrandId={setBrandId} />
                                    </div>
                                    <div className="col-md-6">
                                        <CategorySelect categoryId={categoryId} setCategoryId={setCategoryId} />
                                    </div>
                                    <div className="col-md-6">
                                        <MaterialSelect materialId={materialId} setMaterialId={setMaterialId} />
                                    </div>
                                </div>
                                <div style={{ marginBottom: '20px' }}></div>
                                <h6><span>Danh sách sản phẩm biến thể:</span></h6>
                                <hr />
                                <div className="row">
                                    <div className='col-md-6'>
                                        <ListAutoVariant variantList={variantList} handleInputChange={handleInputChange} />
                                    </div>
                                </div>
                                <hr />
                                <button type="button" className="btn btn-gradient-primary btn-icon-text" onClick={saveProduct}>
                                    <i className="mdi mdi-file-check btn-icon-prepend"></i>
                                    Update
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UpdateProduct