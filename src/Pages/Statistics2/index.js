import React, { useState, useEffect } from 'react';
import dummySellingHistory from '../../dummySellingHistory'; // Adjust the path as per your file structure
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

function Statistics2() {
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
          return filterByLastNMonths(12);
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

    const filterByLastNMonths = (months) => {
      const cutoffDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - months, 1).getTime();
      return dummySellingHistory.map(item => {
        const filteredTransactions = item.transactions.filter(transaction => transaction.soldDate > cutoffDate);
        return { ...item, transactions: filteredTransactions };
      }).filter(item => item.transactions.length > 0);
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

  const productSales = filteredSalesData.map(item => {
    const productTitle = item.product.title;
    const totalQuantity = item.transactions.reduce((total, transaction) => total + transaction.quantity, 0);
    const totalAmount = item.transactions.reduce((total, transaction) => total + transaction.amount, 0);
    return { productTitle, totalQuantity, totalAmount };
  });

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
        data: productSales.map(product => product.totalQuantity),
      },
    ],
  };

  const amountChartData = {
    labels: productSales.map(product => product.productTitle),
    datasets: [
      {
        label: 'Total Amount Earned',
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75,192,192,0.4)',
        hoverBorderColor: 'rgba(75,192,192,1)',
        data: productSales.map(product => product.totalAmount.toFixed(2)),
      },
    ],
  };
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
        data: productSales.map(product => product.totalAmount.toFixed(2)),
      },
    ],
  };

  const mostSoldProduct = productSales.reduce((max, product) => (product.totalQuantity > max.totalQuantity ? product : max), { totalQuantity: -Infinity });
  const leastSoldProduct = productSales.reduce((min, product) => (product.totalQuantity < min.totalQuantity ? product : min), { totalQuantity: Infinity });
  const mostAmountSold = productSales.reduce((max, product) => (product.totalAmount > max.totalAmount ? product : max), { totalAmount: -Infinity });
  const leastAmountSold = productSales.reduce((min, product) => (product.totalAmount < min.totalAmount ? product : min), { totalAmount: Infinity });

  const combinedMetricProduct = productSales.reduce((max, product) => {
    const metric = product.totalQuantity + product.totalAmount;
    return metric > (max.metric || 0) ? { ...product, metric } : max;
  }, { metric: 0 });


  const renderYearWiseChartData = () => {
    if (['2years', '5years', '10years'].includes(filter)) {
      const yearsCount = parseInt(filter.replace('years', ''), 10);
      const currentYear = new Date().getFullYear();
      const labels = Array.from({ length: yearsCount }, (_, index) => currentYear - yearsCount + 1 + index);

      const datasets = productSales.map(product => {
        const data = Array.from({ length: yearsCount }, (_, index) => {
          const year = currentYear - yearsCount + 1 + index;
          const filteredItems = filteredSalesData.find(item => item.product.title === product.productTitle);
          if (filteredItems) {
            return filteredItems.transactions
              .filter(transaction => new Date(transaction.soldDate).getFullYear() === year)
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

  const renderCharts = () => {
    switch (filter) {
      case '1year':
        return (
          <div className="chart">
            <h3>Month-wise Total Sales Amount in Last 1 Year</h3>
            <Bar
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
      case '2years':
      case '5years':
      case '10years':
        return (
          <div className="chart">
            <h3>Year-wise Total Sales Amount in Last {filter.replace('years', '')} Years</h3>
            <Bar
              data={renderYearWiseChartData()}
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
    const currentYear = new Date().getFullYear();
    const labels = Array.from({ length: 12 }, (_, index) => {
      const month = new Date(currentYear, new Date().getMonth() - 11 + index).toLocaleString('default', { month: 'long' });
      return month;
    });

    const datasets = productSales.map(product => {
      const data = Array.from({ length: 12 }, (_, index) => {
        const month = new Date(currentYear, new Date().getMonth() - 11 + index).getMonth();
        const year = new Date(currentYear, new Date().getMonth() - 11 + index).getFullYear();
        const filteredItems = filteredSalesData.find(item => item.product.title === product.productTitle);
        if (filteredItems) {
          return filteredItems.transactions
            .filter(transaction => new Date(transaction.soldDate).getMonth() === month && new Date(transaction.soldDate).getFullYear() === year)
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
      labels,
      datasets,
    };
  };

  return (
    <div>
      <h2>Statistics2</h2>
      <div className="statistics-filter">
        <label htmlFor="filter">Filter by:</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
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
      <div className="charts-container">
        {renderCharts()}
        <div className="chart">
          <h3>Chart: Total Quantity Sold</h3>
          <Pie data={pieQuantityData} />
        </div>
        <div className="chart">
          <h3>Chart: Total Amount Earned</h3>
          <Pie data={pieAmountData} />
        </div>
      </div>
      <h3>Most and Least Sold Products</h3>
      <p>Most times sold: {mostSoldProduct.totalQuantity} units ({mostSoldProduct.productTitle})</p>
      <p>Least times sold: {leastSoldProduct.totalQuantity} units ({leastSoldProduct.productTitle})</p>
      <p>Most amount sold: ₹{mostAmountSold.totalAmount.toFixed(2)} ({mostAmountSold.productTitle})</p>
      <p>Least amount sold: ₹{leastAmountSold.totalAmount.toFixed(2)} ({leastAmountSold.productTitle})</p>
      <p>Product with highest combined metric (quantity + amount): {combinedMetricProduct.productTitle} with metric {combinedMetricProduct.metric}</p>
    </div>
  );
}

export default Statistics2;
