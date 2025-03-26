import React, { useState } from "react";

const ProductDescription = ({ description }) => {
    const [showFull, setShowFull] = useState(false);
    const maxLength = 50; // Giới hạn số ký tự hiển thị ban đầu

    // Kiểm tra nếu mô tả dài hơn maxLength thì mới hiển thị nút "Xem thêm"
    const isLongText = description.length > maxLength;
    const displayedText = showFull
        ? description
        : isLongText ? description.slice(0, maxLength) + "..." : description;

    return (
        <div>
            <strong>Mô tả:</strong>
            <p>{displayedText}</p>

            {isLongText && (
                <button onClick={() => setShowFull(!showFull)} className="btn btn-link p-0">
                    {showFull ? "Thu gọn" : "Xem thêm"}
                </button>
            )}
        </div>
    );
};

export default ProductDescription;
