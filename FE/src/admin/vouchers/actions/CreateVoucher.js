import React, { useState } from "react";
import "antd/dist/reset.css";
import { createVoucher } from "../service/VoucherService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import dayjs from "dayjs";
import VoucherForm from "../component/VoucherForm";

const CreateVoucher = () => {
  const history = useHistory();

  const [formData, setFormData] = useState({
    voucherName: "",
    minOrderValue: 0,
    quantity: 0,
    discountType: 0,
    discountValue: 0,
    maxDiscountValue: 0,
    startDate: dayjs(),
    endDate: dayjs(),
  });

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
    setFormData((prev) => ({
      ...prev,
      discountType: selectedOption.value,
      discountValue: 0, // Reset giá trị giảm
      maxDiscountValue: 0, // Reset giảm giá tối đa
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
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

    if (formData.quantity <= 0) {
      toast.error("Số lượng phải lớn hơn 0");
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
      text: "Bạn có chắc chắn muốn thêm voucher này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, thêm!",
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
      await createVoucher(updatedFormData);
      setTimeout(() => history.push("/admin/vouchers"), 1000);
      toast.success("Tạo voucher thành công!");
    } catch (error) {
      toast.error("Tạo voucher thất bại!");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">Thêm mới khuyến mại</h3>
      </div>
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <VoucherForm
                formData={formData}
                handleChange={handleChange}
                handleDiscountTypeChange={handleDiscountTypeChange}
                handleDateChange={handleDateChange}
                handleSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default CreateVoucher;
