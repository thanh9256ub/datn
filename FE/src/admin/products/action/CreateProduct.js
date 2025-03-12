import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import BrandSelect from '../select/BrandSelect';
import CategorySelect from '../select/CategorySelect';
import MaterialSelect from '../select/MaterialSelect';
import ColorSelect from '../select/ColorSelect';
import SizeSelect from '../select/SizeSelect';
import ListAutoVariant from '../components/ListAutoVariant';
import { createProductDetail, updateQR } from '../service/ProductDetailService';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import MainImage from '../components/MainImage';
import { createProduct, uploadImageToCloudinary } from '../service/ProductService';

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

    const [showModal, setShowModal] = useState(false);

    const [commonQuantity, setCommonQuantity] = useState("");
    const [commonPrice, setCommonPrice] = useState("");

    // const [mainImage, setMainImage] = useState(null);

    const [productData, setProductData] = useState({
        productName,
        brandId,
        categoryId,
        materialId,
        totalQuantity,
        status,
        mainImage: ''
    });

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setCommonQuantity("");
        setCommonPrice("");
    };

    const handleColorChange = (colors) => {
        setColorIds(colors || []);
        generateVariants(colors, sizeIds);
    };

    const handleSizeChange = (sizes) => {
        setSizeIds(sizes || []);
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
                    sizeId: size.value, quantity: 0,
                    price: '',
                    qr: `${productName}-${size.value}-${color.value}`
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

    const handleRemoveVariant = (index) => {
        const updatedVariants = [...variantList];
        updatedVariants.splice(index, 1); // Xóa biến thể theo index
        setVariantList(updatedVariants);
    };

    useEffect(() => {
        const total = variantList.reduce((sum, variant) => sum + (parseInt(variant.quantity) || 0), 0);
        setTotalQuantity(total);
        setStatus(total > 0 ? 1 : 0);
    }, [variantList]);

    const history = useHistory();

    // const createProductData = () => {
    //     return {
    //         productName,
    //         brandId: brandId ? parseInt(brandId) : null,
    //         categoryId: categoryId ? parseInt(categoryId) : null,
    //         materialId: materialId ? parseInt(materialId) : null,
    //         mainImage: mainImage,
    //         totalQuantity,
    //         status
    //     }
    // }

    const createProductDetails = async (productId) => {
        const variantData = variantList.map(variant => {
            return {
                productId,
                colorId: variant.colorId,
                sizeId: variant.sizeId,
                quantity: parseInt(variant.quantity) || 0,
                price: parseFloat(variant.price) || 0,
                qr: ''
            }
        });
        console.log("Gửi biến thể:", variantData);

        try {
            const productDetailResponse = await createProductDetail(productId, variantData);

            const variantsData = productDetailResponse?.data?.data || [];


            if (!Array.isArray(variantsData)) {
                console.error("Dữ liệu trả về không hợp lệ:", variantsData);
                alert("Dữ liệu biến thể không hợp lệ!");
                return;
            }

            await Promise.all(variantsData.map(async (variant) => {
                await updateQR(variant.id);
            }));

            const updatedVariants = variantsData.map(detail => ({
                ...detail,
                qrCode: detail.qr || `QR-${detail.id}`
            }));

            setVariantList(updatedVariants);
            setTotalQuantity(productDetailResponse.data.totalQuantity);
            setStatus(productDetailResponse.data.totalQuantity > 0 ? 1 : 0);
        } catch (error) {
            console.error("Lỗi khi tạo biến thể:", error);
            alert("Lỗi khi tạo biến thể, kiểm tra console log!");
        }
    };

    const saveProduct = async () => {
        if (!productName || !brandId || !categoryId || !materialId || !productData.mainImage) {
            alert("Vui lòng nhập đầy đủ thông tin sản phẩm và ảnh chính!");
            return;
        }

        const isConfirmed = window.confirm("Bạn có chắc chắn muốn thêm sản phẩm này?");
        if (!isConfirmed) return;

        try {
            // const productData = createProductData();
            // console.log("Dữ liệu gửi lên API:", productData);
            const uploadedImageUrl = await uploadImageToCloudinary(productData.mainImage);

            if (!uploadedImageUrl) {
                alert("Lỗi khi tải ảnh lên Cloudinary.");
                return;
            }

            const productRequest = {
                productName,
                brandId,
                categoryId,
                materialId,
                totalQuantity,
                status,
                mainImage: uploadedImageUrl
            };

            // const productResponse = await createProduct(mainImage, productData);
            const productResponse = await createProduct(productRequest);
            const productId = productResponse.data.data.id;
            console.log("Sản phẩm được tạo:", productResponse.data.data);

            if (variantList.length > 0) {
                await createProductDetails(productId);
            }

            localStorage.setItem("successMessage", "Sản phẩm đã được thêm thành công!");
            history.push('/admin/products');
        } catch (error) {
            console.error("Lỗi khi lưu sản phẩm:", error);
            alert("Lưu sản phẩm thất bại! Kiểm tra console log.");
        }
    };

    const updateAllVariants = () => {
        if (commonQuantity.trim() === "" && commonPrice.trim() === "") {
            alert("Vui lòng nhập ít nhất một giá trị!");
            return;
        }

        const updatedVariants = variantList.map(variant => ({
            ...variant,
            quantity: commonQuantity.trim() !== "" ? parseInt(commonQuantity, 10) : variant.quantity,
            price: commonPrice.trim() !== "" ? parseFloat(commonPrice) : variant.price
        }));

        setVariantList(updatedVariants);
        handleCloseModal();
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSaveClick = async () => {
        if (isSaving) return; // Nếu đang lưu, không cho phép nhấn lại

        setIsSaving(true); // Đánh dấu là đang lưu

        try {
            // Giả sử saveProduct là một hàm lưu dữ liệu
            await saveProduct();
        } catch (error) {
            console.error('Lỗi khi lưu sản phẩm:', error);
        } finally {
            setIsSaving(false); // Hoàn thành, bật lại nút
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
                            <div style={{ marginBottom: '20px' }}></div>
                            <form className="form-sample">
                                <div className="row">
                                    <div className="col-md-6">
                                        {/* <MainImage setMainImage={setMainImage} /> */}
                                        <MainImage setMainImage={(url) => setProductData({ ...productData, mainImage: url })} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Group className="row d-flex align-items-center">
                                            <label className="col-sm-3 col-form-label">Tên sản phẩm:</label>
                                            <div className="col-sm-9">
                                                <Form.Control type="text" value={productName || ""} onChange={(e) => setProductName(e.target.value)} />
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
                                <button type="button" className="btn btn-primary" onClick={handleOpenModal}>
                                    + Thêm thuộc tính chung
                                </button>
                                <hr />
                                <div className="row">
                                    <div className='col-md-6'>
                                        <ListAutoVariant
                                            variantList={variantList}
                                            handleInputChange={handleInputChange}
                                            handleRemoveVariant={handleRemoveVariant}
                                        />
                                    </div>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-end mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-secondary btn-icon-text"
                                        onClick={() => history.push('/admin/products')}
                                    >
                                        <i className="mdi mdi-subdirectory-arrow-left"></i>
                                        Quay lại
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-gradient-primary btn-icon-text"
                                        onClick={handleSaveClick}
                                        disabled={isSaving}
                                    >
                                        <i className="mdi mdi-file-check btn-icon-prepend"></i>
                                        {isSaving ? 'Đang lưu...' : 'Lưu'}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm thuộc tính chung</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Số lượng chung</Form.Label>
                        <Form.Control
                            type="number"
                            value={commonQuantity}
                            onChange={(e) => setCommonQuantity(e.target.value)}
                            placeholder="Nhập số lượng"
                        />
                    </Form.Group>
                    <Form.Group className="mt-3">
                        <Form.Label>Giá chung</Form.Label>
                        <Form.Control
                            type="number"
                            value={commonPrice}
                            onChange={(e) => setCommonPrice(e.target.value)}
                            placeholder="Nhập giá"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Hủy</Button>
                    <Button type="button" variant="primary" onClick={updateAllVariants}>
                        Thêm
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default CreateProduct;
