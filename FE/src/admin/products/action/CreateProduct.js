import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import BrandContainer from '../components/BrandContainer';
import CategoryContainer from '../components/CategoryContainer';
import MaterialContainer from '../components/MaterialContainer';
import ColorSelect from '../components/ColorContainer';
import SizeSelect from '../components/SizeContainer';
import ListAutoVariant from '../components/ListAutoVariant';
import { createProductDetail, updateQR } from '../service/ProductDetailService';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import MainImage from '../components/MainImage';
import { createProduct, getProductList, uploadImageToCloudinary } from '../service/ProductService';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const CreateProduct = () => {
    const [productName, setProductName] = useState("");
    const [brandId, setBrandId] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [materialId, setMaterialId] = useState(null);
    const [description, setDescription] = useState("");
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [status, setStatus] = useState(0);
    const [colorIds, setColorIds] = useState([]);
    const [sizeIds, setSizeIds] = useState([]);
    const [variantList, setVariantList] = useState([]);
    const [errors, setErrors] = useState({});

    const [showModal, setShowModal] = useState(false);

    const [commonQuantity, setCommonQuantity] = useState("");
    const [commonPrice, setCommonPrice] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [productData, setProductData] = useState({
        productName,
        brandId,
        categoryId,
        materialId,
        description,
        totalQuantity,
        status,
        mainImage: ''
    });

    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProductList()
            .then((response) => {
                console.log("API response:", response.data);
                const productsData = response.data.data;

                if (Array.isArray(productsData)) {
                    setProducts(productsData);
                } else {
                    setProducts([]);
                }
            })
            .catch((error) => {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
                setProducts([]);
            });
    }, []);

    useEffect(() => {
        if (productName.trim() === "") {
            setErrorMessage("");
            return;
        }

        const normalizedProductName = productName.trim().replace(/\s+/g, ' ');
        const exists = products.some(product =>
            product.productName.trim().replace(/\s+/g, ' ').toLowerCase() === normalizedProductName.toLowerCase()
        );

        if (exists) {
            setErrorMessage("Tên sản phẩm đã tồn tại!");
        } else {
            setErrorMessage("");
        }
    }, [productName, products]);


    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setCommonQuantity("");
        setCommonPrice("");
    };

    const handleColorChange = (colors) => {
        setColorIds(colors || []);
        console.log(colorIds)
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
                    color: {
                        colorName: color.label,
                        colorCode: color.colorCode,
                        id: color.value
                    },
                    colorId: color.value,
                    size: {
                        sizeName: size.label,
                        id: size.value
                    },
                    sizeId: size.value,
                    quantity: '',
                    price: '',
                    qr: `${productName}-${size.value}-${color.value}`,
                    images: []
                });
            });
        });

        setVariantList(newVariants);
    };

    const handleInputChange = (index, field, value) => {
        const maxQuantity = 1000000;
        const maxPrice = 100000000;

        if (value === '') {
            const updatedVariants = [...variantList];
            updatedVariants[index] = { ...updatedVariants[index], [field]: '' };
            setVariantList(updatedVariants);
            return;
        }
        const numericValue = parseFloat(value);
        if (isNaN(numericValue)) {
            return;
        }

        if (field === 'quantity') {
            if (numericValue > maxQuantity) {
                value = maxQuantity.toString();
            } else if (numericValue < 0) {
                value = "0";
            }
        } else if (field === 'price') {
            if (numericValue > maxPrice) {
                value = maxPrice.toString();
            } else if (numericValue < 0) {
                value = "0";
            }
        }
        const updatedVariants = [...variantList];
        updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        setVariantList(updatedVariants);
    };

    const handleRemoveVariant = (index) => {
        setVariantList(prevVariants => {
            let updatedVariants = [...prevVariants];
            const removedVariant = updatedVariants[index];

            const sameColorVariants = updatedVariants.filter(v => v.colorId === removedVariant.colorId);

            if (sameColorVariants.length > 1 && sameColorVariants[0] === removedVariant) {
                sameColorVariants[1].imageUrls = removedVariant.imageUrls;
                sameColorVariants[1].images = removedVariant.images;
            }

            updatedVariants.splice(index, 1);

            if (!updatedVariants.some(v => v.colorId === removedVariant.colorId)) {
                updatedVariants = updatedVariants.map(v =>
                    v.colorId === removedVariant.colorId ? { ...v, imageUrls: [] } : v
                );
            }

            const remainingVariantsWithColor = updatedVariants.filter(v => v.colorId === removedVariant.colorId);
            if (remainingVariantsWithColor.length === 0) {
                setColorIds(prev => prev.filter(c => c.value !== removedVariant.colorId));
            }

            const remainingVariantsWithSize = updatedVariants.some(v => v.sizeId === removedVariant.sizeId);
            if (!remainingVariantsWithSize) {
                setSizeIds(prev => prev.filter(s => s.value !== removedVariant.sizeId));
            }

            return updatedVariants;
        });
    };

    const handleImageChange = (index, event) => {
        const files = Array.from(event.target.files);

        if (files.length > 6) {
            toast.error("Bạn chỉ có thể chọn tối đa 6 ảnh.");
            return;
        }

        const imageUrls = files.map(file => URL.createObjectURL(file));

        setVariantList(prevVariants => {
            const selectedColorId = prevVariants[index].colorId;
            let updatedVariants = [...prevVariants];

            // Chỉ cập nhật ảnh cho biến thể đầu tiên có màu đó
            const firstIndex = updatedVariants.findIndex(v => v.colorId === selectedColorId);
            if (firstIndex !== -1) {
                updatedVariants[firstIndex] = {
                    ...updatedVariants[firstIndex],
                    imageUrls,
                    images: files
                };
            }

            return updatedVariants;
        });
    };

    const handleFileChange = (file) => {
        setProductData({ ...productData, mainImage: file });
    };

    useEffect(() => {
        const total = variantList.reduce((sum, variant) => sum + (parseInt(variant.quantity) || 0), 0);
        setTotalQuantity(total);
        setStatus(total > 0 ? 1 : 0);
    }, [variantList]);

    const history = useHistory();

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
                qr: detail.qr || `${detail.id}`
            }));

            setVariantList(updatedVariants);
            setTotalQuantity(productDetailResponse.data.totalQuantity);
            setStatus(productDetailResponse.data.totalQuantity > 0 ? 1 : 0);
        } catch (error) {
            console.error("Lỗi khi tạo biến thể:", error);
            alert("Lỗi khi tạo biến thể, kiểm tra console log!");
        }
    };

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isSaving) {
                toast.error('Vui lòng đợi quá trình lưu hoàn tất trước khi rời khỏi trang');
                e.preventDefault();
                e.returnValue = 'Bạn đang trong quá trình lưu sản phẩm. Bạn có chắc chắn muốn rời khỏi trang?';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [isSaving]);

    const saveProduct = async () => {

        const result = await Swal.fire({
            title: "Xác nhận",
            text: "Bạn có chắc chắn muốn thêm sản phẩm này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
        });

        if (!result.isConfirmed) return;

        try {
            const uploadedImageUrl = await uploadImageToCloudinary(productData.mainImage);

            if (!uploadedImageUrl) {
                alert("Lỗi khi tải ảnh lên Cloudinary.");
                return;
            }

            const productRequest = {
                productName,
                brandId: brandId ? parseInt(brandId) : null,
                categoryId: categoryId ? parseInt(categoryId) : null,
                materialId: materialId ? parseInt(materialId) : null,
                description,
                totalQuantity,
                status,
                mainImage: uploadedImageUrl
            };

            const productResponse = await createProduct(productRequest);
            console.log("productResponse:", productResponse);
            const productId = productResponse.data.id;
            console.log("Sản phẩm được tạo:", productResponse.data.data);

            const colorIdsFromVariants = [...new Set(variantList.map(v => v.colorId))];

            const productColorMapping = await createProductColor(productId, colorIdsFromVariants);

            if (!Array.isArray(productColorMapping) || productColorMapping.length === 0) {
                alert("Lỗi: Không lấy được ProductColorId.");
                return;
            }

            console.log("Mapping giữa productColorId và colorId:", productColorMapping);

            if (variantList.length > 0) {
                await createProductDetails(productId);

                await handleImagesForProductColors(productColorMapping);
            }

            localStorage.setItem("successMessage", "Sản phẩm đã được thêm thành công!");
            history.push('/admin/products');
        } catch (error) {
            console.error("Lỗi khi lưu sản phẩm:", error);
            alert("Lưu sản phẩm thất bại! Kiểm tra console log.");
        }
    };

    const createProductColor = async (productId, colorIds) => {
        if (!colorIds || colorIds.length === 0 || colorIds.includes(null)) {
            alert("Vui lòng chọn màu hợp lệ.");
            return [];
        }

        try {
            const response = await axios.post('http://localhost:8080/product-color/add', {
                productId: parseInt(productId),
                colorIds: colorIds.map(id => parseInt(id))
            });

            if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
                const productColorMapping = response.data.data.map(color => ({
                    productColorId: color.id,  // Lấy productColorId
                    colorId: color.color.id     // Lấy colorId từ color object
                }));

                console.log("Danh sách ProductColor đã tạo:", productColorMapping);
                return productColorMapping;
            } else {
                console.error("Không có dữ liệu trả về hoặc dữ liệu không hợp lệ:", response);
                alert("Không có dữ liệu ProductColor trả về.");
                return [];
            }
        } catch (error) {
            console.error("Lỗi khi tạo ProductColor:", error);
            alert("Lỗi khi tạo ProductColor!");

            if (error.response) {
                console.log('Response Error Data:', error.response.data);
                console.log('Response Error Status:', error.response.status);
            }

            return [];
        }
    };

    const handleImagesForProductColors = async (productColorMapping) => {
        try {
            for (const { productColorId, colorId } of productColorMapping) {
                const imagesForColor = variantList
                    .filter(variant => variant.colorId === colorId)
                    .flatMap(variant => variant.images || []);

                if (imagesForColor.length === 0) continue;

                const uploadedImageUrls = await Promise.all(
                    imagesForColor.map(imageFile => uploadImageToCloudinary(imageFile))
                );

                await axios.post(`http://localhost:8080/product-color/add-images/${productColorId}`,
                    uploadedImageUrls.map(url => ({ image: url }))
                );

                console.log(`Ảnh đã được gán vào productColorId ${productColorId}:`, uploadedImageUrls);
            }
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên Cloudinary hoặc lưu vào ProductColor:", error);
            alert("Lỗi khi tải ảnh lên Cloudinary hoặc lưu vào ProductColor.");
        }
    };

    const isEmpty = (value) => value.trim() === "";

    const isExceedLimit = (value, limit) => {
        const num = parseFloat(value);
        return isNaN(num) || num < 0 || num > limit;
    };

    const updateAllVariants = () => {
        if (isEmpty(commonQuantity) && isEmpty(commonPrice)) {
            toast.error("Vui lòng nhập ít nhất một giá trị!");
            return;
        }

        if (!isEmpty(commonQuantity)) {
            if (isExceedLimit(commonQuantity, 1000000)) {
                toast.error("Số lượng quá lớn! Vui lòng nhập giá trị từ 0 đến 1 triệu.");
                return;
            }
        }

        if (!isEmpty(commonPrice)) {
            if (isExceedLimit(commonPrice, 100000000)) {
                toast.error("Giá quá lớn! Vui lòng nhập giá trị từ 0 đến 100 triệu.");
                return;
            }
        }

        const updatedVariants = variantList.map(variant => ({
            ...variant,
            quantity: commonQuantity.trim() !== "" ? parseInt(commonQuantity, 10) : variant.quantity,
            price: commonPrice.trim() !== "" ? parseFloat(commonPrice) : variant.price
        }));

        setVariantList(updatedVariants);  // Cập nhật state
        handleCloseModal();  // Đóng modal
    };

    const handleSaveClick = async () => {
        if (isSaving) return;

        let newErrors = {};

        if (errorMessage) {
            toast.error(errorMessage);
            return;
        }

        if (!productName.trim()) newErrors.productName = "Tên sản phẩm không được để trống";
        if (!brandId) newErrors.brandId = "Vui lòng chọn thương hiệu";
        if (!categoryId) newErrors.categoryId = "Vui lòng chọn danh mục";
        if (!materialId) newErrors.materialId = "Vui lòng chọn chất liệu";
        if (!description.trim()) newErrors.description = "Mô tả không được để trống";
        if (!productData.mainImage) newErrors.mainImage = "Vui lòng chọn ảnh chính";
        if (!variantList.length) newErrors.variantList = "Vui lòng thêm ít nhất một biến thể";

        if (!colorIds.length) newErrors.colorIds = "Vui lòng chọn ít nhất một màu!";
        if (!sizeIds.length) newErrors.sizeIds = "Vui lòng chọn ít nhất một kích cỡ!";

        variantList.forEach((variant, index) => {
            const variantInfo = `Biến thể (Màu: ${variant.color.colorName}, Size: ${variant.size.sizeName})`;

            if (!variant.colorId) newErrors[`colorId_${index}`] = `${variantInfo}: Chưa chọn màu sắc`;
            if (!variant.sizeId) newErrors[`sizeId_${index}`] = `${variantInfo}: Chưa chọn kích cỡ`;

            if (!variant.price) {
                newErrors[`price_${index}`] = `${variantInfo}: Chưa nhập giá`;
            } else if (variant.price <= 0) {
                newErrors[`price_${index}`] = `${variantInfo}: Giá phải lớn hơn 0`;
            }

            if (!variant.quantity) {
                newErrors[`quantity_${index}`] = `${variantInfo}: Chưa nhập số lượng`;
            } else if (variant.quantity < 0) {
                newErrors[`quantity_${index}`] = `${variantInfo}: Số lượng phải lớn hơn 0`;
            }
        });

        colorIds.forEach(color => {
            const colorName = color.label;

            const hasImages = variantList.some(v => v.colorId === color.value && v.imageUrls?.length > 0);

            if (!hasImages) {
                newErrors[`images_${color.value}`] = `Màu ${colorName}: Cần tải lên ít nhất một ảnh!`;
            }
        });
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            Object.values(newErrors).forEach((error) => {
                toast.error(error);
            });
            return;
        }

        setIsSaving(true);

        try {
            await saveProduct();
        } catch (error) {
            console.error('Lỗi khi lưu sản phẩm:', error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div>
            <div className="row">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <h3 className="card-title">Thêm mới sản phẩm</h3>
                                <button
                                    type="button"
                                    className="btn btn-link"
                                    style={{ padding: "0px", marginBottom: "10px" }}
                                    onClick={() => history.push('/admin/products')}
                                >
                                    <i className="mdi mdi-subdirectory-arrow-left"></i>
                                    Quay lại
                                </button>
                            </div>
                            <hr />
                            <div style={{ marginBottom: '50px' }}></div>
                            <form className="form-sample">
                                <div className="row">
                                    <div className='col-md-8'>
                                        <div className="col-md-12">
                                            <Form.Group className="row d-flex align-items-center">
                                                <label className="col-sm-3 col-form-label">Tên sản phẩm:</label>
                                                <div className="col-sm-9">
                                                    <Form.Control
                                                        type="text"
                                                        value={productName || ""}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (value.length <= 255) {
                                                                setProductName(value);
                                                                setErrorMessage("");
                                                            } else {
                                                                setErrorMessage("Tên sản phẩm không được vượt quá 255 ký tự.");
                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            // Tự động chuẩn hóa khi rời khỏi trường nhập
                                                            const normalizedValue = e.target.value.trim().replace(/\s+/g, ' ');
                                                            setProductName(normalizedValue);
                                                        }}
                                                        placeholder='Nhập tên sản phẩm'
                                                        required
                                                        maxLength={255}
                                                        style={{
                                                            fontSize: '16px',
                                                        }}
                                                    />
                                                    {errorMessage && <small style={{ color: "red" }}>{errorMessage}</small>}
                                                </div>
                                            </Form.Group>
                                        </div>
                                        <div className="col-md-12">
                                            <BrandContainer brandId={brandId} setBrandId={setBrandId} />
                                        </div>
                                        <div className="col-md-12">
                                            <CategoryContainer categoryId={categoryId} setCategoryId={setCategoryId} />
                                        </div>
                                        <div className="col-md-12">
                                            <MaterialContainer materialId={materialId} setMaterialId={setMaterialId} />
                                        </div>
                                    </div>
                                    <div className="col-md-4" style={{ display: 'grid', placeItems: 'center' }}>
                                        <center>
                                            <div className='col-md-12'>
                                                <MainImage setMainImage={handleFileChange} initialImage={productData.mainImage} />
                                            </div>
                                        </center>
                                    </div>
                                    <div className='col-md-12'>
                                        <div className='col-md-12'>
                                            <Form.Group>
                                                <label htmlFor="exampleTextarea1">Mô tả:</label>
                                                <div style={{ marginBottom: '10px' }}></div>
                                                <textarea className="form-control" id="exampleTextarea1" rows="4" onChange={(e) => setDescription(e.target.value)}></textarea>
                                            </Form.Group>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <h5><span>Sản phẩm biến thể:</span></h5>
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
                            <div className='row'>
                                <div className='col-md-9'></div>
                                <div className='col-md-3'>
                                    {variantList.length > 0 && (
                                        <button type="button" className="btn btn-primary btn-sm float-right" onClick={handleOpenModal}>
                                            + Thêm thuộc tính chung
                                        </button>
                                    )}
                                </div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className='col-md-12'>
                                    <ListAutoVariant
                                        variantList={variantList}
                                        handleInputChange={handleInputChange}
                                        handleRemoveVariant={handleRemoveVariant}
                                        onImagesSelected={handleImageChange}
                                        setVariantList={setVariantList}
                                        errors={errors}
                                    />
                                </div>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-end mt-4">

                                <button
                                    type="button"
                                    className="btn btn-primary btn-icon-text"
                                    onClick={handleSaveClick}
                                    disabled={isSaving}
                                >
                                    <i className="mdi mdi-file-check btn-icon-prepend"></i>
                                    {isSaving ? 'Đang lưu...' : 'Lưu'}
                                </button>
                            </div>
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

            <ToastContainer />
        </div>
    );
}

export default CreateProduct;