import React, { useEffect, useState } from "react";
import "antd/dist/reset.css";
import { createVoucher, getVouchers } from "../service/VoucherService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import dayjs from "dayjs";
import VoucherForm from "../component/VoucherForm";

const CreateVoucher = () => {
  const history = useHistory();

  const [existingVouchers, setExistingVouchers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

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
      (voucher) => voucher.voucherName.toLowerCase() === name.toLowerCase().trim()
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
    setFormData((prev) => ({
      ...prev,
      discountType: selectedOption.value,
      discountValue: 0, // Reset giá trị giảm
      maxDiscountValue: 0, // Reset giảm giá tối đa
    }));
  };

  const isDateBeforeToday = (date) => {
    const today = dayjs().startOf('day'); // Lấy ngày hiện tại (bỏ qua giờ phút giây)
    return date.isBefore(today, 'day');
  };

  const handleDateChange = (name, date) => {
    if (!date) {
      setFormData(prev => ({ ...prev, [name]: null }));
      setErrors(prev => ({ ...prev, [name]: "Vui lòng chọn ngày" }));
      return;
    }
    if (name === 'startDate' && isDateBeforeToday(date)) {
      setErrors(prev => ({ ...prev, [name]: "Ngày bắt đầu không được nhỏ hơn ngày hiện tại" }));
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
    setErrors({});

    const newErrors = {};

    if (formData.voucherName.trim() === '') {
      toast.error("Tên khuyến mại không được để trống. Vui lòng nhập tên khuyến mãi");
      return;
    }

    if (formData.quantity <= 0) {
      toast.error("Số lượng không được để trống và số lượng phải lớn hơn 0");
      return;
    }

    if (formData.quantity > 10000000) {
      toast.error("Số lượng voucher quá lớn vui lòng nhập lại");
      return;
    }

    if (formData.discountValue > 100000000) {
      toast.error("Giá trị giảm quá lớn vui lòng nhập lại");
      return;
    }

    if (formData.discountValue <= 0) {
      toast.error("Giá trị giảm không được để trống và giá trị giảm phải lớn hơn 0");
      return;
    }

    if (!formData.startDate) {
      newErrors.startDate = "Vui lòng chọn ngày bắt đầu";
    }

    if (!formData.endDate) {
      newErrors.endDate = "Vui lòng chọn ngày kết thúc";
    }

    if (formData.startDate && isDateBeforeToday(formData.startDate)) {
      newErrors.startDate = "Ngày bắt đầu không được nhỏ hơn ngày hiện tại";
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
      text: "Bạn có chắc chắn muốn thêm voucher này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, thêm!",
      cancelButtonText: "Hủy",
    });

    if (!confirmResult.isConfirmed) return;

    setIsLoading(true);

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
    } finally {
      setIsLoading(false);
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
                handleSubmit={handleSubmit}
                isSubmitting={isLoading}
                errors={errors}
              />
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default CreateVoucher;
