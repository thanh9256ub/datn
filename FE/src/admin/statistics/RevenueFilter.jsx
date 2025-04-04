import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Select } from 'antd';
import axios from 'axios';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const RevenueFilter = () => {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [counterRevenue, setCounterRevenue] = useState(0);
  const [dateRange, setDateRange] = useState(null);
  const [month, setMonth] = useState(null);
  const [year, setYear] = useState(null);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get('http://localhost:8080/order');
        const orders = response.data.data;

        setOrders(orders);

        let filteredOrders = orders;

        // Apply date range filter
        if (dateRange && dateRange[0] && dateRange[1]) {
          console.log('Date Range Start:', dateRange[0].format('YYYY-MM-DD')); // Debug log for start date
          console.log('Date Range End:', dateRange[1].format('YYYY-MM-DD')); // Debug log for end date
          filteredOrders = filteredOrders.filter(order => {
            const orderDate = moment(order.updatedAt); // Parse updatedAt as a moment object
            if (!orderDate.isValid()) {
              console.error('Invalid Order Date:', order.updatedAt); // Log invalid dates
              return false;
            }
            const isInRange = orderDate.isBetween(dateRange[0], dateRange[1], 'days', '[]');
            console.log('Order Date:', orderDate.format('YYYY-MM-DD'), 'Is In Range:', isInRange); // Debug log
            return order.status === 5 && isInRange;
          });
        } else {
          console.warn('Invalid Date Range:', dateRange); // Log invalid date range
        }

        // Apply month filter
        if (month) {
          filteredOrders = filteredOrders.filter(order => {
            const orderMonth = moment(order.date).month() + 1;
            return order.status === 5 && orderMonth === month;
          });
        }

        // Apply year filter
        if (year) {
          filteredOrders = filteredOrders.filter(order => {
            const orderYear = moment(order.date).year();
            return order.status === 5 && orderYear === year;
          });
        }

        // Calculate total revenue
        const revenue = filteredOrders
          .filter(order => order.status === 5)
          .reduce((sum, order) => sum + (order.totalPayment - order.shippingFee), 0);

        setTotalRevenue(revenue);

        // Calculate counter revenue
        const counterRev = filteredOrders
          .filter(order => order.status === 5 && order.orderType === 0)
          .reduce((sum, order) => sum + (order.totalPayment - order.shippingFee), 0);

        setCounterRevenue(counterRev);
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
      }
    };

    fetchRevenue();
  }, [dateRange, month, year]); // Ensure useEffect listens to dateRange changes

  const handleDateChange = (dates) => {
    console.log('Raw Selected Dates:', dates); // Debug log for raw dates
    if (dates && dates[0] && dates[1]) {
      setDateRange([moment(dates[0]), moment(dates[1])]); // Ensure both dates are valid moment objects
      console.log('Valid Date Range Set:', [moment(dates[0]).format('YYYY-MM-DD'), moment(dates[1]).format('YYYY-MM-DD')]); // Debug log for valid date range
    } else {
      setDateRange(null); // Reset dateRange if dates are invalid
      console.warn('Invalid Dates Selected:', dates); // Log invalid dates
    }
    setMonth(null);
    setYear(null);
  };

  const handleMonthChange = (value) => {
    setMonth(value);
    setDateRange(null);
    setYear(null);
  };

  const handleYearChange = (value) => {
    setYear(value);
    setDateRange(null);
    setMonth(null);
  };

  const currentYear = moment().year();
  const years = Array.from({ length: 21 }, (_, i) => currentYear - i);

  return (
    <>
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <RangePicker
            onChange={(dates) => handleDateChange(dates)} // Use onChange to set the selected date range
          />
        </Col>
        <Col span={8}>
          <Select
            placeholder="Chọn tháng"
            style={{ width: '100%' }}
            onChange={handleMonthChange}
            value={month}
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
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <Card style={{ textAlign: 'center', backgroundColor: '#f6ffed', borderColor: '#b7eb8f' }}>
            <Statistic
              title="Doanh thu tổng"
              value={totalRevenue}
              valueStyle={{ color: '#3f8600', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ textAlign: 'center', backgroundColor: '#e6f7ff', borderColor: '#91d5ff' }}>
            <Statistic
              title="Doanh thu tại quầy"
              value={counterRevenue}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ textAlign: 'center', backgroundColor: '#fff1f0', borderColor: '#ffa39e' }}>
            <Statistic
              title="Doanh thu trực tuyến"
              value={totalRevenue - counterRevenue}
              valueStyle={{ color: '#cf1322', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default RevenueFilter;
