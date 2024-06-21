import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import dummySellingHistory from '../../dummySellingHistory';
import { Link } from 'react-router-dom';

function Statistics() {
  const [sellingHistory, setSellingHistory] = useState([]);
  const [filter, setFilter] = useState('custom'); // Default filter to 'custom'
  const [customYear, setCustomYear] = useState(new Date().getFullYear()); // Default custom year to current year
  let startYear = new Date().getFullYear();

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
    setCustomYear(parseInt(event.target.value));
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
            return saleYear === customYear;
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

    // Initialize monthly sales for all months of the selected custom year
    if (filter === 'custom') {
      const selectedYear = customYear;
      for (let month = 1; month <= 12; month++) {
        monthlySales[`${selectedYear}-${month}`] = 0;
      }
    } else {
      // Initialize monthly sales for all months within the selected filter range
      for (let year = new Date().getFullYear() - parseInt(filter.replace('years', '')) + 1; year <= new Date().getFullYear(); year++) {
        for (let month = (year === new Date().getFullYear() - parseInt(filter.replace('years', '')) + 1 ? new Date().getMonth() + 1 : 1); month <= 12; month++) {
          monthlySales[`${year}-${month}`] = 0;
        }
      }
    }

    data.forEach(sale => {
      sale.soldDate.forEach(date => {
        const saleDate = new Date(date);
        const year = saleDate.getFullYear();
        const month = saleDate.getMonth() + 1; // Month is zero-indexed

        // Check if the sale is within the selected range
        if (
          (filter === 'custom' && year === customYear) ||
          (filter !== 'custom' && year >= new Date().getFullYear() - parseInt(filter.replace('years', '')) + 1 && year <= new Date().getFullYear())
        ) {
          const monthYear = `${year}-${month}`;
          monthlySales[monthYear] += sale.price * sale.quantitySold;
        }
      });
    });

    return monthlySales;
  };

  const getYearlySales = (data) => {
    const yearlySales = {};

    // Initialize yearly sales for all years within the selected filter range
    for (let year = new Date().getFullYear() - parseInt(filter.replace('years', '')) + 1; year <= new Date().getFullYear(); year++) {
      yearlySales[year] = 0;
    }

    data.forEach(sale => {
      sale.soldDate.forEach(date => {
        const saleDate = new Date(date);
        const year = saleDate.getFullYear();

        // Check if the sale is within the selected range
        if (year >= new Date().getFullYear() - parseInt(filter.replace('years', '')) + 1 && year <= new Date().getFullYear()) {
          yearlySales[year] += sale.price * sale.quantitySold;
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
  const monthNamesShort = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const renderChart = () => {
    let chartData = [];

    if (filter === 'custom') {
      chartData = Object.entries(getMonthlySales(filteredData)).map(([monthYear, amount]) => ({
        monthYear,
        amount
      }));
      startYear = customYear; // Assign customYear to startYear for custom filter
    } else {
      switch (filter) {
        case '1year':
          startYear = new Date().getFullYear() - 1;
          break;
        case '2years':
          startYear = new Date().getFullYear() - 1;
          break;
        case '5years':
          startYear = new Date().getFullYear() - 4;
          break;
        case '10years':
          startYear = new Date().getFullYear() - 9;
          break;
        default:
          startYear = new Date().getFullYear() - 1;
      }

      chartData = Object.entries(getYearlySales(filteredData)).map(([year, amount]) => ({
        year,
        amount
      }));
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={filter === 'custom' ? "monthYear" : "year"}
            tickFormatter={(value) => {
              if (filter === 'custom') {
                const [year, month] = value.split('-');
                return `${monthNamesShort[parseInt(month) - 1]} ${year}`;
              } else {
                return value;
              }
            }}
          />
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
        {Object.entries(getProductWiseSales(filteredData)).map(([product, amount], index) => (
            <li key={product}>
            <Link to={`/product/${product.id}`} className='product-redirect'>
                {index + 1}. {product}: ₹{amount.toFixed(2)}
            </Link>
            </li>
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

    </div>
  );
}

export default Statistics;
