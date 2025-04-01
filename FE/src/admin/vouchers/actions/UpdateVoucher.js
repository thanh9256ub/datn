import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useParams, useHistory } from "react-router-dom";
import { getVoucherById, updateVoucher } from "../service/VoucherService";
import VoucherForm from "../component/VoucherForm";
import Swal from "sweetalert2";
import dayjs from "dayjs";

const UpdateVoucher = () => {
    const { id } = useParams();
    const history = useHistory();
    const [formData, setFormData] = useState(null);

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

    const handleChange = (e) => {
        let { name, value } = e.target;

        if (name === "discountValue") {
            value = parseFloat(value) || 0;

            if (formData.discountType === 1 && value > 100) {
                value = 100;
            }
        }

        setFormData({ ...formData, [name]: value });
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
        setFormData({ ...formData, [name]: date });
    };

    const calculateStatus = (startDate, endDate) => {
        const now = new Date(); // Lấy ngày hiện tại
        if (now < new Date(startDate)) return 2; // "Chưa kích hoạt"
        if (now >= new Date(startDate) && now <= new Date(endDate)) return 1; // "Đang hoạt động"
        return 0; // "Đã hết hạn"
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.voucherName.trim() === '') {
            toast.error("Vui lòng nhập tên voucher");
            return;
        }

        if (formData.discountValue <= 0) {
            toast.error("Giá trị giảm phải lớn hơn 0");
            return;
        }

        if (formData.startDate.isAfter(formData.endDate)) {
            toast.error("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
            return;
        }

        if (!formData.startDate || !formData.endDate) {
            toast.error("Vui lòng chọn ngày bắt đầu và ngày kết thúc!");
            return;
        }

        const confirmResult = await Swal.fire({
            title: "Xác nhận",
            text: "Bạn có chắc chắn muốn cập nhật voucher này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Có, cập nhật!",
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
            toast.success("Cập nhật voucher thành công!");
        } catch (error) {
            toast.error("Cập nhật voucher thất bại!");
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
