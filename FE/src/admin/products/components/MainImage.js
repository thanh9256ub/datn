import React, { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';

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
        if (initialImage && typeof initialImage === 'string') {
            // Nếu initialImage là URL, hiển thị ảnh từ URL
            return <img src={initialImage} alt="Preview" style={previewImageStyle} />;
        } else if (initialImage && initialImage instanceof File) {
            // Nếu initialImage là File, hiển thị ảnh preview
            return <img src={URL.createObjectURL(initialImage)} alt="Preview" style={previewImageStyle} />;
        }
        return null; // Không hiển thị gì nếu không có ảnh
    };

    const previewContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '15px',
        marginBottom: '15px',
    };

    const previewImageStyle = {
        maxWidth: '200px',
        height: 'auto',
        borderRadius: '8px',
        border: '2px solid #ddd',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    };

    return (
        <div>
            {/* {imagePreview && ( */}
            <div style={previewContainerStyle}>
                {/* <img src={imagePreview} alt="Preview"
                        // style={{ width: '200px', height: 'auto' }} 
                        style={previewImageStyle}
                        onMouseOver={(e) => {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0px 6px 12px rgba(0, 0, 0, 0.2)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';
                        }}
                    /> */}
                {renderImagePreview()}
            </div>
            {/*  )} */}

            <Form.Group className='row d-flex align-items-center'>
                <label className="col-sm-3 col-form-label">Ảnh chính:</label>
                <div className="custom-file col-sm-6">
                    <input
                        type="file"
                        className="custom-file-input"
                        id="customFile"
                        onChange={handleFileChange}
                        style={{ marginLeft: '50px !important' }}
                    />
                    <label className="custom-file-label" htmlFor="customFile">
                        {file ? file.name : 'Chọn ảnh'}
                    </label>
                </div>
            </Form.Group>


        </div>
    );
};

export default MainImage;
