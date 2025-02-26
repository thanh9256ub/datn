import axios from 'axios'

const apiProductDetails = 'http://localhost:8080/product-detail';

const apiCreateProductDetails = 'http://localhost:8080/product-detail/add-multiple';

export const createProductDetail = (productId, listVariant) => {
    return axios.post(apiCreateProductDetails + "/" + productId, listVariant);
}

export const getProductDetailByProductId = (id) => {
    return axios.get(apiProductDetails + "/" + id)
}