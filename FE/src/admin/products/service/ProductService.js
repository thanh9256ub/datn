import axios from 'axios'

const BASE_URL = 'http://localhost:8080/products';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload';

export const getProducts = (page, size) => {
    // let token = localStorage.getItem('token');
    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return axios.get(`${BASE_URL}?page=${page}&size=${size}`);
};

export const getProductList = () => {
    return axios.get(`${BASE_URL}/list`);
}

const PCOLOR_URL = 'http://localhost:8080/product-color';

export const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "long_preset");
    formData.append("cloud_name", "dgj9htnpn");

    try {
        // const response = await axios.post('https://api.cloudinary.com/v1_1/dgj9htnpn/image/upload', formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data',
        //     }
        // });

        // if (response.status === 200) {
        //     console.log("Ảnh tải lên thành công:", response.data.secure_url);
        //     return response.data.secure_url;
        // }
        const response = await fetch('https://api.cloudinary.com/v1_1/dgj9htnpn/image/upload', {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Ảnh tải lên thành công:", data.secure_url);
            return data.secure_url;
        }

    } catch (error) {
        console.error("Lỗi khi tải ảnh lên Cloudinary:", error);
        alert("Có lỗi xảy ra khi tải ảnh lên Cloudinary.");
        return null;
    }
};

export const createProduct = async (product) => {
    // let token = localStorage.getItem('token');
    // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const response = await axios.post(`${BASE_URL}/add`, product);
    return response.data
}

export const deleteAndRestoreProducts = (productIds) => {
    return axios.patch(`${BASE_URL}/delete-multiple`, productIds, {
        headers: {
            "Content-Type": "application/json"
        }
    });
};

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

export const getActiveProducts = () => {
    return axios.get(`${BASE_URL}/active`)
}

export const getInactiveProducts = () => {
    return axios.get(`${BASE_URL}/inactive`)
}

export const searchProducts = (filters, page, size) => {
    const params = new URLSearchParams();

    if (filters.name) params.append("name", filters.name);
    if (filters.brandId) params.append("brandId", filters.brandId);
    if (filters.categoryId) params.append("categoryId", filters.categoryId);
    if (filters.materialId) params.append("materialId", filters.materialId);
    if (filters.status !== '') params.append("status", filters.status);

    params.append("page", page);
    params.append("size", size);

    return axios.get(`${BASE_URL}/search?${params.toString()}`);
};

export const getBin = (page, size) => {
    return axios.get(`${BASE_URL}/bin?page=${page}&size=${size}`)
}