import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import TopProducts from './TopProducts';
import PieChart from './PieChart';
import RevenueFilter from './RevenueFilter';

const { Option } = Select;

const Statistics = () => {
    const [monthlyData1, setMonthlyData1] = useState([]);
    const [monthlyData2, setMonthlyData2] = useState([]);
    const [selectedMonth1, setSelectedMonth1] = useState(1);
    const [selectedMonth2, setSelectedMonth2] = useState(2);
    const [yearlyData1, setYearlyData1] = useState([]);
    const [yearlyData2, setYearlyData2] = useState([]);
    const [selectedYear1, setSelectedYear1] = useState(new Date().getFullYear());
    const [selectedYear2, setSelectedYear2] = useState(new Date().getFullYear() - 1);
    const [monthlyRevenue1, setMonthlyRevenue1] = useState([]);
    const [monthlyRevenue2, setMonthlyRevenue2] = useState([]);
    const [yearlyRevenue1, setYearlyRevenue1] = useState([]);
    const [yearlyRevenue2, setYearlyRevenue2] = useState([]);
    // ... (giữ nguyên các state và useEffect hooks như trước)
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

    // Cập nhật các chart data để sử dụng Bar thay vì Line
    const monthlyChartData = {
        labels: Array.from({ length: Math.max(monthlyData1.length, monthlyData2.length) }, (_, i) => i + 1),
        datasets: [
            {
                label: `Tháng ${selectedMonth1}`,
                data: monthlyData1.map(item => item[1]),
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                borderRadius: 4, // Làm tròn góc cột
            },
            {
                label: `Tháng ${selectedMonth2}`,
                data: monthlyData2.map(item => item[1]),
                backgroundColor: 'rgba(255, 159, 64, 0.7)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const yearlyChartData = {
        labels: Array.from({ length: 12 }, (_, i) => ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'][i]),
        datasets: [
            {
                label: `Năm ${selectedYear1}`,
                data: yearlyData1.map(item => item[1]),
                backgroundColor: 'rgba(153, 102, 255, 0.7)',
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: `Năm ${selectedYear2}`,
                data: yearlyData2.map(item => item[1]),
                backgroundColor: 'rgba(255, 159, 64, 0.7)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const monthlyRevenueChartData = {
        labels: Array.from({ length: Math.max(monthlyRevenue1.length, monthlyRevenue2.length) }, (_, i) => i + 1),
        datasets: [
            {
                label: `Doanh thu tháng ${selectedMonth1}`,
                data: monthlyRevenue1.map(item => item[1]),
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: `Doanh thu tháng ${selectedMonth2}`,
                data: monthlyRevenue2.map(item => item[1]),
                backgroundColor: 'rgba(255, 99, 132, 0.7)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const yearlyRevenueChartData = {
        labels: Array.from({ length: 12 }, (_, i) => ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'][i]),
        datasets: [
            {
                label: `Doanh thu năm ${selectedYear1}`,
                data: yearlyRevenue1.map(item => item[1]),
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
            {
                label: `Doanh thu năm ${selectedYear2}`,
                data: yearlyRevenue2.map(item => item[1]),
                backgroundColor: 'rgba(255, 206, 86, 0.7)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    // Cấu hình chung cho các biểu đồ cột
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.parsed.y.toLocaleString();
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString();
                    }
                }
            }
        }
    };

    return (
        <div >
            <RevenueFilter />
            <TopProducts />
            <h2 style={{
                textAlign: 'center',
                margin: '30px 30px',
                fontSize: '24px',
                fontWeight: '700',
                color: '#111827',
                letterSpacing: '0.5px'
            }}>
                Thống kê đơn hàng
            </h2>
            <PieChart />
            <h2 style={{
                textAlign: 'center',
                margin: '30px 30px',
                fontSize: '24px',
                fontWeight: '700',
                color: '#111827',
                letterSpacing: '0.5px'
            }}>
                So sánh đơn hàng và doanh thu
            </h2>
            {/* Grid layout cho các biểu đồ */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
                marginTop: '24px'
            }}>
                {/* Biểu đồ cột theo tháng */}
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ marginBottom: '16px' }}>So sánh đơn hàng hoàn thành theo tháng</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <div>
                            <label>Tháng: </label>
                            <Select
                                value={selectedMonth1}
                                onChange={setSelectedMonth1}
                                style={{ width: 100, marginLeft: '8px' }}
                            >
                                {[...Array(12).keys()].map(month => (
                                    <Option key={month + 1} value={month + 1}>
                                        Tháng {month + 1}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label>Tháng: </label>
                            <Select
                                value={selectedMonth2}
                                onChange={setSelectedMonth2}
                                style={{ width: 100, marginLeft: '8px' }}
                            >
                                {[...Array(12).keys()].map(month => (
                                    <Option key={month + 1} value={month + 1}>
                                        Tháng {month + 1}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label>Năm: </label>
                            <Select
                                value={selectedYear1}
                                onChange={setSelectedYear1}
                                style={{ width: 100, marginLeft: '8px' }}
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
                    <div style={{ height: '300px' }}>
                        <Bar data={monthlyChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Biểu đồ cột theo năm */}
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ marginBottom: '16px' }}>So sánh đơn hàng hoàn thành theo năm</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <div>
                            <label>Năm: </label>
                            <Select
                                value={selectedYear1}
                                onChange={setSelectedYear1}
                                style={{ width: 120, marginLeft: '8px' }}
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
                            <label>Năm: </label>
                            <Select
                                value={selectedYear2}
                                onChange={setSelectedYear2}
                                style={{ width: 120, marginLeft: '8px' }}
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
                    <div style={{ height: '300px' }}>
                        <Bar data={yearlyChartData} options={chartOptions} />
                    </div>
                </div>

                {/* Biểu đồ doanh thu theo tháng */}
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ marginBottom: '16px' }}>So sánh doanh thu theo tháng</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <div>
                            <label>Tháng: </label>
                            <Select
                                value={selectedMonth1}
                                onChange={setSelectedMonth1}
                                style={{ width: 100, marginLeft: '8px' }}
                            >
                                {[...Array(12).keys()].map(month => (
                                    <Option key={month + 1} value={month + 1}>
                                        Tháng {month + 1}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label>Tháng: </label>
                            <Select
                                value={selectedMonth2}
                                onChange={setSelectedMonth2}
                                style={{ width: 100, marginLeft: '8px' }}
                            >
                                {[...Array(12).keys()].map(month => (
                                    <Option key={month + 1} value={month + 1}>
                                        Tháng {month + 1}
                                    </Option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <label>Năm: </label>
                            <Select
                                value={selectedYear1}
                                onChange={setSelectedYear1}
                                style={{ width: 100, marginLeft: '8px' }}
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
                    <div style={{ height: '300px' }}>
                        <Bar data={monthlyRevenueChartData} options={{
                            ...chartOptions,
                            scales: {
                                ...chartOptions.scales,
                                y: {
                                    ...chartOptions.scales.y,
                                    ticks: {
                                        callback: function (value) {
                                            return value.toLocaleString() + 'đ';
                                        }
                                    }
                                }
                            }
                        }} />
                    </div>
                </div>

                {/* Biểu đồ doanh thu theo năm */}
                <div style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ marginBottom: '16px' }}>So sánh doanh thu theo năm</h3>
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                        <div>
                            <label>Năm: </label>
                            <Select
                                value={selectedYear1}
                                onChange={setSelectedYear1}
                                style={{ width: 120, marginLeft: '8px' }}
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
                            <label>Năm: </label>
                            <Select
                                value={selectedYear2}
                                onChange={setSelectedYear2}
                                style={{ width: 120, marginLeft: '8px' }}
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
                    <div style={{ height: '300px' }}>
                        <Bar data={yearlyRevenueChartData} options={{
                            ...chartOptions,
                            scales: {
                                ...chartOptions.scales,
                                y: {
                                    ...chartOptions.scales.y,
                                    ticks: {
                                        callback: function (value) {
                                            return value.toLocaleString() + 'đ';
                                        }
                                    }
                                }
                            }
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Statistics;