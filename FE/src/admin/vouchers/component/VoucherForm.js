import React from "react";
import { Form } from "react-bootstrap";
import { DatePicker } from "antd";
import Select from "react-select";

const VoucherForm = ({ id, formData, handleChange, handleDiscountTypeChange, handleDateChange, handleSubmit }) => {
    const discountOptions = [
        { value: 0, label: "Theo số tiền" },
        { value: 1, label: "Theo %" }
    ];

    return (
        <form className="form-sample" onSubmit={handleSubmit}>
            <div className="row">
                {id && (
                    <div className="col-md-12" style={{ marginBottom: '30px' }}>
                        <label style={{ marginRight: '30px' }}>Mã khuyến mại:</label> <strong>{formData.voucherCode}</strong>
                    </div>
                )}
                <div className="col-md-6">
                    <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Tên khuyến mại:</label>
                        <div className="col-sm-9">
                            <Form.Control type="text" name="voucherName" value={formData.voucherName} onChange={handleChange} placeholder="Nhập tên khuyến mại..." />
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
                            <Form.Control type="number" name="quantity" min={0} value={formData.quantity} onChange={handleChange} />
                        </div>
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Loại giảm giá:</label>
                        <div className="col-sm-9">
                            <Select options={discountOptions} value={discountOptions.find(option => option.value === formData.discountType)} onChange={handleDiscountTypeChange} />
                        </div>
                    </Form.Group>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Giá trị giảm:</label>
                        <div className="col-sm-9">
                            <Form.Control type="number" name="discountValue"
                                value={formData.discountValue} onChange={handleChange} />
                        </div>
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Giảm giá tối đa:</label>
                        <div className="col-sm-9">
                            <Form.Control type="number" name="maxDiscountValue" min={0} value={formData.maxDiscountValue} onChange={handleChange} disabled={formData.discountType === 0} />
                        </div>
                    </Form.Group>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Ngày bắt đầu:</label>
                        <div className="col-sm-9">
                            <DatePicker showTime format="DD/MM/YYYY HH:mm:ss" value={formData.startDate} onChange={(date) => handleDateChange("startDate", date)} className="form-control" />
                        </div>
                    </Form.Group>
                </div>
                <div className="col-md-6">
                    <Form.Group className="row">
                        <label className="col-sm-3 col-form-label">Ngày kết thúc:</label>
                        <div className="col-sm-9">
                            <DatePicker showTime format="DD/MM/YYYY HH:mm:ss" value={formData.endDate} onChange={(date) => handleDateChange("endDate", date)} className="form-control" />
                        </div>
                    </Form.Group>
                </div>
            </div>

            <button type="submit" className="btn btn-primary">Lưu</button>
        </form>
    );
};

export default VoucherForm;
