import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlySpendingSavingsChart = () => {
  const [spendData, setSpendData] = useState([]);
  const [savingData, setSavingData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    getSpends();
    getSavings();
  }, []);

  const getSpends = async () => {
    try {
      const getData = await axios.get(
        `${import.meta.env.VITE_BASE_API}/api/spends`
      );
      setSpendData(getData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getSavings = async () => {
    try {
      const getData = await axios.get(
        `${import.meta.env.VITE_BASE_API}/api/savings`
      );
      setSavingData(getData.data);
    } catch (error) {
      console.error(error);
    }
  };

  const processData = (data, type) => {
    const filteredData = data.filter(item => new Date(item.createdAt).getFullYear() === selectedYear);
    const monthlyData = Array(12).fill(0);

    filteredData.forEach(item => {
      const month = new Date(item.createdAt).getMonth();
      monthlyData[month] += parseFloat(type === 'spend' ? item.spendMoney : item.savingMoney);
    });

    return monthlyData;
  };

  const years = [...new Set([...spendData, ...savingData].map(item => new Date(item.createdAt).getFullYear()))];

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Spendings',
        data: processData(spendData, 'spend'),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Savings',
        data: processData(savingData, 'saving'),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Monthly Spendings and Savings - ${selectedYear}`,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount (₹)',
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', height: '400px', margin: '0 auto' }}>
      <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
      <Bar data={data} options={options} />
    </div>
  );
};

export default MonthlySpendingSavingsChart;
