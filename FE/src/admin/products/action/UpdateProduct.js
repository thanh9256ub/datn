import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import { getImagesByProductColor, getProductById, getProductColorsByProductId, getProductList, updateProduct, uploadImageToCloudinary } from '../service/ProductService';
import { getProductDetailByProductId, updateProductDetails } from '../service/ProductDetailService';
import BrandContainer from '../components/BrandContainer';
import CategoryContainer from '../components/CategoryContainer';
import MaterialContainer from '../components/MaterialContainer';
// import ColorSelect from '../select/ColorSelect';
// import SizeSelect from '../select/SizeSelect';
import ListAutoVariant from '../components/ListAutoVariant';
import MainImage from '../components/MainImage';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

const UpdateProduct = () => {
    const { id } = useParams();
    const history = useHistory();

    const [productName, setProductName] = useState("");
    const [brandId, setBrandId] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [materialId, setMaterialId] = useState(null);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [status, setStatus] = useState(0);
    const [variantList, setVariantList] = useState([]);
    const [mainImage, setMainImage] = useState(null);
    const [hasError, setHasError] = useState(false);
    const [description, setDescription] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({});

    const [colorImages, setColorImages] = useState({});

    const [products, setProducts] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                const product = response.data.data;
                setProductName(product.productName);
                setBrandId(product.brand.id);
                setCategoryId(product.category.id);
                setMaterialId(product.material.id);
                setDescription(product.description);
                setMainImage(product.mainImage === "image.png" ? null : product.mainImage);
                setTotalQuantity(product.totalQuantity)

                const variantResponse = await getProductDetailByProductId(id);
                const variants = variantResponse.data.data || [];
                console.log("✅ Danh sách biến thể nhận được:", variants);

                const productColorsResponse = await getProductColorsByProductId(id);

                const productColors = productColorsResponse.data.data;
                console.log("🎨 Danh sách ProductColor:", productColors);

                const productColorList = Array.isArray(productColors) ? productColors : [];
                console.log("ProductColorList: ", productColorList)

                const imagePromises = variants.map(async (variant) => {
                    const variantColorId = variant.color ? variant.color.id : undefined;
                    console.log("Variant Color ID:", variantColorId);

                    const productColor = productColorList.find(color => color.color.id === variantColorId);
                    console.log("ProductColor: ", productColor)

                    if (productColor) {
                        console.log("ProductColor ID:", productColor.id);

                        const imagesResponse = await getImagesByProductColor(productColor.id);
                        console.log("Images for productColor:", imagesResponse.data);

                        return {
                            ...variant,
                            imageUrls: imagesResponse.data.data.map(image => image.image),
                        };
                    }

                    return { ...variant, imageUrls: [] };
                });

                const updatedVariants = await Promise.all(imagePromises);

                console.log("UpdateVariants: ", updatedVariants)
                setVariantList(updatedVariants);

            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu sản phẩm:", error);
            }
        };

        fetchProduct();
    }, [id]);

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
            && product.id != id
        );

        if (exists) {
            setErrorMessage("Tên sản phẩm đã tồn tại!");
        } else {
            setErrorMessage("");
        }
    }, [productName, products]);

    // const handleInputChange = (index, field, value) => {
    //     const updatedVariants = [...variantList];
    //     const updatedVariant = { ...updatedVariants[index], [field]: value };

    //     if (field === "quantity") {
    //         updatedVariant.quantityChanged = true;
    //     }

    //     if (field === "price") {
    //         updatedVariant.priceChanged = true;
    //     }

    //     updatedVariants[index] = updatedVariant;
    //     setVariantList(updatedVariants);
    // };
    const handleInputChange = (index, field, value) => {
        const maxQuantity = 1000000;
        const maxPrice = 100000000;

        if (value === '') {
            const updatedVariants = [...variantList];
            updatedVariants[index] = {
                ...updatedVariants[index],
                [field]: '',
                // Giữ lại các trạng thái changed
                quantityChanged: field === 'quantity' ? true : updatedVariants[index].quantityChanged,
                priceChanged: field === 'price' ? true : updatedVariants[index].priceChanged
            };
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
        updatedVariants[index] = {
            ...updatedVariants[index],
            [field]: value,
            // Đánh dấu đã thay đổi
            quantityChanged: field === 'quantity' ? true : updatedVariants[index].quantityChanged,
            priceChanged: field === 'price' ? true : updatedVariants[index].priceChanged
        };

        setVariantList(updatedVariants);
    };

    const saveProduct = async () => {
        const result = await Swal.fire({
            title: "Xác nhận",
            text: "Bạn có chắc chắn muốn sửa sản phẩm này?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
        });

        if (!result.isConfirmed) return;

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
                description,
                mainImage: imageUrl || mainImage,
                totalQuantity,
                status
            };

            console.log("Dữ liệu gửi lên:", productData);

            const product = await updateProduct(id, productData);

            const isVariantsChanged = variantList.some(variant =>
                variant.quantityChanged || variant.priceChanged
            );

            if (isVariantsChanged) {
                const formattedVariants = variantList.map(variant => ({
                    id: variant.id,
                    colorId: variant.color?.id || variant.color,
                    sizeId: variant.size?.id || variant.size,
                    quantity: Number(variant.quantity),
                    price: Number(variant.price),
                    status: variant.quantity === 0 ? 0 : 1
                }));

                console.log("Dữ liệu gửi lên API updateProductDetails:", formattedVariants);

                await updateProductDetails(id, formattedVariants);
            }

            await handleImagesForProductColors(id);

            localStorage.setItem("successMessage", "Sản phẩm đã được sửa thành công!");
            history.push('/admin/products');
        } catch (error) {
            console.error("Lỗi khi chỉnh sửa sản phẩm:", error);
            alert("Chỉnh sửa sản phẩm thất bại!");
        }
    };

    const handleImagesForProductColors = async (productId) => {
        try {
            const productColorsResponse = await getProductColorsByProductId(productId);
            const productColors = productColorsResponse.data.data;

            if (productColors && productColors.length > 0) {
                const imagePromises = productColors.map(async (productColor) => {
                    const productColorId = productColor.id;
                    console.log("ProductColors: ", productColors);
                    console.log("VariantList: ", variantList);

                    const variantWithColor = variantList.find(variant => variant.color.id === productColor.color.id);
                    console.log("Variant with color: ", variantWithColor)
                    if (variantWithColor && variantWithColor.images && variantWithColor.images.length > 0) {
                        const uploadedImageUrls = [];
                        for (const imageFile of variantWithColor.images) {
                            const imageUrl = await uploadImageToCloudinary(imageFile);

                            console.log("Image Url: ", imageUrl)
                            if (imageUrl) {
                                uploadedImageUrls.push(imageUrl);
                            }
                        }

                        if (uploadedImageUrls.length > 0) {
                            const imageRequests = uploadedImageUrls.map(url => ({ image: url }));
                            console.log(`Updating images for ProductColor ID: ${productColorId} with images:`, imageRequests);
                            await axios.put(`http://localhost:8080/product-color/update-images/${productColorId}`, imageRequests);
                        }
                    }
                });

                await Promise.all(imagePromises);
            }

        } catch (error) {
            console.error("Lỗi khi tải ảnh lên Cloudinary hoặc lưu vào ProductColor:", error);
            alert("Lỗi khi tải ảnh lên Cloudinary hoặc lưu vào ProductColor.");
        }
    };

    const handleImageChange = (index, event) => {
        const files = Array.from(event.target.files);

        if (files.length > 6) {
            toast.error("Bạn chỉ có thể chọn tối đa 6 ảnh.");
            return;
        }

        const imageUrls = files.map(file => URL.createObjectURL(file));

        setVariantList(prevVariants => {
            const updatedVariants = prevVariants.map((variant, idx) =>
                idx === index
                    ? { ...variant, images: files, imageUrls }
                    : variant
            );
            return updatedVariants;
        });
    };

    const validateProduct = () => {
        let newErrors = {};

        if (!productName.trim()) newErrors.productName = "Tên sản phẩm không được để trống";
        if (!brandId) newErrors.brandId = "Vui lòng chọn thương hiệu";
        if (!categoryId) newErrors.categoryId = "Vui lòng chọn danh mục";
        if (!materialId) newErrors.materialId = "Vui lòng chọn chất liệu";
        if (!description.trim()) newErrors.description = "Mô tả không được để trống";
        if (!mainImage || (mainImage instanceof File && mainImage.size === 0)) {
            newErrors.mainImage = "Vui lòng chọn ảnh chính";
        }

        if (!variantList.length) {
            newErrors.variantList = "Vui lòng thêm ít nhất một biến thể";
        } else {
            let colorImageMap = {};

            variantList.forEach((variant, index) => {
                const colorId = variant.color?.id || variant.color;
                const variantInfo = `Biến thể (Màu: ${variant.color.colorName}, Size: ${variant.size.sizeName})`;

                // if (!variant.price) {
                //     newErrors[`price_${index}`] = `${variantInfo}: Chưa nhập giá`;
                // } else if (variant.price <= 0) {
                //     newErrors[`price_${index}`] = `${variantInfo}: Giá phải lớn hơn 0`;
                // }

                if (variant.quantity == null || variant.quantity === '') {
                    newErrors[`quantity_${index}`] = `${variantInfo}: Chưa nhập số lượng`;
                } else if (variant.quantity < 0) {
                    newErrors[`quantity_${index}`] = `${variantInfo}: Số lượng phải lớn hơn 0`;
                }

                if (!colorImageMap[colorId]) {
                    colorImageMap[colorId] = [];
                }
                if (variant.imageUrls && variant.imageUrls.length > 0) {
                    colorImageMap[colorId].push(...variant.imageUrls);
                }
            });

            Object.keys(colorImageMap).forEach((colorId) => {
                const colorName = variantList.find(v => v.color.id === parseInt(colorId))?.color.colorName || "Không xác định";
                if (colorImageMap[colorId].length === 0) {
                    newErrors[`image_color_${colorId}`] = `Màu ${colorName} cần ít nhất một ảnh`;
                }
            });
        }



        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            Object.values(newErrors).forEach(error => toast.error(error));
            return false;
        }

        return true;
    };

    const handleSaveClick = async () => {
        if (isSaving) return;

        if (!validateProduct()) return;

        setIsSaving(true);

        await saveProduct();

        setIsSaving(false);
    };

    return (
        <div>
            <div className="row">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <h3 className="card-title">Chỉnh sửa sản phẩm</h3>
                                <button
                                    type="button"
                                    className="btn btn-link"
                                    style={{ padding: "0px", marginBottom: "10px" }}
                                    onClick={() => history.push(`/admin/products/${id}/detail`)}
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
                                            <Form.Group className="row">
                                                <label className="col-sm-3 col-form-label">Tên sản phẩm:</label>
                                                <div className="col-sm-9">
                                                    <Form.Control
                                                        type="text"
                                                        value={productName}
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
                                            <div className="col-md-12">
                                                <MainImage setMainImage={setMainImage} initialImage={mainImage} />
                                            </div>
                                        </center>
                                    </div>
                                    <div className='col-md-12'>
                                        <div className='col-md-12'>
                                            <Form.Group>
                                                <label htmlFor="exampleTextarea1">Mô tả:</label>
                                                <div style={{ marginBottom: '10px' }}></div>
                                                <textarea className="form-control" id="exampleTextarea1" rows="4" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
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
                            <h6><span>Danh sách sản phẩm biến thể:</span></h6>
                            <hr />
                            <div style={{ marginBottom: '50px' }}></div>
                            <div className="row">
                                <div className='col-md-12'>
                                    <ListAutoVariant
                                        variantList={variantList}
                                        handleInputChange={handleInputChange}
                                        // handleRemoveVariant={handleRemoveVariant}
                                        setHasError={setHasError}
                                        onImagesSelected={handleImageChange}
                                        setVariantList={setVariantList}
                                        colorImages={colorImages}
                                        errors={errors}
                                    />
                                </div>
                            </div>
                            <hr />
                            <button
                                type="button"
                                className="btn btn-gradient-primary btn-icon-text float-right"
                                onClick={handleSaveClick}
                                disabled={isSaving}
                            >
                                <i className="mdi mdi-file-check btn-icon-prepend"></i>
                                {isSaving ? "Đang lưu..." : "Lưu"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ToastContainer />
        </div>
    )
}

export default UpdateProduct
