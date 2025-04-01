import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { DatePicker } from "antd";
import "antd/dist/reset.css";
import { createVoucher } from "./service/VoucherService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Select from "react-select";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import dayjs from "dayjs";

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

  const discountOptions = [
    { value: 0, label: "Theo số tiền" },
    { value: 1, label: "Theo %" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      let updatedData = { ...prev, [name]: value };

      // Nếu chọn "Theo số tiền", cập nhật maxDiscountValue = discountValue
      if (name === "discountValue" && prev.discountType === 0) {
        updatedData.maxDiscountValue = value;
      }

      return updatedData;
    });
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
      toast.success("Tạo voucher thành công!");
      setTimeout(() => history.push("/admin/vouchers"), 1000);
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
              <form className="form-sample" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Tên khuyến mại:</label>
                      <div className="col-sm-9">
                        <Form.Control
                          type="text"
                          name="voucherName"
                          value={formData.voucherName}
                          onChange={handleChange}
                          placeholder="Nhập tên khuyến mại..."
                        />
                      </div>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Giá trị tối thiểu:</label>
                      <div className="col-sm-9">
                        <Form.Control type="number" name="minOrderValue" value={formData.minOrderValue} onChange={handleChange} />
                      </div>
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Số lượng:</label>
                      <div className="col-sm-9">
                        <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} />
                      </div>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Loại giảm giá:</label>
                      <div className="col-sm-9">
                        <Select
                          options={discountOptions}
                          value={discountOptions.find(option => option.value === formData.discountType)}
                          onChange={handleDiscountTypeChange}
                        />
                      </div>
                    </Form.Group>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Giá trị giảm:</label>
                      <div className="col-sm-9">
                        <Form.Control type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} />
                      </div>
                    </Form.Group>
                  </div>

                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Giảm giá tối đa:</label>
                      <div className="col-sm-9">
                        <Form.Control
                          type="number"
                          name="maxDiscountValue"
                          value={formData.maxDiscountValue}
                          onChange={handleChange}
                          disabled={formData.discountType === 0}
                        />
                      </div>
                    </Form.Group>
                  </div>
                </div>

                {/* Date Picker Ant Design */}
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Ngày bắt đầu:</label>
                      <div className="col-sm-9">
                        <DatePicker
                          showTime
                          format="DD/MM/YYYY HH:mm:ss"
                          value={formData.startDate}
                          onChange={(date) => handleDateChange("startDate", date)}
                          className="form-control"
                        />
                      </div>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Ngày kết thúc:</label>
                      <div className="col-sm-9">
                        <DatePicker
                          showTime
                          format="DD/MM/YYYY HH:mm:ss"
                          value={formData.endDate}
                          onChange={(date) => handleDateChange("endDate", date)}
                          className="form-control"
                        />
                      </div>
                    </Form.Group>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Lưu
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default CreateVoucher;
