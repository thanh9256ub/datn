import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, defs, linearGradient, stop } from 'recharts';

const TopProducts = () => {
  const [data, setData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/order-detail/top5');
        const apiData = response.data.map(item => ({
          name: item[0], // Tên sản phẩm
          sales: item[1], // Số lượng bán
        }));
        setData(apiData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm bán chạy:', error);
      }
    };

    const fetchLowStockProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products/top5');
        const apiData = response.data.map(item => ({
          name: item[0], // Tên sản phẩm
          stock: item[1], // Số lượng tồn kho
        }));
        setLowStockData(apiData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm sắp hết hàng:', error);
      }
    };

    fetchTopProducts();
    fetchLowStockProducts();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Thống kê sản phẩm</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>5 sản phẩm bán nhiều nhất</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{
                top: 20, right: 30, left: 20, bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff7f50" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ff4500" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#333' }} />
              <YAxis tick={{ fontSize: 12, fill: '#333' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                itemStyle={{ color: '#ff4500' }}
              />
              <Legend />
              <Bar dataKey="sales" name="Số lượng bán" fill="url(#colorSales)" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1 }}>
          <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>5 sản phẩm số lượng ít nhất</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={lowStockData}
              margin={{
                top: 20, right: 30, left: 20, bottom: 5,
              }}
            >
              <defs>
                <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#32cd32" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#228b22" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#333' }} />
              <YAxis tick={{ fontSize: 12, fill: '#333' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc' }}
                itemStyle={{ color: '#228b22' }}
              />
              <Legend />
              <Bar dataKey="stock" name="Số lượng tồn kho" fill="url(#colorStock)" barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
