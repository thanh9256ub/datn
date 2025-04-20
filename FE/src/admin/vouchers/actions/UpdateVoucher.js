import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useHistory } from "react-router-dom";
import { getVoucherById, getVouchers, updateVoucher } from "../service/VoucherService";
import VoucherForm from "../component/VoucherForm";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const UpdateVoucher = () => {
    const { id } = useParams();
    const history = useHistory();
    const [formData, setFormData] = useState(null);
    const [existingVouchers, setExistingVouchers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        getVoucherById(id)
            .then((response) => {
                setFormData({
                    voucherCode: response.data.voucherCode || "",
                    voucherName: response.data.voucherName || "",
                    minOrderValue: response.data.minOrderValue || 0,
                    quantity: response.data.quantity || 0,
                    discountType: response.data.discountType || 0,
                    discountValue: response.data.discountValue || 0,
                    maxDiscountValue: response.data.maxDiscountValue || 0,
                    startDate: dayjs(response.data.startDate) || dayjs(),
                    endDate: dayjs(response.data.endDate) || dayjs(),
                });
            })
            .catch((error) => {
                toast.error("Lỗi khi tải dữ liệu voucher!");
            });
    }, [id]);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const vouchers = await getVouchers();
                setExistingVouchers(vouchers.data.data);
            } catch (error) {
                console.error("Error fetching vouchers:", error);
            }
        };

        fetchVouchers();
    }, []);

    const checkVoucherNameExists = (name) => {
        return existingVouchers.some(
            (voucher) => voucher.voucherName.toLowerCase() === name.toLowerCase().trim() && voucher.id != id
        );
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Kiểm tra chỉ cho các trường hợp có giá trị là số (ví dụ: discountValue)
        if (name === "discountValue" && (value === "" || parseFloat(value) >= 0)) {
            setFormData((prev) => {
                let updatedData = { ...prev, [name]: value };

                // Nếu có '--' hoặc giá trị âm, không cập nhật state
                if (value.includes("--") || parseFloat(value) < 0) {
                    return prev; // Ngừng cập nhật nếu có '--' hoặc giá trị âm
                }

                // Nếu chọn "Theo số tiền", cập nhật maxDiscountValue = discountValue
                if (name === "discountValue" && prev.discountType === 0) {
                    updatedData.maxDiscountValue = value;
                }

                // Nếu là giảm giá theo %, giới hạn discountValue tối đa là 100
                if (name === "discountValue" && prev.discountType === 1) {
                    updatedData.discountValue = value === "" ? "" : Math.min(parseFloat(value), 100);
                }

                return updatedData;
            });
        } else {
            // Cập nhật thông thường cho các trường khác như tên voucher
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleDiscountTypeChange = (selectedOption) => {
        setFormData({
            ...formData,
            discountType: selectedOption.value,
            discountValue: 0,
            maxDiscountValue: 0,
        });
    };

    const handleDateChange = (name, date) => {
        if (!date) {
            setFormData(prev => ({ ...prev, [name]: null }));
            setErrors(prev => ({ ...prev, [name]: "Vui lòng chọn ngày" }));
            return;
        }
        setFormData(prev => ({ ...prev, [name]: date }));
        setErrors(prev => ({ ...prev, [name]: "" })); // Clear error khi có giá trị
    };

    const calculateStatus = (startDate, endDate) => {
        const now = new Date(); // Lấy ngày hiện tại
        if (now < new Date(startDate)) return 2; // "Chưa kích hoạt"
        if (now >= new Date(startDate) && now <= new Date(endDate)) return 1; // "Đang hoạt động"
        return 0; // "Đã hết hạn"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Reset errors trước khi validate

        // Validate các trường
        const newErrors = {};

        if (formData.voucherName.trim() === '') {
            toast.error("Vui lòng nhập tên voucher");
            return;
        }

        if (formData.discountValue <= 0) {
            toast.error("Giá trị giảm phải lớn hơn 0");
            return;
        }

        if (formData.quantity <= 0) {
            toast.error("Số lượng không được để trống và số lượng phải lớn hơn 0");
            return;
        }

        if (!formData.startDate) {
            newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
        }

        if (!formData.endDate) {
            newErrors.endDate = "Vui lòng chọn ngày kết thúc";
        }

        // Chỉ kiểm tra isAfter nếu cả 2 ngày đều có giá trị
        if (formData.startDate && formData.endDate) {
            if (formData.startDate.isAfter(formData.endDate)) {
                newErrors.endDate = "Ngày kết thúc phải sau ngày bắt đầu";
            }
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (checkVoucherNameExists(formData.voucherName)) {
            toast.error("Tên voucher đã tồn tại");
            return;
        }

        if (formData.minOrderValue === '') {
            toast.error("Không để trống giá trị hoá đơn tối thiểu");
            return;
        }

        if (formData.maxDiscountValue === '') {
            toast.error("Không để trống giảm giá tối đa");
            return;
        }

        if (formData.minOrderValue > 100000000) {
            toast.error("Giá trị hoá đơn tối thiểu quá lớn vui lòng nhập lại");
            return;
        }

        if (formData.discountType === 1 && formData.maxDiscountValue > 100000000) {
            toast.error("Giảm giá tối đa quá lớn vui lòng nhập lại");
            return;
        }

        const confirmResult = await Swal.fire({
            title: "Xác nhận",
            text: "Bạn có chắc chắn muốn chỉnh sửa voucher này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Có, chỉnh sửa!",
            cancelButtonText: "Hủy",
        });

        if (!confirmResult.isConfirmed) return;

        const updatedFormData = {
            ...formData,
            startDate: formData.startDate.add(7, "hour"),
            endDate: formData.endDate.add(7, "hour"),
            status: calculateStatus(formData.startDate, formData.endDate),
        };

        try {
            console.log("Data: ", updatedFormData);
            await updateVoucher(id, updatedFormData);
            setTimeout(() => history.push("/admin/vouchers"), 1000);
            toast.success("Chỉnh sửa voucher thành công!");
        } catch (error) {
            toast.error("Chỉnh sửa voucher thất bại!");
        }
    };

    return formData ? (
        <div>
            <div className="page-header">
                <h3 className="page-title">Chỉnh sửa khuyến mại</h3>
            </div>
            <div className="row">
                <div className="col-12 grid-margin">
                    <div className="card">
                        <div className="card-body">
                            <VoucherForm
                                id={id}
                                formData={formData}
                                handleChange={handleChange}
                                handleDiscountTypeChange={handleDiscountTypeChange}
                                handleDateChange={handleDateChange}
                                handleSubmit={handleSubmit}
                                errors={errors}
                            />
                            <ToastContainer />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <p>Loading...</p>
    );
};

export default UpdateVoucher;
