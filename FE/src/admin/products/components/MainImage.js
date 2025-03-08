import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { uploadImageToCloudinary } from '../service/ProductService';

const MainImage = ({ setMainImage }) => {
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
            setMainImage(selectedFile);
        }
    };

    // const handleUpload = async () => {
    //     if (!file) {
    //         alert("Vui lòng chọn ảnh!");
    //         return;
    //     }

    //     setIsUploading(true);
    //     try {
    //         const imageUrl = await uploadImageToCloudinary(file) // URL ảnh từ Cloudinary
    //         setMainImage(imageUrl);  // Cập nhật mainImage với URL ảnh
    //         console.log("Ảnh đã được tải lên Cloudinary:", imageUrl);
    //     } catch (error) {
    //         console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
    //     } finally {
    //         setIsUploading(false);
    //     }
    // };

    return (
        <div>
            <Form.Group>
                <Form.Label>Ảnh chính</Form.Label>
                <Form.Control
                    type="file"
                    onChange={handleFileChange}
                />
            </Form.Group>

            {imagePreview && (
                <div>
                    <h6>Preview ảnh:</h6>
                    <img src={imagePreview} alt="Preview" style={{ width: '200px', height: 'auto' }} />
                </div>
            )}

            {/* <Button
                variant="primary"
                onClick={handleUpload}
                disabled={isUploading}
            >
                {isUploading ? "Đang tải lên..." : "Tải ảnh lên"}
            </Button> */}
        </div>
    );
};

export default MainImage;
