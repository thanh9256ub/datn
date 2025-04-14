import React, { useEffect, useState } from 'react';
import { deleteAndRestoreProducts, getProducts, searchProducts, updateStatus } from './service/ProductService';
import { useHistory } from 'react-router-dom';
import { Alert, Dropdown, ListGroup, Modal, Pagination, Spinner } from 'react-bootstrap';
import Switch from 'react-switch';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchProducts from './action/SearchProducts';
import Swal from 'sweetalert2';
import useWebSocket from '../../hook/useWebSocket';
import * as XLSX from 'xlsx';
import { Badge, Button } from 'antd';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const [showImageModal, setShowImageModal] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const { messages, isConnected } = useWebSocket("/topic/product-updates");

    const [filters, setFilters] = useState({
        name: '',
        brandId: '',
        categoryId: '',
        materialId: '',
        status: ''
    });

    const history = useHistory();
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [selectedProducts, setSelectedProducts] = useState([]);

    const [showFileManagerModal, setShowFileManagerModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewData, setPreviewData] = useState([]);
    const [previewHeaders, setPreviewHeaders] = useState([]);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [currentPreviewFile, setCurrentPreviewFile] = useState(null);

    const fetchProducts = async (page = currentPage, size = pageSize) => {
        setLoading(true);
        setError(null);
        try {
            const response = await getProducts(page, size);
            const data = response.data?.data;

            setProducts(data?.content || []);
            setTotalPages(data?.totalPages || 1);
        } catch (err) {
            console.error("Lỗi khi tải sản phẩm:", err);
            setError("Đã xảy ra lỗi khi tải sản phẩm.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(currentPage, pageSize);

        const message = localStorage.getItem("successMessage");
        if (message) {
            toast.success(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            localStorage.removeItem("successMessage");
        }

        history.push(`/admin/products?page=${currentPage}&size=${pageSize}`);
    }, [currentPage, pageSize]);

    useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            toast.info(lastMessage);
            fetchProducts();
        }
    }, [messages]);

    const handlePageChange = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
            fetchProducts(page);
            history.push(`/admin/products?page=${page}&size=${pageSize}`);
        }
    };

    const pageSizeOptions = [
        { value: 5, label: "5 sản phẩm" },
        { value: 10, label: "10 sản phẩm" },
        { value: 20, label: "20 sản phẩm" },
        { value: 50, label: "50 sản phẩm" }
    ];

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value));
        setCurrentPage(0);
    };

    const handleAddProduct = () => {
        history.push('/admin/products/add');
    }

    const handleProductDetail = (id) => {
        history.push(
            `/admin/products/${id}/detail`
        );
    }

    const handleToggleStatus = async (productId, currentStatus, totalQuantity) => {
        try {
            const result = await Swal.fire({
                title: "Xác nhận",
                text: "Bạn có chắc chắn muốn xoá sản phẩm này?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy",
                footer: "<p style='color: red;'>Lưu ý: Nếu đồng ý sản phẩm sẽ không thể bán trên quầy hàng và website!</p>",
            });

            if (!result.isConfirmed) return;

            let newStatus;

            if (currentStatus === 2) {
                newStatus = totalQuantity > 0 ? 1 : 0;
            } else {
                newStatus = 2;
            }

            await updateStatus(productId, newStatus);

            setProducts(prevProducts =>
                prevProducts.map(product =>
                    product.id === productId ? { ...product, status: newStatus } : product
                )
            );

            fetchProducts();
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
        }
    };

    const handleShowImageModal = (imageUrl) => {
        setImageUrl(imageUrl);
        setShowImageModal(true);
    };

    const fetchFilteredProducts = async () => {
        setLoading(true);
        try {
            const response = await searchProducts(filters, currentPage, pageSize);
            setProducts(response.data?.data?.content || []);
            setTotalPages(response.data?.data?.totalPages || 1);
            setLoading(false);
        } catch (err) {
            setError('Lỗi khi tìm kiếm sản phẩm.');
            setLoading(false);
        }
    };

    const handleExportExcel = async () => {
        if (selectedProducts.length === 0) {
            toast.error("Vui lòng chọn ít nhất một sản phẩm để xuất Excel!");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/products/export-excel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ productIds: selectedProducts }) // Gửi danh sách ID sản phẩm đã chọn
            });

            if (!response.ok) {
                throw new Error("Lỗi khi xuất file Excel");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "danh_sach_san_pham_excel.xlsx";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success("Xuất file Excel thành công!");
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi xuất file Excel!");
        }
    };

    // const handleImportExcel = async (event) => {
    //     const file = event.target.files[0];
    //     if (!file) {
    //         toast.error("Vui lòng chọn một tệp Excel!");
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append("file", file);

    //     try {
    //         const response = await fetch("http://localhost:8080/products/import-excel", {
    //             method: "POST",
    //             headers: {
    //                 "Authorization": `Bearer ${localStorage.getItem("token")}`
    //             },
    //             body: formData
    //         });

    //         let result;
    //         try {
    //             result = await response.json();
    //         } catch (jsonError) {
    //             result = { error: "Lỗi không xác định từ server." };
    //         }

    //         if (result.error) {
    //             toast.error(result.error); // Hiển thị lỗi từ API
    //             return;
    //         }

    //         console.log("Response Data:", result);

    //         if (result && Array.isArray(result.errors) && result.errors.length > 0) {
    //             result.errors.forEach(error => toast.error(error));

    //             Swal.fire({
    //                 title: "Có lỗi trong file Excel!",
    //                 text: "Các sản phẩm không lỗi đã được nhập. Bạn có muốn tải file chứa các sản phẩm bị lỗi không?",
    //                 icon: "warning",
    //                 showCancelButton: true,
    //                 confirmButtonText: "Tải ngay",
    //                 cancelButtonText: "Không"
    //             }).then((willDownload) => {
    //                 if (willDownload.isConfirmed) {
    //                     const link = document.createElement("a");
    //                     link.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + result.file;
    //                     link.download = "DanhSachLoi.xlsx";
    //                     document.body.appendChild(link);
    //                     link.click();
    //                     document.body.removeChild(link);

    //                     // Hiển thị toast thông báo tải file thành công
    //                     toast.success("Tải file lỗi thành công!");
    //                 }
    //             });
    //         } else {
    //             toast.success("Nhập file Excel thành công!");
    //             fetchProducts();
    //         }

    //     } catch (error) {
    //         console.error(error);
    //         toast.error("Lỗi khi nhập file Excel!");
    //     }
    // };
    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);

        if (files.length === 0) {
            toast.error("Vui lòng chọn ít nhất một tệp Excel!");
            return;
        }

        // Giới hạn tối đa 2 file
        if (selectedFiles.length + files.length > 2) {
            toast.error("Chỉ được chọn tối đa 2 file Excel!");
            return;
        }

        // Thêm file mới vào danh sách
        const newFiles = [...selectedFiles, ...files];
        setSelectedFiles(newFiles);
        setShowFileManagerModal(true);
        event.target.value = ''; // Reset input file
    };

    const handlePreviewFile = (file) => {
        setCurrentPreviewFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            if (jsonData.length > 0) {
                setPreviewHeaders(jsonData[0]);
                setPreviewData(jsonData.slice(1)); // Lấy tất cả dòng dữ liệu
                setShowPreviewModal(true);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleRemoveFile = (index) => {
        const updatedFiles = [...selectedFiles];
        updatedFiles.splice(index, 1);
        setSelectedFiles(updatedFiles);
    };

    const handleConfirmImport = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Vui lòng chọn ít nhất một file Excel!");
            return;
        }

        try {
            for (const file of selectedFiles) {
                const formData = new FormData();
                formData.append("file", file);

                const response = await fetch("http://localhost:8080/products/import-excel", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: formData
                });

                let result;
                try {
                    result = await response.json();
                } catch (jsonError) {
                    result = { error: "Lỗi không xác định từ server." };
                }

                if (result.error) {
                    toast.error(result.error);
                    continue;
                }

                if (result && Array.isArray(result.errors) && result.errors.length > 0) {
                    result.errors.forEach(error => toast.error(error));

                    await Swal.fire({
                        title: "Có lỗi trong file Excel!",
                        text: "Các sản phẩm không lỗi đã được nhập. Bạn có muốn tải file chứa các sản phẩm bị lỗi không?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Tải ngay",
                        cancelButtonText: "Không"
                    }).then((willDownload) => {
                        if (willDownload.isConfirmed) {
                            const link = document.createElement("a");
                            link.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64," + result.file;
                            link.download = "DanhSachLoi.xlsx";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                            toast.success("Tải file lỗi thành công!");
                        }
                    });
                }
            }

            toast.success("Nhập file Excel thành công!");
            setSelectedFiles([]);
            setShowFileManagerModal(false);
            fetchProducts();
        } catch (error) {
            console.error(error);
            toast.error("Lỗi khi nhập file Excel!");
        }
    };

    const handleBulkDeleteProducts = async () => {
        if (selectedProducts.length === 0) {
            toast.warning("Vui lòng chọn ít nhất một sản phẩm để xoá!");
            return;
        }

        try {
            const result = await Swal.fire({
                title: "Xác nhận",
                text: "Bạn có chắc chắn muốn xoá các sản phẩm đã chọn?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Đồng ý",
                cancelButtonText: "Hủy",
                footer: "<p style='color: red;'>Lưu ý: Nếu đồng ý, các sản phẩm sẽ không thể bán trên quầy hàng và website!</p>",
            });

            if (!result.isConfirmed) return;

            await deleteAndRestoreProducts(selectedProducts);

            // Cập nhật UI
            setProducts(prevProducts =>
                prevProducts.map(product =>
                    selectedProducts.includes(product.id) ? { ...product, status: 2 } : product
                )
            );

            setSelectedProducts([]);

            fetchProducts();

            toast.success("Đã xoá các sản phẩm thành công!");
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
            toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <h2>Danh sách sản phẩm</h2>
                {localStorage.getItem("role") === "ADMIN" && (
                    <button type="button" className="btn btn-gradient-primary btn-sm" style={{ marginBottom: "10px" }} onClick={handleAddProduct}>
                        <i className='mdi mdi-plus'></i> Thêm mới
                    </button>
                )}
            </div>
            {localStorage.getItem("role") === "ADMIN" && (
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-start" }}>
                    {/* <div style={{ position: "relative", display: "inline-block" }}>
                        <label style={{
                            cursor: "pointer",
                            display: "inline-block",
                            position: "relative"
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                        >
                            <div style={{ cursor: "pointer", textDecoration: "none" }}>
                                <i className='mdi mdi-format-vertical-align-bottom'></i>Nhập Excel
                            </div>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleImportExcel}
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0,
                                    cursor: "pointer",
                                    pointerEvents: "none"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                                onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                            />
                        </label>
                    </div> */}
                    <div style={{ position: "relative", display: "inline-block" }}>
                        <label style={{
                            cursor: "pointer",
                            display: "inline-block",
                            position: "relative"
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                            onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                        >
                            <div style={{ cursor: "pointer", textDecoration: "none" }}>
                                <i className='mdi mdi-format-vertical-align-bottom'></i>Nhập Excel
                            </div>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileSelect}
                                multiple
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    width: "100%",
                                    height: "100%",
                                    opacity: 0,
                                    cursor: "pointer",
                                    pointerEvents: "none"
                                }}
                            />
                        </label>
                    </div>

                    <div style={{ cursor: "pointer", textDecoration: "none" }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                        onClick={handleExportExcel}>
                        <i className='mdi mdi-format-vertical-align-top'></i>Xuất Excel
                    </div>
                    <span style={{
                        borderLeft: "1px solid #ccc",
                        height: "20px",
                        display: "inline-block",
                        margin: "0 10px"
                    }}></span>
                    <div style={{ cursor: "pointer", textDecoration: "none" }}
                        onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                        onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                        onClick={() => history.push("/admin/products/bin")}
                    >
                        Thùng rác
                    </div>
                    <span style={{
                        borderLeft: "1px solid #ccc",
                        height: "20px",
                        display: "inline-block",
                        margin: "0 10px"
                    }}></span>
                    <Dropdown>
                        <Dropdown.Toggle as="div" id="dropdownMenuSizeButton3" style={{ cursor: "pointer", display: "inline-block" }}>
                            <span style={{ textDecoration: "none" }}
                                onMouseEnter={(e) => e.currentTarget.style.textDecoration = "underline"}
                                onMouseLeave={(e) => e.currentTarget.style.textDecoration = "none"}
                            >
                                Thao tác
                            </span>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleBulkDeleteProducts}>
                                <i className='mdi mdi-delete'></i>
                                Xoá các sản phẩm đã chọn</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            )}
            <div className="row">
                <div className="col-lg-12 grid-margin stretch-card">
                    <div className="card">
                        <div className="card-body">
                            <div className='row'>
                                <div className='col-md-12'>
                                    <SearchProducts filters={filters} setFilters={setFilters} fetchFilteredProducts={fetchFilteredProducts} />
                                </div>
                            </div>
                            <div style={{ marginBottom: '20px' }}></div>
                            {successMessage && (
                                <Alert variant="success" onClose={() => setSuccessMessage("")} dismissible>
                                    {successMessage}
                                </Alert>
                            )}
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '150px' }}>
                                    <Spinner animation="border" variant="primary" />
                                    <span className="ml-2">Đang tải dữ liệu...</span>
                                </div>
                            ) : error ? (
                                <div className="text-danger">{error}</div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead
                                            // style={{ backgroundColor: "#CE91FF", color: "#fff" }}
                                            >
                                                <tr>
                                                    <th>
                                                        <input
                                                            type="checkbox"
                                                            onChange={(e) => {
                                                                if (e.target.checked) {
                                                                    setSelectedProducts(products.map(p => p.id));
                                                                } else {
                                                                    setSelectedProducts([]);
                                                                }
                                                            }}
                                                            checked={selectedProducts.length === products.length && products.length > 0}
                                                        />
                                                    </th>
                                                    <th>Ảnh chính</th>
                                                    <th>Mã sản phẩm</th>
                                                    <th>Tên sản phẩm</th>
                                                    <th>Thương hiệu</th>
                                                    <th>Danh mục</th>
                                                    <th>Chất liệu</th>
                                                    <th>Mô tả</th>
                                                    <th style={{ width: '50px' }}>Tổng số lượng</th>
                                                    <th>Trạng thái</th>
                                                    {localStorage.getItem("role") === "ADMIN" &&
                                                        <th style={{ width: '100px' }}>Hành động</th>
                                                    }
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {products.length > 0 ? (
                                                    products
                                                        .map((product, index) => (
                                                            <tr
                                                                key={product.id}
                                                                onClick={() => handleProductDetail(product.id)}
                                                                style={{ cursor: "pointer" }}
                                                            >
                                                                <td onClick={(event) => event.stopPropagation()}>
                                                                    <input
                                                                        type="checkbox"
                                                                        onChange={(e) => {
                                                                            if (e.target.checked) {
                                                                                setSelectedProducts([...selectedProducts, product.id]);
                                                                            } else {
                                                                                setSelectedProducts(selectedProducts.filter(id => id !== product.id));
                                                                            }
                                                                        }}
                                                                        checked={selectedProducts.includes(product.id)}
                                                                    />
                                                                </td>
                                                                <td onClick={(event) => event.stopPropagation()}>
                                                                    {product.mainImage != "image.png" ? (
                                                                        <img
                                                                            src={product.mainImage}
                                                                            alt="Product"
                                                                            style={{ width: '100px', height: 'auto', cursor: 'pointer', borderRadius: '5%', objectFit: 'contain' }}
                                                                            onClick={() => handleShowImageModal(product.mainImage)}  // Mở modal khi click vào ảnh
                                                                        />
                                                                    ) : (
                                                                        <span>No Image</span>
                                                                    )}
                                                                </td>
                                                                <td>{product.productCode}</td>
                                                                <td>{product.productName}</td>
                                                                <td>{product.brand.brandName}</td>
                                                                <td>{product.category.categoryName}</td>
                                                                <td>{product.material.materialName}</td>
                                                                <td className="long-content">{product.description}</td>
                                                                <td>{product.totalQuantity}</td>
                                                                <td>
                                                                    <span className={`badge ${product.status === 1 ? 'badge-success' : (product.status === 0 ? 'badge-danger' : 'badge-dark')}`} style={{ padding: '7px' }}>
                                                                        {product.status === 1 ? 'Đang bán' : product.status === 2 ? 'Ngừng bán' : 'Hết hàng'}
                                                                    </span>
                                                                </td>
                                                                {localStorage.getItem("role") === "ADMIN" &&
                                                                    <td>
                                                                        <div
                                                                            onClick={(event) => event.stopPropagation()}
                                                                            style={{
                                                                                display: 'flex',
                                                                                justifyContent: 'center',
                                                                                alignItems: 'center',
                                                                                gap: '10px',
                                                                                textAlign: 'center',
                                                                                height: '100%',
                                                                                padding: '10px'
                                                                            }} >
                                                                            {/* <button className="btn btn-outline-warning btn-sm btn-rounded btn-icon"
                                                                            onClick={() => handleProductDetail(product.id, product.productName)}
                                                                        >
                                                                            <i className='mdi mdi-eye'></i>
                                                                        </button> */}
                                                                            <Switch
                                                                                checked={product.status !== 2}
                                                                                onChange={() => handleToggleStatus(product.id, product.status, product.totalQuantity)}
                                                                                offColor="#888"
                                                                                onColor="#ca51f0"
                                                                                uncheckedIcon={false}
                                                                                checkedIcon={false}
                                                                                height={20}
                                                                                width={40}
                                                                            />
                                                                            {/* <button className="btn btn-outline-danger btn-sm btn-rounded btn-icon"
                                                                            onClick={() => handleUpdateProduct(product.id)}
                                                                        >
                                                                            <i className='mdi mdi mdi-wrench'></i>
                                                                        </button> */}
                                                                        </div>
                                                                    </td>
                                                                }
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
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column", // Xếp theo cột
                                        alignItems: "center", // Căn giữa theo chiều ngang
                                        marginTop: "20px",
                                        gap: "10px",
                                        width: "100%"
                                    }}>
                                        <Pagination className="justify-content-center">
                                            <Pagination.First onClick={() => handlePageChange(0)} disabled={currentPage === 0} />
                                            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />

                                            {[...Array(totalPages)].map((_, index) => (
                                                <Pagination.Item
                                                    key={index}
                                                    active={index === currentPage}
                                                    onClick={() => handlePageChange(index)}
                                                >
                                                    {index + 1}
                                                </Pagination.Item>
                                            ))}

                                            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} />
                                            <Pagination.Last onClick={() => handlePageChange(totalPages - 1)} disabled={currentPage === totalPages - 1} />
                                        </Pagination>
                                        <div style={{ minWidth: "80px", textAlign: "center" }}>
                                            <select
                                                value={pageSize}
                                                onChange={handlePageSizeChange}
                                                className="form-control"
                                            >
                                                {pageSizeOptions.map(option => (
                                                    <option key={option.value} value={option.value}>{option.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered>
                <Modal.Body>
                    <img
                        src={imageUrl}
                        alt="Large Product"
                        style={{ width: '100%', height: 'auto' }}
                    />
                </Modal.Body>
            </Modal>

            <Modal
                show={showFileManagerModal}
                onHide={() => setShowFileManagerModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Quản lý file Excel ({selectedFiles.length}/2)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedFiles.length > 0 ? (
                        <ListGroup>
                            {selectedFiles.map((file, index) => (
                                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Badge bg="secondary" className="me-2">{index + 1}</Badge>.
                                        {file.name}
                                    </div>
                                    <div>
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => handlePreviewFile(file)}
                                        >
                                            <i className="mdi mdi-eye"></i> Xem trước
                                        </Button>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleRemoveFile(index)}
                                        >
                                            <i className="mdi mdi-delete"></i> Xóa
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    ) : (
                        <div className="text-center py-4">
                            <p>Chưa có file nào được chọn</p>
                            <Button
                                variant="primary"
                                onClick={() => document.querySelector('input[type="file"]').click()}
                            >
                                <i className="mdi mdi-plus"></i> Chọn file
                            </Button>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => document.querySelector('input[type="file"]').click()}
                    >
                        <i className="mdi mdi-plus"></i> Thêm file
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => setSelectedFiles([])}
                        disabled={selectedFiles.length === 0}
                    >
                        <i className="mdi mdi-delete"></i> Xóa tất cả
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleConfirmImport}
                        disabled={selectedFiles.length === 0}
                    >
                        <i className="mdi mdi-upload"></i> Nhập {selectedFiles.length} file
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal xem trước file */}
            <Modal
                show={showPreviewModal}
                onHide={() => setShowPreviewModal(false)}
                size="xl"
                centered
                scrollable // Thêm thuộc tính này để có thể scroll khi nội dung dài
            >
                <Modal.Header closeButton>
                    <Modal.Title>Xem trước: {currentPreviewFile?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {previewData.length > 0 ? (
                        <div className="table-responsive" style={{ maxHeight: '70vh' }}>
                            <table className="table table-bordered table-hover">
                                <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
                                    <tr>
                                        {previewHeaders.map((header, index) => (
                                            <th key={index}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {row.map((cell, cellIndex) => (
                                                <td key={cellIndex}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="text-center mt-2">
                                <small>Tổng số dòng: {previewData.length}</small>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p>Không có dữ liệu để hiển thị</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowPreviewModal(false)}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer />
        </div >
    )
}

export default Products
