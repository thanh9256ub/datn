import React, { useState, useEffect } from 'react';

import { Table, Card } from 'antd';
import { Bar } from 'react-chartjs-2';
import RevenueFilter from './RevenueFilter'; // Import component con
import axios from 'axios';
import TopProducts from './TopProducts'; // Import the new component

const Statistics = () => {
    
   
    

    return (
        <div style={{ padding: '20px' }}>
            <RevenueFilter />
            <TopProducts /> {/* Add the TopProducts component */}
        </div>
    );
};

export default Statistics;
