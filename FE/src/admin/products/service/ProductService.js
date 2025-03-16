import axios from 'axios'

const BASE_URL = 'http://localhost:8080/products';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload';

export const getProducts = () => {
    return axios.get(BASE_URL);
}

const PCOLOR_URL = 'http://localhost:8080/product-color';

export const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "long_preset");
    formData.append("cloud_name", "dgj9htnpn");

    try {
        const response = await axios.post('https://api.cloudinary.com/v1_1/dgj9htnpn/image/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });

        if (response.status === 200) {
            return response.data.secure_url; // Trả về URL ảnh sau khi upload lên Cloudinary
        }
    } catch (error) {
        console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
        alert("Có lỗi xảy ra khi tải ảnh lên Cloudinary.");
        return null;
    }
};

export const createProduct = (product) => {
    return axios.post(`${BASE_URL}/add`, product);
}


export const updateStatus = (id, statusPro) => {
    return axios.patch(`${BASE_URL}/${id}?status=${statusPro}`);
}

export const getProductById = (id) => {
    return axios.get(`${BASE_URL}/${id}`)
}

export const updateProduct = (id, product) => {
    return axios.put(`http://localhost:8080/products/${id}`, product)
}

export const getProductColorsByProductId = (productId) => {
    return axios.get(`${PCOLOR_URL}/${productId}`)
}

export const getImagesByProductColor = (productColorId) => {
    return axios.get(`${PCOLOR_URL}/${productColorId}/images`)
}


