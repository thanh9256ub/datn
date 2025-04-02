import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, defs, linearGradient, stop } from 'recharts';

const TopProducts = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/order-detail/top5');
        const apiData = response.data.map(item => ({
          name: item[0], // Product name
          sales: item[1], // Sales count
        }));
        setData(apiData);
      } catch (error) {
        console.error('Error fetching top products:', error);
      }
    };

    fetchTopProducts();
  }, []);

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>5 sản phẩm bán chạy nhất</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            top: 20, right: 30, left: 20, bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#f5f5f5', border: '1px solid #ccc' }}
            itemStyle={{ color: '#8884d8' }}
          />
          <Legend />
          <Bar dataKey="sales" fill="url(#colorSales)" barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopProducts;
