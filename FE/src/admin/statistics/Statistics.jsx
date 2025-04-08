import React, { useState, useEffect } from 'react';
import { Table, Card, Select, Button, Input, Modal } from 'antd';
import { Bar, Line } from 'react-chartjs-2';
import RevenueFilter from './RevenueFilter';
import axios from 'axios';
import TopProducts from './TopProducts';
import PieChart from './PieChart';
import ChatBot from '../../ClientComponents/chatbot/ChatBot';

const { Option } = Select;

const Statistics = () => {
    const [monthlyData1, setMonthlyData1] = useState([]);
    const [monthlyData2, setMonthlyData2] = useState([]);
    const [selectedMonth1, setSelectedMonth1] = useState(1); // Default to January
    const [selectedMonth2, setSelectedMonth2] = useState(2); // Default to February
    const [yearlyData1, setYearlyData1] = useState([]);
    const [yearlyData2, setYearlyData2] = useState([]);
    const [selectedYear1, setSelectedYear1] = useState(new Date().getFullYear());
    const [selectedYear2, setSelectedYear2] = useState(new Date().getFullYear() - 1);
    const [monthlyRevenue1, setMonthlyRevenue1] = useState([]);
    const [monthlyRevenue2, setMonthlyRevenue2] = useState([]);
    const [yearlyRevenue1, setYearlyRevenue1] = useState([]);
    const [yearlyRevenue2, setYearlyRevenue2] = useState([]);

    useEffect(() => {
        // Fetch data for the first selected month
        axios.get(`http://localhost:8080/order/orders-by-day-january?month=${selectedMonth1}&year=${selectedYear1}`)
            .then(response => {
                const rawData = response.data; // Example: [[5, 1]]
                const daysInMonth = new Date(selectedYear1, selectedMonth1, 0).getDate(); // Get total days in the month
                const filledData = Array.from({ length: daysInMonth }, (_, day) => {
                    const existingData = rawData.find(item => item[0] === day + 1);
                    return [day + 1, existingData ? existingData[1] : 0]; // Fill missing days with 0
                });
                setMonthlyData1(filledData);
            })
            .catch(error => console.error('Error fetching monthly data for month 1:', error));
    }, [selectedMonth1, selectedYear1]);

    useEffect(() => {
        // Fetch data for the second selected month
        axios.get(`http://localhost:8080/order/orders-by-day-january?month=${selectedMonth2}&year=${selectedYear1}`)
            .then(response => {
                const rawData = response.data; // Example: [[5, 1]]
                const daysInMonth = new Date(selectedYear1, selectedMonth2, 0).getDate(); // Get total days in the month
                const filledData = Array.from({ length: daysInMonth }, (_, day) => {
                    const existingData = rawData.find(item => item[0] === day + 1);
                    return [day + 1, existingData ? existingData[1] : 0]; // Fill missing days with 0
                });
                setMonthlyData2(filledData);
            })
            .catch(error => console.error('Error fetching monthly data for month 2:', error));
    }, [selectedMonth2, selectedYear1]);

    useEffect(() => {
        // Fetch data for the first selected year
        axios.get(`http://localhost:8080/order/orders-by-month/${selectedYear1}`)
            .then(response => {
                const rawData = response.data; // Example: [[1, 1], [3, 9], [4, 2]]
                const filledData = Array.from({ length: 12 }, (_, month) => {
                    const existingData = rawData.find(item => item[0] === month + 1);
                    return [month + 1, existingData ? existingData[1] : 0]; // Fill missing months with 0
                });
                setYearlyData1(filledData);
            })
            .catch(error => console.error('Error fetching yearly data for year 1:', error));
    }, [selectedYear1]);

    useEffect(() => {
        // Fetch data for the second selected year
        axios.get(`http://localhost:8080/order/orders-by-month/${selectedYear2}`)
            .then(response => {
                const rawData = response.data; // Example: [[1, 1], [3, 9], [4, 2]]
                const filledData = Array.from({ length: 12 }, (_, month) => {
                    const existingData = rawData.find(item => item[0] === month + 1);
                    return [month + 1, existingData ? existingData[1] : 0]; // Fill missing months with 0
                });
                setYearlyData2(filledData);
            })
            .catch(error => console.error('Error fetching yearly data for year 2:', error));
    }, [selectedYear2]);

    // Fetch revenue data for the first selected month
    useEffect(() => {
        axios.get(`http://localhost:8080/order/orders-revenue-month?month=${selectedMonth1}&year=${selectedYear1}`)
            .then(response => {
                const rawData = response.data; // Example: [[1, 100], [2, 200]]
                const daysInMonth = new Date(selectedYear1, selectedMonth1, 0).getDate();
                const filledData = Array.from({ length: daysInMonth }, (_, day) => {
                    const existingData = rawData.find(item => item[0] === day + 1);
                    return [day + 1, existingData ? existingData[1] : 0];
                });
                setMonthlyRevenue1(filledData);
            })
            .catch(error => console.error('Error fetching monthly revenue for month 1:', error));
    }, [selectedMonth1, selectedYear1]);

    // Fetch revenue data for the second selected month
    useEffect(() => {
        axios.get(`http://localhost:8080/order/orders-revenue-month?month=${selectedMonth2}&year=${selectedYear1}`)
            .then(response => {
                const rawData = response.data;
                const daysInMonth = new Date(selectedYear1, selectedMonth2, 0).getDate();
                const filledData = Array.from({ length: daysInMonth }, (_, day) => {
                    const existingData = rawData.find(item => item[0] === day + 1);
                    return [day + 1, existingData ? existingData[1] : 0];
                });
                setMonthlyRevenue2(filledData);
            })
            .catch(error => console.error('Error fetching monthly revenue for month 2:', error));
    }, [selectedMonth2, selectedYear1]);

    // Fetch revenue data for the first selected year
    useEffect(() => {
        axios.get(`http://localhost:8080/order/orders-revenue-year/${selectedYear1}`)
            .then(response => {
                const rawData = response.data; // Example: [[1, 1000], [2, 2000]]
                const filledData = Array.from({ length: 12 }, (_, month) => {
                    const existingData = rawData.find(item => item[0] === month + 1);
                    return [month + 1, existingData ? existingData[1] : 0];
                });
                setYearlyRevenue1(filledData);
            })
            .catch(error => console.error('Error fetching yearly revenue for year 1:', error));
    }, [selectedYear1]);

    // Fetch revenue data for the second selected year
    useEffect(() => {
        axios.get(`http://localhost:8080/order/orders-revenue-year/${selectedYear2}`)
            .then(response => {
                const rawData = response.data;
                const filledData = Array.from({ length: 12 }, (_, month) => {
                    const existingData = rawData.find(item => item[0] === month + 1);
                    return [month + 1, existingData ? existingData[1] : 0];
                });
                setYearlyRevenue2(filledData);
            })
            .catch(error => console.error('Error fetching yearly revenue for year 2:', error));
    }, [selectedYear2]);

    const monthlyChartData = {
        labels: Array.from({ length: Math.max(monthlyData1.length, monthlyData2.length) }, (_, i) => i + 1), // Days 1 to max days
        datasets: [
            {
                label: `Tháng ${selectedMonth1}`,
                data: monthlyData1.map(item => item[1]), // Use the second element as the value
                fill: true,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            },
            {
                label: `Tháng ${selectedMonth2}`,
                data: monthlyData2.map(item => item[1]), // Use the second element as the value
                fill: true,
                backgroundColor: 'rgba(255,159,64,0.2)',
                borderColor: 'rgba(255,159,64,1)',
            },
        ],
    };

    const yearlyChartData = {
        labels: Array.from({ length: 12 }, (_, i) => i + 1), // Months 1 to 12
        datasets: [
            {
                label: `Năm ${selectedYear1}`,
                data: yearlyData1.map(item => item[1]), // Use the second element as the value
                fill: true,
                backgroundColor: 'rgba(153,102,255,0.2)',
                borderColor: 'rgba(153,102,255,1)',
            },
            {
                label: `Năm ${selectedYear2}`,
                data: yearlyData2.map(item => item[1]), // Use the second element as the value
                fill: true,
                backgroundColor: 'rgba(255,159,64,0.2)',
                borderColor: 'rgba(255,159,64,1)',
            },
        ],
    };

    const monthlyRevenueChartData = {
        labels: Array.from({ length: Math.max(monthlyRevenue1.length, monthlyRevenue2.length) }, (_, i) => i + 1),
        datasets: [
            {
                label: `Doanh thu tháng ${selectedMonth1}`,
                data: monthlyRevenue1.map(item => item[1]),
                fill: true,
                backgroundColor: 'rgba(54,162,235,0.2)',
                borderColor: 'rgba(54,162,235,1)',
            },
            {
                label: `Doanh thu tháng ${selectedMonth2}`,
                data: monthlyRevenue2.map(item => item[1]),
                fill: true,
                backgroundColor: 'rgba(255,99,132,0.2)',
                borderColor: 'rgba(255,99,132,1)',
            },
        ],
    };

    const yearlyRevenueChartData = {
        labels: Array.from({ length: 12 }, (_, i) => i + 1),
        datasets: [
            {
                label: `Doanh thu năm ${selectedYear1}`,
                data: yearlyRevenue1.map(item => item[1]),
                fill: true,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            },
            {
                label: `Doanh thu năm ${selectedYear2}`,
                data: yearlyRevenue2.map(item => item[1]),
                fill: true,
                backgroundColor: 'rgba(255,206,86,0.2)',
                borderColor: 'rgba(255,206,86,1)',
            },
        ],
    };

    return (
        <div style={{ padding: '20px' }}>
            <RevenueFilter />
            <TopProducts />
            <PieChart />

            {/* Monthly Area Chart */}
            <div style={{ marginTop: '20px' }}>
                <h3>Thống kê đơn hàng hoàn thành theo tháng</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div>
                        <label>Chọn tháng 1:</label>
                        <Select
                            value={selectedMonth1}
                            onChange={value => setSelectedMonth1(value)}
                            style={{ width: 120, marginLeft: '10px' }}
                        >
                            {[...Array(12).keys()].map(month => (
                                <Option key={month + 1} value={month + 1}>
                                    Tháng {month + 1}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <label>Chọn tháng 2:</label>
                        <Select
                            value={selectedMonth2}
                            onChange={value => setSelectedMonth2(value)}
                            style={{ width: 120, marginLeft: '10px' }}
                        >
                            {[...Array(12).keys()].map(month => (
                                <Option key={month + 1} value={month + 1}>
                                    Tháng {month + 1}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <label>Chọn năm:</label>
                        <Select
                            value={selectedYear1}
                            onChange={value => setSelectedYear1(value)}
                            style={{ width: 120, marginLeft: '10px' }}
                        >
                            {[...Array(20).keys()].map(offset => {
                                const year = new Date().getFullYear() - offset;
                                return (
                                    <Option key={year} value={year}>
                                        {year}
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                </div>
                <Line data={monthlyChartData} />
                {/* Legend for Monthly Chart */}
                <div style={{ marginTop: '10px', display: 'flex', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '20px', height: '10px', backgroundColor: 'rgba(75,192,192,1)' }}></div>
                        <span>Tháng {selectedMonth1}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '20px', height: '10px', backgroundColor: 'rgba(255,159,64,1)' }}></div>
                        <span>Tháng {selectedMonth2}</span>
                    </div>
                </div>
            </div>

            {/* Yearly Area Chart */}
            <div style={{ marginTop: '20px' }}>
                <h3>Thống kê đơn hàng hoàn thành theo năm</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <label>Chọn năm 1:</label>
                    <Select
                        value={selectedYear1}
                        onChange={value => setSelectedYear1(value)}
                        style={{ width: 120 }}
                    >
                        {[...Array(20).keys()].map(offset => {
                            const year = new Date().getFullYear() - offset;
                            return (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            );
                        })}
                    </Select>
                    <label>Chọn năm 2:</label>
                    <Select
                        value={selectedYear2}
                        onChange={value => setSelectedYear2(value)}
                        style={{ width: 120 }}
                    >
                        {[...Array(20).keys()].map(offset => {
                            const year = new Date().getFullYear() - offset;
                            return (
                                <Option key={year} value={year}>
                                    {year}
                                </Option>
                            );
                        })}
                    </Select>
                </div>
                <Line data={yearlyChartData} />
                {/* Legend for Yearly Chart */}
                <div style={{ marginTop: '10px', display: 'flex', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '20px', height: '10px', backgroundColor: 'rgba(153,102,255,1)' }}></div>
                        <span>Năm {selectedYear1}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '20px', height: '10px', backgroundColor: 'rgba(255,159,64,1)' }}></div>
                        <span>Năm {selectedYear2}</span>
                    </div>
                </div>
            </div>

            {/* Monthly Revenue Chart */}
            <div style={{ marginTop: '20px' }}>
                <h3>So sánh doanh thu theo tháng</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div>
                        <label>Chọn tháng 1:</label>
                        <Select
                            value={selectedMonth1}
                            onChange={value => setSelectedMonth1(value)}
                            style={{ width: 120, marginLeft: '10px' }}
                        >
                            {[...Array(12).keys()].map(month => (
                                <Option key={month + 1} value={month + 1}>
                                    Tháng {month + 1}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <label>Chọn tháng 2:</label>
                        <Select
                            value={selectedMonth2}
                            onChange={value => setSelectedMonth2(value)}
                            style={{ width: 120, marginLeft: '10px' }}
                        >
                            {[...Array(12).keys()].map(month => (
                                <Option key={month + 1} value={month + 1}>
                                    Tháng {month + 1}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <label>Chọn năm:</label>
                        <Select
                            value={selectedYear1}
                            onChange={value => setSelectedYear1(value)}
                            style={{ width: 120, marginLeft: '10px' }}
                        >
                            {[...Array(20).keys()].map(offset => {
                                const year = new Date().getFullYear() - offset;
                                return (
                                    <Option key={year} value={year}>
                                        {year}
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                </div>
                <Line data={monthlyRevenueChartData} />
            </div>

            {/* Yearly Revenue Chart */}
            <div style={{ marginTop: '20px' }}>
                <h3>So sánh doanh thu theo năm</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                    <div>
                        <label>Chọn năm 1:</label>
                        <Select
                            value={selectedYear1}
                            onChange={value => setSelectedYear1(value)}
                            style={{ width: 120 }}
                        >
                            {[...Array(20).keys()].map(offset => {
                                const year = new Date().getFullYear() - offset;
                                return (
                                    <Option key={year} value={year}>
                                        {year}
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                    <div>
                        <label>Chọn năm 2:</label>
                        <Select
                            value={selectedYear2}
                            onChange={value => setSelectedYear2(value)}
                            style={{ width: 120 }}
                        >
                            {[...Array(20).keys()].map(offset => {
                                const year = new Date().getFullYear() - offset;
                                return (
                                    <Option key={year} value={year}>
                                        {year}
                                    </Option>
                                );
                            })}
                        </Select>
                    </div>
                </div>
                <Line data={yearlyRevenueChartData} />
            </div>

        </div>
    );
};

export default Statistics;
