import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const RevenueFilter = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [counterRevenue, setCounterRevenue] = useState(0);
  const [onlineRevenue, setOnlineRevenue] = useState(0);
  const [dateRange, setDateRange] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);
  const [selectedYearForMonth, setSelectedYearForMonth] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        let response;

        if (dateRange && dateRange[0] && dateRange[1]) {
          response = await axios.get('http://localhost:8080/order/revenue-year-month', {
            params: {
              startDate: dateRange[0].format('YYYY-MM-DD'),
              endDate: dateRange[1].format('YYYY-MM-DD'),
            },
          });
        } else if (month && selectedYearForMonth) {
          response = await axios.get('http://localhost:8080/order/revenue-month', {
            params: { year: selectedYearForMonth, month },
          });
        } else if (year) {
          response = await axios.get('http://localhost:8080/order/revenue-year', {
            params: { year },
          });
        } else {
          // Fetch total revenue by default
          response = await axios.get('http://localhost:8080/order/revenue-total');
        }

        const [total = 0, counter = 0, online = 0] = response.data[0] || [];
        setTotalRevenue(total);
        setCounterRevenue(counter);
        setOnlineRevenue(online);
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
        setTotalRevenue(0);
        setCounterRevenue(0);
        setOnlineRevenue(0);
      }
    };

    fetchRevenue();
  }, [dateRange, month, year, selectedYearForMonth]);

  const handleDateChange = (dates) => {
    if (dates && dates.length === 2) {
      setDateRange([dates[0], dates[1]]);
    } else {
      setDateRange([]);
    }
    setMonth(null);
    setYear(null);
    setSelectedYearForMonth(null);
  };

  const handleYearForMonthChange = (value) => {
    setSelectedYearForMonth(value);
    setMonth(null);
    setYear(null);
    setDateRange([]);
  };

  const handleMonthChange = (value) => {
    if (selectedYearForMonth) {
      setMonth(value);
      setYear(null);
      setDateRange([]);
    }
  };

  const handleYearChange = (value) => {
    setYear(value);
    setDateRange([]);
    setMonth(null);
    setSelectedYearForMonth(null);
  };

  const currentYear = moment().year();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - i);

  return (
    <div style={{ 
      background: 'white', 
      padding: '24px', 
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      marginBottom: '24px'
    }}>
      {/* Phần filter */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={8}>
          <RangePicker 
            value={dateRange}
            onChange={handleDateChange} 
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="Chọn năm"
            style={{ width: '100%' }}
            onChange={handleYearForMonthChange}
            value={selectedYearForMonth}
          >
            {years.map(y => (
              <Option key={y} value={y}>
                Năm {y}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Chọn tháng"
            style={{ width: '100%', marginTop: '12px' }}
            onChange={handleMonthChange}
            value={month}
            disabled={!selectedYearForMonth}
          >
            {[...Array(12).keys()].map(i => (
              <Option key={i + 1} value={i + 1}>
                Tháng {i + 1}
              </Option>
            ))}
          </Select>
        </Col>
        <Col span={8}>
          <Select
            placeholder="Chọn năm"
            style={{ width: '100%' }}
            onChange={handleYearChange}
            value={year}
          >
            {years.map(y => (
              <Option key={y} value={y}>
                Năm {y}
              </Option>
            ))}
          </Select>
        </Col>
      </Row>

      {/* Hiển thị kết quả */}
      <Row gutter={16}>
        <Col span={8}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
              color: 'white',
              borderRadius: '8px',
              height: '100%'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>Doanh thu tổng</div>
                <div style={{ fontSize: '24px', fontWeight: '600' }}>
                  {totalRevenue.toLocaleString() || 0}đ
                </div>
              </div>
              <div style={{ fontSize: '24px' }}>💰</div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #2196F3 0%, #0D47A1 100%)',
              color: 'white',
              borderRadius: '8px',
              height: '100%'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>Doanh thu tại quầy</div>
                <div style={{ fontSize: '24px', fontWeight: '600' }}>
                  {counterRevenue.toLocaleString() || 0}đ
                </div>
              </div>
              <div style={{ fontSize: '24px' }}>🏪</div>
            </div>
          </Card>
        </Col>
        <Col span={8}>
          <Card 
            style={{ 
              background: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)',
              color: 'white',
              borderRadius: '8px',
              height: '100%'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>Doanh thu trực tuyến</div>
                <div style={{ fontSize: '24px', fontWeight: '600' }}>
                  {onlineRevenue.toLocaleString() || 0}đ
                </div>
              </div>
              <div style={{ fontSize: '24px' }}>🌐</div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RevenueFilter;