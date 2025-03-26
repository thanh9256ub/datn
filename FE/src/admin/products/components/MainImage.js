import React, { useEffect, useState } from 'react';
import { FaImage } from "react-icons/fa";

const MainImage = ({ setMainImage, initialImage }) => {
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (initialImage) {
            setImagePreview(initialImage);
        }
    }, [initialImage]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
            setMainImage(selectedFile);
        }
    };

    const renderImagePreview = () => {
        if (initialImage != "image.png" && initialImage && typeof initialImage === 'string') {
            // Nếu initialImage là URL, hiển thị ảnh từ URL
            return <img src={initialImage} alt="Preview" style={previewImageStyle} />;
        } else if (initialImage && initialImage instanceof File) {
            // Nếu initialImage là File, hiển thị ảnh preview
            return <img src={URL.createObjectURL(initialImage)} alt="Preview" style={previewImageStyle} />;
        }
        return <div><FaImage size={80} color="#007bff" /> <br /> Chọn ảnh chính</div>; // Không hiển thị gì nếu không có ảnh
    };

    const previewContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '15px',
        marginBottom: '15px',
    };

    const previewImageStyle = {
        maxWidth: '210px',
        height: 'auto',
        borderRadius: '8px',
        border: '2px solid #ddd',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    };

    return (
        <div>
            <div
                className='float-left'
                style={{
                    position: "relative",
                    textAlign: "center",
                    opacity: imagePreview ? 1 : 0.5,
                    cursor: "pointer",
                }}
                onClick={() => document.getElementById("main-image-input").click()} // Cho phép click để chọn ảnh
            >
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }} >
                    {renderImagePreview()}
                </div>

                {/* Input file ẩn */}
                <input
                    type="file"
                    id="main-image-input"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
};

export default MainImage;
