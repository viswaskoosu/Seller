import React, { useState, useEffect } from 'react';
import dummySellingHistory from '../../dummySellingHistory'; // Adjust the path as per your file structure
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, ArcElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import './Statistics.css'
import { Link } from 'react-router-dom';
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, ArcElement, Title, Tooltip, Legend, PointElement);

function Statistics() {
  const [filter, setFilter] = useState('1year');
  const [customYear, setCustomYear] = useState(new Date().getFullYear().toString());
  const [filteredSalesData, setFilteredSalesData] = useState([]);

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    if (selectedFilter !== 'custom') {
      setCustomYear(new Date().getFullYear().toString());
    }
  };

  const handleCustomYearChange = (e) => {
    const inputYear = e.target.value.trim();
    if (/^\d{4}$/.test(inputYear) && parseInt(inputYear, 10) <= new Date().getFullYear()) {
      setCustomYear(inputYear);
    } else {
      setCustomYear('');
    }
  };

  useEffect(() => {
    const currentDate = new Date();

    const filterSalesData = () => {
      switch (filter) {
        case '1year':
          return filterByLastNYears(1);
        case '2years':
          return filterByLastNYears(2);
        case '5years':
          return filterByLastNYears(5);
        case '10years':
          return filterByLastNYears(10);
        case 'custom':
          if (customYear) {
            const year = parseInt(customYear, 10);
            return filterByCustomYear(year);
          }
          break;
        default:
          return dummySellingHistory;
      }
    };

    const filterByLastNYears = (years) => {
      const cutoffDate = new Date(currentDate.getFullYear() - years, 0, 1).getTime();
      return dummySellingHistory.map(item => {
        const filteredTransactions = item.transactions.filter(transaction => transaction.soldDate > cutoffDate);
        return { ...item, transactions: filteredTransactions };
      }).filter(item => item.transactions.length > 0);
    };

    const filterByCustomYear = (year) => {
      const startDate = new Date(year, 0, 1).getTime();
      const endDate = new Date(year, 11, 31, 23, 59, 59).getTime();
      return dummySellingHistory.map(item => {
        const filteredTransactions = item.transactions.filter(transaction => {
          const transactionDate = new Date(transaction.soldDate).getTime();
          return transactionDate >= startDate && transactionDate <= endDate;
        });
        return { ...item, transactions: filteredTransactions };
      }).filter(item => item.transactions.length > 0);
    };

    const filteredData = filterSalesData();
    setFilteredSalesData(filteredData);
  }, [filter, customYear]);

  const getYearlyData = (yearsCount) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: yearsCount }, (_, index) => currentYear - yearsCount + 1 + index);
    const data = years.map(year => {
      let totalQuantity = 0;
      let totalAmount = 0;

      filteredSalesData.forEach(item => {
        item.transactions.forEach(transaction => {
          if (new Date(transaction.soldDate).getFullYear() === year) {
            totalQuantity += transaction.quantity;
            totalAmount += transaction.amount;
          }
        });
      });

      return { year, totalQuantity, totalAmount };
    });

    return data;
  };
  const getMonthlyData = () => {
    const year = parseInt(customYear, 10);
    const months = Array.from({ length: 12 }, (_, index) => new Date(year, index, 1).toLocaleString('default', { month: 'short' }));
    const data = months.map((month, index) => {
      let totalQuantity = 0;
      let totalAmount = 0;

      filteredSalesData.forEach(item => {
        item.transactions.forEach(transaction => {
          const transactionDate = new Date(transaction.soldDate);
          if (transactionDate.getFullYear() === year && transactionDate.getMonth() === index) {
            totalQuantity += transaction.quantity;
            totalAmount += transaction.amount;
          }
        });
      });

      return { month, totalQuantity, totalAmount };
    });

    return data;
  };

  const chartData = (data, labels, dataKey, label) => ({
    labels,
    datasets: [
      {
        label: label,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: data.map(d => d[dataKey]),
      },
    ],
  });

  const renderChart = () => {
    if (['1year', '2years', '5years', '10years'].includes(filter)) {
      const yearsCount = parseInt(filter.replace('years', ''), 10);
      const yearlyData = getYearlyData(yearsCount);
      const labels = yearlyData.map(d => d.year);

      const quantityData = chartData(yearlyData, labels, 'totalQuantity', 'Total Quantity Sold');
      const amountData = chartData(yearlyData, labels, 'totalAmount', 'Total Amount Earned');

      return (
        <div className="chart">
          <h3>{`Sales Data for the Last ${yearsCount} Years`}</h3>
          <Bar
          data={quantityData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
          <Bar
            data={amountData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      );
    } else if (filter === 'custom') {
      const monthlyData = getMonthlyData();
      const labels = monthlyData.map(d => d.month);

      const quantityData = chartData(monthlyData, labels, 'totalQuantity', 'Total Quantity Sold');
      const amountData = chartData(monthlyData, labels, 'totalAmount', 'Total Amount Earned');

      return (
        <div className="chart">
          <h3>{`Sales Data for ${customYear}`}</h3>
          <Line
            data={quantityData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
          <Line
            data={amountData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      );
    }
    return null;
  };

  const productSales = filteredSalesData.map(item => {
    const id = item.product.id;
    const productTitle = item.product.title;
    const totalQuantity = item.transactions.reduce((total, transaction) => total + transaction.quantity, 0);
    const totalAmount = item.transactions.reduce((total, transaction) => total + transaction.amount, 0);
    return { productTitle, totalQuantity, totalAmount, id };
  });

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.2)`;
  };

  const pieQuantityData = {
    labels: productSales.map(product => product.productTitle),
    datasets: [
      {
        label: 'Total Quantity Sold',
        backgroundColor: productSales.map(() => getRandomColor()),
        data: productSales.map(product => product.totalQuantity),
      },
    ],
  };

  const pieAmountData = {
    labels: productSales.map(product => product.productTitle),
    datasets: [
      {
        label: 'Total Amount Earned',
        backgroundColor: productSales.map(() => getRandomColor()),
        data: productSales.map(product => product.totalAmount),
      },
    ],
  };

  const mostSoldProduct = productSales.reduce((max, product) => (product.totalQuantity > max.totalQuantity ? product : max), { totalQuantity: -Infinity });
  const leastSoldProduct = productSales.reduce((min, product) => (product.totalQuantity < min.totalQuantity ? product : min), { totalQuantity: Infinity });
  const mostAmountSold = productSales.reduce((max, product) => (product.totalAmount > max.totalAmount ? product : max), { totalAmount: -Infinity });
  const leastAmountSold = productSales.reduce((min, product) => (product.totalAmount < min.totalAmount ? product : min), { totalAmount: Infinity });
  return (
    <div className="statistics">
      <div className="filter-section">
        <label htmlFor="filter">Filter:</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="1year">Last 1 year</option>
          <option value="2years">Last 2 years</option>
          <option value="5years">Last 5 years</option>
          <option value="10years">Last 10 years</option>
          <option value="custom">Custom Year</option>
        </select>
        
        {filter === 'custom' && (
          <input
            type="text"
            value={customYear}
            onChange={handleCustomYearChange}
            placeholder="Enter year (YYYY)"
            maxLength="4"
          />
        )}
      </div>
      <div className="statistics-summary">
        <h3>Sales Summary</h3>
        {console.log(mostSoldProduct.id)}
      <Link to={`/product/${mostSoldProduct.id}`}>
        <p>Most Sold Product (Quantity): {mostSoldProduct.productTitle} ({mostSoldProduct.totalQuantity})</p>
      </Link>

      <Link to={`/product/${leastSoldProduct.id}`}>
      <p>Least Sold Product (Quantity): {leastSoldProduct.productTitle} ({leastSoldProduct.totalQuantity})</p>
      </Link>


      <p>Most Amount Earned (Product): {mostAmountSold.productTitle} ( ₹{mostAmountSold.totalAmount})</p>
      <Link to={`/product/${mostAmountSold.id}`}>
      </Link>

      <Link to={`/product/${leastAmountSold.id}`}>
      <p>Least Amount Earned (Product): {leastAmountSold.productTitle} ( ₹{leastAmountSold.totalAmount})</p>
      </Link>
      </div>
      {renderChart()}

      <div className="pie-charts">
        <h3>Product Sales Distribution (Quantity)</h3>
        <Pie
          data={pieQuantityData}
          options={{
            responsive: true,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => `${context.label}: ${context.raw}`,
                },
              },
            },
          }}
        />

        <h3>Product Sales Distribution (Amount)</h3>
        <Pie
          data={pieAmountData}
          options={{
            responsive: true,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => `${context.label}: ${context.raw}`,
                },
              },
            },
          }}
        />
      </div>


    </div>
  );
}

export default Statistics;
