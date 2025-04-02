import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Child component for rendering a pie chart
const PieChartChild = ({ title, apiUrl, categoryNames, colors }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const apiData = response.data[0].map((value, index) => ({
          name: categoryNames[index],
          value: value,
        }));
        setData(apiData);
      } catch (error) {
        console.error(`Error fetching data for ${title}:`, error);
      }
    };

    fetchData();
  }, [apiUrl, categoryNames, title]);

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>{title}</h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            formatter={(value, entry, index) => (
              <span style={{ color: colors[index % colors.length] }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const PieChartComponent = () => {
  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Thống kê đơn hàng</h2>
      <PieChartChild
        title="Thống kê loại đơn hàng"
        apiUrl="http://localhost:8080/order/order-sell-counts"
        categoryNames={["Tại quầy không giao hàng", "Tại quầy có giao hàng", "Trực tuyến"]}
        colors={COLORS}
      />
      <PieChartChild
        title="Thống kê trạng thái hóa đơn"
        apiUrl="http://localhost:8080/order/order-counts"
        categoryNames={["Hoàn thành", "Hủy"]}
        colors={COLORS}
      />
    </div>
  );
};

export default PieChartComponent;
