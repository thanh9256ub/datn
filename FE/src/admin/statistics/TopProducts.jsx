import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

// Chỉ sử dụng màu tím
const PURPLE_COLORS = {
  gradient: ['#8A2BE2', '#9370DB'], // Dải màu tím đẹp
  text: '#8A2BE2'
};

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'white',
        padding: '12px',
        border: 'none',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.12)',
        fontSize: '14px'
      }}>
        <p style={{
          margin: 0,
          fontWeight: 600,
          color: '#111827',
          borderBottom: '1px solid #F3F4F6',
          paddingBottom: '6px',
          marginBottom: '8px'
        }}>
          {label}
        </p>
        <p style={{
          margin: '4px 0',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            background: PURPLE_COLORS.gradient[0],
            marginRight: '8px',
            borderRadius: '4px'
          }}></span>
          <span style={{ color: '#6B7280' }}>{payload[0].name}: </span>
          <span style={{
            fontWeight: 600,
            color: '#111827',
            marginLeft: '4px'
          }}>
            {payload[0].value} {unit}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const TopProducts = () => {
  const [data, setData] = useState([]);
  const [lowStockData, setLowStockData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [topProductsRes, lowStockRes] = await Promise.all([
          axios.get('http://localhost:8080/order-detail/top5'),
          axios.get('http://localhost:8080/products/top5')
        ]);

        setData(topProductsRes.data.map(item => ({
          name: item[0].length > 15 ? `${item[0].substring(0, 15)}...` : item[0],
          sales: item[1],
          fullName: item[0]
        })));

        setLowStockData(lowStockRes.data.map(item => ({
          name: item[0].length > 15 ? `${item[0].substring(0, 15)}...` : item[0],
          stock: item[1],
          fullName: item[0]
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div >
      <h2 style={{
        textAlign: 'center',
        marginBottom: '32px',
        fontSize: '24px',
        fontWeight: '700',
        color: '#111827',
        letterSpacing: '0.5px'
      }}>
        Thống kê sản phẩm
      </h2>

      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '32px'
      }}>
        {/* Top Selling Products */}
        <div style={{
          flex: '1 1 500px',
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
        }}>
          <h3 style={{
            textAlign: 'center',
            marginBottom: '24px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827'
          }}>
            Top 5 sản phẩm bán nhiều
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={data}
              margin={{ top: 40, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                stroke="#F3F4F6"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip
                content={<CustomTooltip unit="sản phẩm" />}
                cursor={{ fill: 'rgba(138, 43, 226, 0.1)' }} // Màu tím nhạt
              />
              <Bar
                dataKey="sales"
                name="Số lượng bán"
                fill={PURPLE_COLORS.gradient[0]}
                radius={[6, 6, 0, 0]}
              >
                <LabelList
                  dataKey="sales"
                  position="top"
                  formatter={(value) => `${value} sp`}
                  style={{
                    fill: PURPLE_COLORS.text,
                    fontSize: 12,
                    fontWeight: 600
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Low Stock Products */}
        <div style={{
          flex: '1 1 500px',
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)'
        }}>
          <h3 style={{
            textAlign: 'center',
            marginBottom: '24px',
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827'
          }}>
            Top 5 sản phẩm tồn kho ít nhất
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={lowStockData}
              margin={{ top: 40, right: 20, left: 20, bottom: 20 }}
            >
              <CartesianGrid
                stroke="#F3F4F6"
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 12 }}
                axisLine={{ stroke: '#E5E7EB' }}
                tickLine={{ stroke: '#E5E7EB' }}
              />
              <Tooltip
                content={<CustomTooltip unit="sản phẩm" />}
                cursor={{ fill: 'rgba(138, 43, 226, 0.1)' }} // Màu tím nhạt
              />
              <Bar
                dataKey="stock"
                name="Số lượng tồn kho"
                fill={PURPLE_COLORS.gradient[0]} // Màu tím đồng nhất
                radius={[6, 6, 0, 0]}
              >
                <LabelList
                  dataKey="stock"
                  position="top"
                  formatter={(value) => `${value} sp`}
                  style={{
                    fill: PURPLE_COLORS.text,
                    fontSize: 12,
                    fontWeight: 600
                  }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TopProducts;