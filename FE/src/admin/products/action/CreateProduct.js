import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import BrandSelect from '../select/BrandSelect';
import CategorySelect from '../select/CategorySelect';
import MaterialSelect from '../select/MaterialSelect';
import ColorSelect from '../select/ColorSelect';
import SizeSelect from '../select/SizeSelect';
import ListAutoVariant from '../components/ListAutoVariant';
import { createProduct } from '../service/ProductService';
import { createProductDetail } from '../service/ProductDetailService';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const CreateProduct = () => {
    const [productName, setProductName] = useState("");
    const [brandId, setBrandId] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [materialId, setMaterialId] = useState(null);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [status, setStatus] = useState(0);
    const [colorIds, setColorIds] = useState([]);
    const [sizeIds, setSizeIds] = useState([]);
    const [variantList, setVariantList] = useState([]);

    const handleColorChange = (colors) => {
        setColorIds(colors || []); // 🛠️ Đảm bảo không có giá trị `undefined`
        generateVariants(colors, sizeIds);
    };

    const handleSizeChange = (sizes) => {
        setSizeIds(sizes || []); // 🛠️ Đảm bảo không có giá trị `undefined`
        generateVariants(colorIds, sizes);
    };

    const generateVariants = (colors = [], sizes = []) => {
        if (!colors || !Array.isArray(colors)) colors = [];
        if (!sizes || !Array.isArray(sizes)) sizes = [];

        if (colors.length === 0 || sizes.length === 0) {
            setVariantList([]);
            return;
        }

        const newVariants = [];
        colors.forEach(color => {
            sizes.forEach(size => {
                newVariants.push({
                    color: color.label,
                    colorId: color.value,
                    size: size.label,
                    sizeId: size.value,
                    quantity: 0,
                    price: ''
                });
            });
        });

        setVariantList(newVariants);
    };

    const handleInputChange = (index, field, value) => {
        const updatedVariants = [...variantList];
        updatedVariants[index][field] = value;
        setVariantList(updatedVariants);
    };

    useEffect(() => {
        const total = variantList.reduce((sum, variant) => sum + (parseInt(variant.quantity) || 0), 0);
        setTotalQuantity(total);
        setStatus(total > 0 ? 1 : 0);
    }, [variantList]);

    const history = useHistory();

    const saveProduct = async () => {
        if (!productName || !brandId || !categoryId || !materialId) {
            alert("Vui lòng nhập đầy đủ thông tin sản phẩm!");
            return;
        }

        const isConfirmed = window.confirm("Bạn có chắc chắn muốn thêm sản phẩm này?");
        if (!isConfirmed) return;

        try {
            const productData = {
                productName,
                brandId: brandId ? parseInt(brandId) : null,
                categoryId: categoryId ? parseInt(categoryId) : null,
                materialId: materialId ? parseInt(materialId) : null,
                mainImage: "default.jpg",
                totalQuantity,
                status
            };

            console.log("Dữ liệu gửi lên API:", productData);

            const productResponse = await createProduct(productData);
            const productId = productResponse.data.data.id;
            console.log("Sản phẩm được tạo:", productResponse.data.data);

            if (variantList.length > 0) {
                const variantData = variantList.map(variant => ({
                    productId,
                    colorId: variant.colorId,
                    sizeId: variant.sizeId,
                    quantity: parseInt(variant.quantity) || 0,
                    price: parseFloat(variant.price) || 0
                }));

                console.log("Gửi biến thể:", variantData);
                const productDetailResponse = await createProductDetail(productId, variantData);

                setTotalQuantity(productDetailResponse.data.totalQuantity);
                setStatus(productDetailResponse.data.totalQuantity > 0 ? 1 : 0);

                console.log("Sản phẩm đã cập nhật số lượng và trạng thái!");
            }


            localStorage.setItem("successMessage", "Sản phẩm đã được thêm thành công!");
            history.push('/admin/products');
        } catch (error) {
            console.error("Lỗi khi lưu sản phẩm:", error);
            alert("Lưu sản phẩm thất bại! Kiểm tra console log.");
        }
    };

    return (
        <div>
            <div className="row">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title">Thêm mới sản phẩm</h3>
                            <hr />
                            <div style={{ marginBottom: '50px' }}></div>
                            <form className="form-sample">
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
                                        <Form.Group className="row">
                                            <label className="col-sm-3 col-form-label">Mô tả:</label>
                                            <div className="col-sm-9">
                                                <Form.Control type="text" />
                                            </div>
                                        </Form.Group>
                                    </div>
                                </div>
                                <div className="row">
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
                                <h6><span>Chọn các biến thể:</span></h6>
                                <hr />
                                <div className="row">
                                    <div className="col-md-6">
                                        <ColorSelect colorIds={colorIds} setColorIds={handleColorChange} />
                                    </div>
                                    <div className="col-md-6">
                                        <SizeSelect sizeIds={sizeIds} setSizeIds={handleSizeChange} />
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
                                <div className="col-md-3">
                                    <Form.Group className="row">
                                        <label className="col-sm-6 col-form-label">Tổng số lượng:</label>
                                        <div className="col-sm-6">
                                            <Form.Control type="text" value={totalQuantity} disabled />
                                        </div>
                                    </Form.Group>
                                </div>
                                <div className="col-md-3">
                                    <Form.Group className="row">
                                        <label className="col-sm-6 col-form-label">Trạng thái:</label>
                                        <div className="col-sm-6">
                                            <Form.Control type="text" value={status === 1 ? "Hoạt động" : "Ngừng bán"} disabled />
                                        </div>
                                    </Form.Group>
                                </div>
                                <hr />
                                <button type="button" className="btn btn-gradient-primary btn-icon-text" onClick={saveProduct}>
                                    <i className="mdi mdi-file-check btn-icon-prepend"></i>
                                    Save
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateProduct;
