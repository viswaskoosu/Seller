import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Statistics.css';
import SellingHistory from '../SellingHistory';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import dummySellingHistory from '../../dummySellingHistory';

function Statistics() {
  const [sellingHistory, setSellingHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [customYear, setCustomYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      setSellingHistory(dummySellingHistory);
    };
    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleCustomYearChange = (event) => {
    setCustomYear(event.target.value);
  };
  const filterSalesData = () => {
    const filteredHistory = sellingHistory.filter(sale => {
      return sale.soldDate.some(date => {
        const saleDate = new Date(date);
        const saleYear = saleDate.getFullYear();
  
        switch (filter) {
          case '1year':
            return saleYear === new Date().getFullYear();
          case '2years':
            return saleYear >= new Date().getFullYear() - 1 && saleYear <= new Date().getFullYear();
          case '5years':
            return saleYear >= new Date().getFullYear() - 4 && saleYear <= new Date().getFullYear();
          case '10years':
            return saleYear >= new Date().getFullYear() - 9 && saleYear <= new Date().getFullYear();
          case 'custom':
            return saleYear === parseInt(customYear);
          case 'all':
          default:
            return true;
        }
      });
    });
    return filteredHistory;
  };
  
  const calculateTotalSales = (data) => {
    return data.reduce((total, sale) => total + sale.price * sale.quantitySold, 0);
  };

  const getProductWiseSales = (data) => {
    const productSales = {};
    data.forEach(sale => {
      if (productSales[sale.product.title]) {
        productSales[sale.product.title] += sale.price * sale.quantitySold;
      } else {
        productSales[sale.product.title] = sale.price * sale.quantitySold;
      }
    });
    return productSales;
  };

  const getSalesStats = (data) => {
    const stats = {
      mostTimesSold: null,
      leastTimesSold: null,
      mostAmountSold: null,
      leastAmountSold: null,
    };
    
    const productSalesCount = {};
    const productSalesAmount = {};

    data.forEach(sale => {
      const { title } = sale.product;
      const saleAmount = sale.price * sale.quantitySold;

      productSalesCount[title] = (productSalesCount[title] || 0) + sale.quantitySold;
      productSalesAmount[title] = (productSalesAmount[title] || 0) + saleAmount;
    });

    const products = Object.keys(productSalesCount);

    if (products.length > 0) {
      stats.mostTimesSold = products.reduce((a, b) => productSalesCount[a] > productSalesCount[b] ? a : b);
      stats.leastTimesSold = products.reduce((a, b) => productSalesCount[a] < productSalesCount[b] ? a : b);
      stats.mostAmountSold = products.reduce((a, b) => productSalesAmount[a] > productSalesAmount[b] ? a : b);
      stats.leastAmountSold = products.reduce((a, b) => productSalesAmount[a] < productSalesAmount[b] ? a : b);
    }

    return stats;
  };
  const getMonthlySales = (data) => {
    const monthlySales = {};
  
    // Initialize months for the selected year(s)
    const startYear = parseInt(filter === 'custom' ? customYear : new Date().getFullYear() - parseInt(filter.slice(0, 1)));
    const endYear = new Date().getFullYear();
    for (let year = startYear; year <= endYear; year++) {
      for (let month = 1; month <= 12; month++) {
        monthlySales[`${year}-${month}`] = 0;
      }
    }
  
    // Populate with actual sales data
    data.forEach(sale => {
      sale.soldDate.forEach(date => {
        const saleDate = new Date(date);
        const year = saleDate.getFullYear();
        const month = saleDate.getMonth() + 1; // Month is zero-indexed
        const monthYear = `${year}-${month}`;
  
        if (saleDate <= new Date() && (
          (filter === '1year' && year === new Date().getFullYear()) ||
          (filter === '2years' && (year === new Date().getFullYear() || year === new Date().getFullYear() - 1)) ||
          (filter === '5years' && (year >= new Date().getFullYear() - 4 && year <= new Date().getFullYear())) ||
          (filter === '10years' && (year >= new Date().getFullYear() - 9 && year <= new Date().getFullYear())) ||
          (filter === 'custom' && year === parseInt(customYear))
        )) {
          monthlySales[monthYear] += sale.price * sale.quantitySold;
        }
      });
    });
  
    return monthlySales;
  };
  
  
  const getYearlySales = (data) => {
    const yearlySales = {};
    data.forEach(sale => {
      sale.soldDate.forEach(date => {
        const saleDate = new Date(date);
        const year = saleDate.getFullYear();
  
        if (year === parseInt(customYear) && saleDate <= new Date()) { // Ensure sale is within selected year
          if (yearlySales[year]) {
            yearlySales[year] += sale.price * sale.quantitySold;
          } else {
            yearlySales[year] = sale.price * sale.quantitySold;
          }
        }
      });
    });
    return yearlySales;
  };
  
  const filteredData = filterSalesData();
  const monthlySalesData = Object.entries(getMonthlySales(filteredData)).map(([monthYear, amount]) => ({
    monthYear,
    amount
  }));
  const yearlySalesData = Object.entries(getYearlySales(filteredData)).map(([year, amount]) => ({
    year,
    amount
  }));

  const salesStats = getSalesStats(filteredData);
  const totalSales = calculateTotalSales(filteredData);
  const renderChart = () => {
    let chartData = [];
  
    if (filter === '1year' || filter === 'custom') {
      chartData = Object.entries(getMonthlySales(filteredData)).map(([monthYear, amount]) => ({
        monthYear,
        amount
      }));
    } else {
      chartData = Object.entries(getYearlySales(filteredData)).map(([year, amount]) => ({
        year,
        amount
      }));
    }
  
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={filter === '1year' || filter === 'custom' ? "monthYear" : "year"} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  return (
    <div className="statistics-container">
      <h1>Sales Dashboard</h1>

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
          />
        )}
      </div>

      <div className="statistics-summary">
        <h2>Summary</h2>
        <p>Total Sales: ₹{totalSales.toFixed(2)}</p>
        <h3>Product-wise Sales</h3>
        <ul>
          {Object.entries(getProductWiseSales(filteredData)).map(([product, amount]) => (
            <li key={product}>{product}: ₹{amount.toFixed(2)}</li>
          ))}
        </ul>
        <h3>Most and Least Sold Products</h3>
        <p>Most times sold: {salesStats.mostTimesSold} ({(filteredData.filter(sale => sale.product.title === salesStats.mostTimesSold)).reduce((sum, sale) => sum + sale.quantitySold, 0)} times)</p>
        <p>Least times sold: {salesStats.leastTimesSold} ({(filteredData.filter(sale => sale.product.title === salesStats.leastTimesSold)).reduce((sum, sale) => sum + sale.quantitySold, 0)} times)</p>
        <p>Most amount sold: {salesStats.mostAmountSold} (₹{(filteredData.filter(sale => sale.product.title === salesStats.mostAmountSold)).reduce((sum, sale) => sum + sale.price * sale.quantitySold, 0).toFixed(2)})</p>
        <p>Least amount sold: {salesStats.leastAmountSold} (₹{(filteredData.filter(sale => sale.product.title === salesStats.leastAmountSold)).reduce((sum, sale) => sum + sale.price * sale.quantitySold, 0).toFixed(2)})</p>
      </div>

      <div className="statistics-chart">
        <h3>{filter === '1year' || filter === 'custom' ? 'Monthly Sales Chart' : 'Yearly Sales Chart'}</h3>
        {renderChart()}
      </div>

      <SellingHistory />
    </div>
  );
}

export default Statistics;
