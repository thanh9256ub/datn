import React, { useState, useEffect } from 'react';
import { List, Card } from 'antd';
import axios from 'axios';

const TopProducts = () => {
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products/top'); // Replace with your API endpoint
        const products = response.data.data;

        // Sort products by sales and take the top 5
        const sortedProducts = products.sort((a, b) => b.sales - a.sales).slice(0, 5);
        setTopProducts(sortedProducts);
      } catch (error) {
        console.error('Failed to fetch top products:', error);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <Card title="Top 5 Sản phẩm bán chạy" style={{ marginTop: '20px' }}>
      <List
        itemLayout="horizontal"
        dataSource={topProducts}
        renderItem={(product) => (
          <List.Item>
            <List.Item.Meta
              title={product.name}
              description={`Số lượng bán: ${product.sales}`}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TopProducts;
