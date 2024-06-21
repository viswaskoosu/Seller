import React, { useState, useEffect } from 'react';
import dummySellingHistory from '../../dummySellingHistory'; // Adjust the path as per your file structure
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

function Statistics() {
  const [filter, setFilter] = useState('all');
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
        case 'all':
          return dummySellingHistory;
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

  const totalSales = filteredSalesData.reduce((acc, item) => {
    return acc + item.transactions.reduce((total, transaction) => total + transaction.amount, 0);
  }, 0);

  const productSales = filteredSalesData.map(item => {
    const productTitle = item.product.title;
    const productTotalSales = item.transactions.reduce((total, transaction) => total + transaction.amount, 0);
    const totalTransactions = item.transactions.reduce((total, transaction) => total + transaction.quantity, 0);
    return { productTitle, productTotalSales, totalTransactions };
  });

  const salesChartData = {
    labels: productSales.map(product => product.productTitle),
    datasets: [
      {
        label: 'Total Sales Amount',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: productSales.map(product => product.productTotalSales.toFixed(2)),
      },
    ],
  };

  const quantityChartData = {
    labels: productSales.map(product => product.productTitle),
    datasets: [
      {
        label: 'Total Quantity Sold',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: productSales.map(product => product.totalTransactions),
      },
    ],
  };

  const yearWiseSalesChartData = () => {
    if (['1year', '2years', '5years', '10years'].includes(filter)) {
      const yearsCount = parseInt(filter.replace('years', ''), 10);
      const currentYear = new Date().getFullYear();
      const labels = Array.from({ length: yearsCount }, (_, index) => currentYear - yearsCount + 1 + index);

      const datasets = productSales.map(product => {
        const data = Array.from({ length: yearsCount }, (_, index) => {
          const filteredItems = filteredSalesData.find(item => item.product.title === product.productTitle);
          if (filteredItems) {
            return filteredItems.transactions
              .filter(transaction => {
                const transactionYear = new Date(transaction.soldDate).getFullYear();
                return transactionYear === currentYear - yearsCount + 1 + index;
              })
              .reduce((total, transaction) => total + transaction.amount, 0)
              .toFixed(2);
          }
          return 0;
        });

        return {
          label: product.productTitle,
          backgroundColor: getRandomColor(),
          borderColor: getRandomColor(),
          borderWidth: 1,
          hoverBackgroundColor: getRandomColor(),
          hoverBorderColor: getRandomColor(),
          data,
        };
      });

      return {
        labels: labels.map(year => `${year}`),
        datasets,
      };
    }
    return null;
  };

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r},${g},${b},0.2)`;
  };

  const renderCharts = () => {
    switch (filter) {
      case '1year':
      case '2years':
      case '5years':
      case '10years':
        return (
          <div className="chart">
            <h3>Year-wise Total Sales Amount</h3>
            <Bar
              data={yearWiseSalesChartData()}
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
      case 'custom':
        return (
          <div className="chart">
            <h3>Month-wise Total Sales Amount in {customYear}</h3>
            <Line
              data={monthWiseSalesChartData()}
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
      default:
        return null;
    }
  };

  const monthWiseSalesChartData = () => {
    if (filter === 'custom') {
      const year = parseInt(customYear, 10);
      const labels = Array.from({ length: 12 }, (_, index) => new Date(year, index, 1).toLocaleString('default', { month: 'short' }));

      const datasets = productSales.map(product => {
        const data = labels.map((month, index) => {
          const filteredItems = filteredSalesData.find(item => item.product.title === product.productTitle);
          if (filteredItems) {
            return filteredItems.transactions
              .filter(transaction => {
                const transactionDate = new Date(transaction.soldDate);
                return transactionDate.getFullYear() === year && transactionDate.getMonth() === index;
              })
              .reduce((total, transaction) => total + transaction.amount, 0)
              .toFixed(2);
          }
          return 0;
        });

        return {
          label: product.productTitle,
          data,
          fill: false,
          borderColor: getRandomColor(),
          tension: 0.1,
        };
      });

      return {
        labels,
        datasets,
      };
    }
    return null;
  };

  const mostSoldProduct = productSales.reduce((max, product) => (product.totalTransactions > max.totalTransactions ? product : max), { totalTransactions: -Infinity });
  const leastSoldProduct = productSales.reduce((min, product) => (product.totalTransactions < min.totalTransactions ? product : min), { totalTransactions: Infinity });
  const mostAmountSold = productSales.reduce((max, product) => (product.productTotalSales > max.productTotalSales ? product : max), { productTotalSales: -Infinity });
  const leastAmountSold = productSales.reduce((min, product) => (product.productTotalSales < min.productTotalSales ? product : min), { productTotalSales: Infinity });

  return (
    <div>
      <h2>Statistics</h2>
      <div className="statistics-filter">
        <label htmlFor="filter">Filter by:</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="1year">Last 1 year</option>
          <option value="2years">Last 2 years</option>
          <option value="5years">Last 5 years</option>
          <option value="10years">Last 10 years</option>
          <option value="custom">Custom Year</option>
        </select>
        {filter === 'custom' && (
          <input
            type="number"
            value={customYear}
            onChange={handleCustomYearChange}
            placeholder="Enter year"
            min="2000"
            max={new Date().getFullYear()}
            style={{ marginLeft: '10px', width: '100px' }}
          />
        )}
      </div>
      <p>Total Sales: ₹{totalSales.toFixed(2)}</p>
      <div className="charts-container">
        <div className="chart">
          <h3>Chart: Total Sales Amount</h3>
          <Bar
            data={salesChartData}
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
        <div className="chart">
          <h3>Chart: Total Quantity Sold</h3>
          <Bar
            data={quantityChartData}
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
        {renderCharts()}
      </div>
      <h3>Most and Least Sold Products</h3>
      <p>Most times sold: {mostSoldProduct.totalTransactions} units ({mostSoldProduct.productTitle})</p>
      <p>Least times sold: {leastSoldProduct.totalTransactions} units ({leastSoldProduct.productTitle})</p>
      <p>Most amount sold: ₹{mostAmountSold.productTotalSales.toFixed(2)} ({mostAmountSold.productTitle})</p>
      <p>Least amount sold: ₹{leastAmountSold.productTotalSales.toFixed(2)} ({leastAmountSold.productTitle})</p>
    </div>
  );
}

export default Statistics;