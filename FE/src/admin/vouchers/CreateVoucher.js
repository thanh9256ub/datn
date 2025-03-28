import React, { useState } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createVoucher } from "./service/VoucherService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import Select from "react-select";

const CreateVoucher = () => {

  const [formData, setFormData] = useState({
    voucherName: "",
    minOrderValue: 0,
    quantity: 0,
    discountType: 0,
    discountValue: 0,
    maxDiscountValue: 0,
    startDate: new Date(),
    endDate: new Date(),
  });

  const discountOptions = [
    { value: 0, label: "Theo số tiền" },
    { value: 1, label: "Theo %" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };

    if (name === "discountType") {
      const discountTypeValue = parseInt(value);

      if (discountTypeValue === 0) {
        // Nếu chọn "Theo số tiền", đặt maxDiscountValue về null
        updatedFormData = {
          ...updatedFormData,
          discountValue: "",
          maxDiscountValue: null,
        };
      } else {
        // Nếu chọn "Theo %", đảm bảo giá trị hợp lệ
        updatedFormData = {
          ...updatedFormData,
          discountValue: updatedFormData.discountValue || 1, // Giá trị mặc định từ 1
          maxDiscountValue: updatedFormData.maxDiscountValue || 1,
        };
      }
    }

    if (name === "discountValue" && parseInt(updatedFormData.discountType) === 1) {
      const numValue = parseInt(value);
      if (numValue < 1 || numValue > 100) {
        toast.error("Giá trị giảm phải từ 1-100%");
        return;
      }
    }

    setFormData(updatedFormData);
  };

  const handleDateChange = (name, date) => {
    if (date) {
      setFormData((prevState) => ({ ...prevState, [name]: date }));
    }
  };

  const calculateStatus = (startDate, endDate) => {
    const now = new Date(); // Lấy ngày hiện tại
    if (now < new Date(startDate)) return 2; // "Chưa kích hoạt"
    if (now >= new Date(startDate) && now <= new Date(endDate)) return 1; // "Đang hoạt động"
    return 0; // "Đã hết hạn"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = {
      ...formData,
      status: calculateStatus(formData.startDate, formData.endDate),
    };

    try {
      const response = await createVoucher(updatedFormData);
      alert("Tạo voucher thành công!");
    } catch (error) {
      console.error("Lỗi khi tạo voucher:", error);
      alert("Tạo voucher thất bại!");
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
                      <label className="col-sm-3 col-form-label">Giá trị sản phẩm tối thiểu:</label>
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
                          onChange={(selectedOption) => setFormData({ ...formData, discountType: selectedOption.value })}
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
                        <Form.Control
                          type="number"
                          name="discountValue"
                          value={formData.discountValue}
                          onChange={handleChange}
                          min={formData.discountType === 1 ? 1 : undefined}  // Nếu là %, min = 1
                          max={formData.discountType === 1 ? 100 : undefined} // Nếu là %, max = 100
                        />
                      </div>
                    </Form.Group>
                  </div>

                  {formData.discountType === 1 && (
                    <div className="col-md-6">
                      <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Giảm giá tối đa:</label>
                        <div className="col-sm-9">
                          <Form.Control
                            type="number"
                            name="maxDiscountValue"
                            value={formData.maxDiscountValue}
                            onChange={handleChange}
                          />
                        </div>
                      </Form.Group>
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Ngày bắt đầu:</label>
                      <div className="col-sm-9" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <DatePicker
                          className="form-control"
                          selected={formData.startDate || null}  // Tránh undefined
                          onChange={(date) => handleDateChange("startDate", date)}
                          dateFormat="dd/MM/yyyy"
                        />

                        <DatePicker
                          className="form-control ml-2"
                          selected={formData.startDate || null}  // Tránh undefined
                          onChange={(date) => handleDateChange("startDate", date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeFormat="HH:mm:ss"
                          timeIntervals={1}
                          dateFormat="HH:mm:ss"
                          timeCaption="Giờ"
                        />
                      </div>
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="row">
                      <label className="col-sm-3 col-form-label">Ngày kết thúc:</label>
                      <div className="col-sm-9" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <DatePicker
                          className="form-control"
                          selected={formData.endDate || null}  // Tránh undefined
                          onChange={(date) => handleDateChange("endDate", date)}
                          dateFormat="dd/MM/yyyy"
                        />

                        <DatePicker
                          className="form-control ml-2"
                          selected={formData.endDate || null}  // Tránh undefined
                          onChange={(date) => handleDateChange("endDate", date)}
                          showTimeSelect
                          showTimeSelectOnly
                          timeFormat="HH:mm:ss"
                          timeIntervals={1}
                          dateFormat="HH:mm:ss"
                          timeCaption="Giờ"
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
    </div>
  );
};

export default CreateVoucher;
