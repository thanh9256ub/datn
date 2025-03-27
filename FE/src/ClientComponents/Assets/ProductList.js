import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Để điều hướng
import Item from './Item'; // Import component Item
import { fetchProducts } from './api'; // Import hàm fetchProducts

const ProductList = () => {
  const [products, setProducts] = useState([]); // State lưu trữ dữ liệu sản phẩm
  const [loading, setLoading] = useState(true); // State xử lý trạng thái loading
  const navigate = useNavigate(); // Hook để điều hướng

  // Gọi API khi component mount
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts(); // Gọi API
        // Ánh xạ dữ liệu từ API
        const mappedProducts = data.map(product => ({
          id: product.id,
          name: product.product_name, // Tên sản phẩm từ product_name
          image: product.main_image, // Ảnh chính từ main_image
          price: product.price || 0, // Giá duy nhất từ product_detail hoặc product
          category: product.category?.category_name || 'Unknown', // Tên danh mục
        }));
        setProducts(mappedProducts); // Cập nhật state
        setLoading(false); // Tắt loading
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  // Hàm xử lý khi nhấp vào sản phẩm
  const handleProductClick = (id) => {
    navigate(`/product-detail/${id}`); // Điều hướng sang trang chi tiết
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  return (
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} onClick={() => handleProductClick(product.id)} style={{ cursor: 'pointer' }}>
          <Item
            id={product.id}
            name={product.name}
            image={product.image}
            price={product.price} // Chỉ truyền price
          />
        </div>
      ))}
    </div>
  );
};

export default ProductList;