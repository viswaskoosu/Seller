import React, { useState, useEffect } from 'react';
import dummySellingHistory from '../../dummySellingHistory'; // Adjust the path as per your file structure
import { Bar } from 'react-chartjs-2';

function Statistics() {
  const [filter, setFilter] = useState('all'); // Default filter is 'all'
  const [customYear, setCustomYear] = useState(new Date().getFullYear().toString()); // Default custom year is current year
  const [filteredSalesData, setFilteredSalesData] = useState([]);

  // Handle filter change
  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    if (selectedFilter !== 'custom') {
      setCustomYear(new Date().getFullYear().toString()); // Reset custom year input when filter changes
    }
  };

  // Handle custom year input change
  const handleCustomYearChange = (e) => {
    const inputYear = e.target.value.trim();
    if (/^\d{4}$/.test(inputYear) && parseInt(inputYear, 10) <= new Date().getFullYear()) {
      setCustomYear(inputYear);
    } else {
      setCustomYear(''); // Optionally handle invalid input state
    }
  };

  // Effect to update filtered data when filter or customYear changes
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

  // Calculate total sales
  const totalSales = filteredSalesData.reduce((acc, item) => {
    return acc + item.transactions.reduce((total, transaction) => total + transaction.amount, 0);
  }, 0);

  // Calculate product-wise sales
  const productSales = filteredSalesData.map(item => {
    const productTitle = item.product.title;
    const productTotalSales = item.transactions.reduce((total, transaction) => total + transaction.amount, 0);
    const totalTransactions = item.transactions.reduce((total, transaction) => total + transaction.quantity, 0); // Total quantity sold
    return { productTitle, productTotalSales, totalTransactions };
  });

  // Prepare data for sales amount chart
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

  // Prepare data for quantity sold chart
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

  // Find most and least sold products
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
              maintainAspectRatio: true,
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
              maintainAspectRatio: true,
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
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
