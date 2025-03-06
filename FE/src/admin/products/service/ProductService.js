import axios from 'axios'

const BASE_URL = 'http://localhost:8080/products';

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/your-cloud-name/image/upload';

export const getProducts = () => {
    return axios.get(BASE_URL);
}

// const uploadImage = async (file) => {
//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//         const response = await axios.post(`${BASE_URL}/upload`, formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data',
//             }
//         });
//         return response.data.data;  // URL ảnh trả về
//     } catch (error) {
//         console.error('Lỗi khi tải ảnh lên:', error);
//         return null;
//     }
// };

// export const createProduct = async (file, productData) => {
//     const imageUrl = await uploadImage(file);

//     if (imageUrl) {
//         const productRequest = {
//             ...productData,
//             mainImage: imageUrl,
//         };

//         try {
//             const response = await axios.post(`${BASE_URL}/add`, productRequest, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             });

//             if (response.status === 201) {
//                 console.log('Sản phẩm đã được tạo:', response.data);
//             }
//         } catch (error) {
//             console.error('Lỗi khi thêm sản phẩm:', error);
//         }
//     }
// }

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