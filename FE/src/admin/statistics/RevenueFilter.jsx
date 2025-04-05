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
          return;
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
      setDateRange(null);
    }
    setMonth(null);
    setYear(null);
    setSelectedYearForMonth(null);
  };

  const handleYearForMonthChange = (value) => {
    setSelectedYearForMonth(value);
    setMonth(null);
  };

  const handleMonthChange = (value) => {
    if (selectedYearForMonth) {
      setMonth(value);
    }
  };

  const handleYearChange = (value) => {
    setYear(value);
    setDateRange(null);
    setMonth(null);
    setSelectedYearForMonth(null);
  };

  const currentYear = moment().year();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - i);

  return (
    <>
      {/* Phần 1, 2, 3: Cùng trên một hàng */}
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <RangePicker onChange={handleDateChange} style={{ width: '100%' }} />
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
            style={{ width: '100%', marginTop: '10px' }}
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
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <Card style={{ textAlign: 'center', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Statistic
              title="Doanh thu tổng"
              value={totalRevenue || ""}
              valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ textAlign: 'center', backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}>
            <Statistic
              title="Doanh thu tại quầy"
              value={counterRevenue || ""}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ textAlign: 'center', backgroundColor: '#fff1f0', borderColor: '#ffa39e' }}>
            <Statistic
              title="Doanh thu trực tuyến"
              value={onlineRevenue || ""}
              valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default RevenueFilter;
