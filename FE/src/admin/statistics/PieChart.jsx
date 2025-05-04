import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

// Custom label component to display percentage
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
  const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = payload.reduce((sum, entry) => sum + entry.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(2);

    return (
      <div className="custom-tooltip" style={{
        backgroundColor: '#fff',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <p style={{ margin: 0, color: '#666' }}><strong>{data.name}</strong></p>
        <p style={{ margin: '5px 0 0 0', color: '#333' }}>
          Số lượng: <strong>{data.value}</strong>
        </p>
        <p style={{ margin: '5px 0 0 0', color: '#333' }}>
          Tỷ lệ: <strong>{percentage}%</strong>
        </p>
      </div>
    );
  }
  return null;
};

// Child component for rendering a pie chart
const PieChartChild = ({ title, apiUrl, categoryNames, colors }) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(apiUrl);
        const apiData = response.data[0].map((value, index) => ({
          name: categoryNames[index],
          value: value,
        }));
        setData(apiData);
        setTotal(apiData.reduce((sum, item) => sum + item.value, 0));
      } catch (error) {
        console.error(`Error fetching data for ${title}:`, error);
      }
    };

    fetchData();
  }, [apiUrl, categoryNames]);

  return (
    <div style={{
      flex: 1,
      minWidth: '350px',
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      margin: '10px'
    }}>
      <h3 style={{
        textAlign: 'center',
        marginBottom: '20px',
        color: '#4B5563',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        {title}
        {total > 0 && <span style={{
          display: 'block',
          fontSize: '14px',
          color: '#6B7280',
          fontWeight: 'normal',
          marginTop: '5px'
        }}>Tổng: {total}</span>}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            innerRadius={60}
            fill="#8884d8"
            label={renderCustomizedLabel}
            labelLine={false}
            isAnimationActive={true}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
                stroke="#fff"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value, entry, index) => (
              <span style={{ color: '#4B5563', fontSize: '14px' }}>
                {value} ({data[index]?.value || 0})
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const PieChartComponent = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',

    }}>
      <PieChartChild
        title="Thống kê loại đơn hàng"
        apiUrl="http://localhost:8080/order/order-sell-counts"
        categoryNames={["Tại quầy không giao hàng", "Tại quầy có giao hàng", "Trực tuyến"]}
        colors={COLORS}
      />
      <PieChartChild
        title="Thống kê trạng thái đơn hàng"
        apiUrl="http://localhost:8080/order/order-counts"
        categoryNames={["Hoàn thành", "Hủy"]}
        colors={COLORS}
      />
    </div>
  );
};

export default PieChartComponent;