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
import { createProduct, getProducts, uploadImageToCloudinary } from '../service/ProductService';
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
        getProducts()
            .then((response) => {
                setProducts(response.data.data);
            })
            .catch((error) => {
                console.error("Lỗi khi tải danh sách sản phẩm:", error);
            });
    }, []);

    useEffect(() => {
        if (productName.trim() === "") {
            setErrorMessage("");
            return;
        }

        const exists = products.some(product => product.productName.toLowerCase() === productName.toLowerCase());

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
                    color: color.label,
                    colorId: color.value,
                    size: size.label,
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
        const updatedVariants = [...variantList];
        updatedVariants[index] = { ...updatedVariants[index], [field]: value };
        setVariantList(updatedVariants);
    };

    //Cách 3:
    // const handleRemoveVariant = (index) => {
    //     setVariantList(prevVariants => {
    //         const updatedVariants = [...prevVariants];
    //         const removedVariant = updatedVariants[index];

    //         updatedVariants.splice(index, 1);

    //         const remainingVariantsWithColor = updatedVariants.filter(v => v.colorId === removedVariant.colorId);
    //         if (remainingVariantsWithColor.length === 0) {
    //             setColorIds(prev => prev.filter(c => c.value !== removedVariant.colorId));
    //             setColorImages(prev => {
    //                 const newColorImages = { ...prev };
    //                 delete newColorImages[removedVariant.colorId];
    //                 return newColorImages;
    //             });
    //         } else {
    //             if (index === 0 && colorImages[removedVariant.colorId]) {
    //                 const nextVariant = remainingVariantsWithColor[0];
    //                 setColorImages(prev => ({
    //                     ...prev,
    //                     [nextVariant.colorId]: prev[removedVariant.colorId]
    //                 }));
    //             }
    //         }


    //         const remainingVariantsWithSize = updatedVariants.some(v => v.sizeId === removedVariant.sizeId);
    //         if (!remainingVariantsWithSize) {
    //             setSizeIds(prev => prev.filter(s => s.value !== removedVariant.sizeId));
    //         }

    //         if (updatedVariants.length === 0) {
    //             setColorImages({});
    //         }

    //         return updatedVariants;
    //     });
    // };

    const handleRemoveVariant = (index) => {
        setVariantList(prevVariants => {
            let updatedVariants = [...prevVariants];
            const removedVariant = updatedVariants[index];

            updatedVariants.splice(index, 1);

            const hasSameColor = updatedVariants.some(v => v.colorId === removedVariant.colorId);

            if (!hasSameColor) {
                updatedVariants = updatedVariants.map(v =>
                    v.colorId === removedVariant.colorId ? { ...v, imageUrls: [] } : v
                );
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
            alert("Bạn chỉ có thể chọn tối đa 6 ảnh.");
            return;
        }

        const imageUrls = files.map(file => URL.createObjectURL(file));

        // setVariantList(prevVariants => {
        //     const updatedVariants = prevVariants.map((variant, idx) =>
        //         idx === index
        //             ? { ...variant, images: files, imageUrls }
        //             : variant
        //     );
        //     return updatedVariants;
        // });
        setVariantList(prevVariants => {
            const selectedColorId = prevVariants[index].colorId;

            return prevVariants.map(variant =>
                variant.colorId === selectedColorId
                    ? { ...variant, imageUrls, images: files }
                    : variant
            );
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
            const productId = productResponse.data.data.id;
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
            const variantInfo = `Biến thể (Màu: ${variant.color}, Size: ${variant.size})`;

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
                            <h3 className="card-title">Thêm mới sản phẩm</h3>
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
                                                        onChange={(e) => setProductName(e.target.value)}
                                                        placeholder='Nhập tên sản phẩm'
                                                        required
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
                                        <button type="button" className="btn btn-primary float-right" onClick={handleOpenModal}>
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
                                    {errors.variantList && <small className="text-danger">{errors.variantList}</small>}
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
