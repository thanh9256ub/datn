import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';

const MainImage = ({ setMainImage }) => {
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile)); // Tạo ảnh preview
        }
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Vui lòng chọn ảnh!");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "long_preset");
        formData.append("cloud_name", "dgj9htnpn");

        // Upload ảnh lên Cloudinary
        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dgj9htnpn/image/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.status === 200) {
                const imageUrl = response.data.secure_url; // URL ảnh từ Cloudinary
                setMainImage(imageUrl);  // Cập nhật mainImage với URL ảnh
                console.log("Ảnh đã được tải lên Cloudinary:", imageUrl);
            }
        } catch (error) {
            console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
        } finally {
            setIsUploading(false);
        }
    };

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

            <Button
                variant="primary"
                onClick={handleUpload}
                disabled={isUploading}
            >
                {isUploading ? "Đang tải lên..." : "Tải ảnh lên"}
            </Button>
        </div>
    );
};

export default MainImage;
