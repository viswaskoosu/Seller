import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './SellingHistory.css';

const dummySellingHistory = [
  {
    transactionId: 'abc123',
    product: {
      id: '6673be3a65bc991223ec3955',
      title: 'LED Bulb',
      price: 7.99,
      mrp: 9.99,
      category: 'Home requirements'
    },
    price: 25.5,
    quantitySold: 2,
    totalSaleAmount: 51,
    buyer: {
      id: '666b3653a34c6e81d0f94b0e',
      name: 'Koosu Viswas'
    },
    paymentMethod: 'Credit Card',
    orderStatus: 1, // 1 for Delivered
    SoldDate: new Date('2024-05-15').getTime(), // Set date to 15th May 2024
  },
  {
    transactionId: 'xyz789',
    product: {
      id: '6673be3a65bc991223ec396d',
      title: 'Aluminium Panel',
      price: 400,
      mrp: 450,
      category: 'Building Panels & Cladding Materials'
    },
    price: 15,
    quantitySold: 1,
    totalSaleAmount: 15,
    buyer: {
      id: '6673c1f365bc991223ec4fb3',
      name: 'VISWAS KOOSU'
    },
    paymentMethod: 'PayPal',
    orderStatus: 0, // 0 for Shipped
    SoldDate: Date.now(),
  },
];

function SellingHistory() {
  const [sellingHistory, setSellingHistory] = useState(dummySellingHistory);
  const [filter, setFilter] = useState('all'); // Default filter option

  // Function to handle filter change
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Function to filter and sort selling history based on the selected filter option
  const filterAndSortHistory = () => {
    const currentDate = new Date();
    let fromDate;

    switch (filter) {
      case 'all':
        return sellingHistory.slice().sort((a, b) => b.SoldDate - a.SoldDate); // Sort by SoldDate in descending order
      case '3months':
        fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 3, currentDate.getDate());
        break;
      case '6months':
        fromDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 6, currentDate.getDate());
        break;
      case '1year':
        fromDate = new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate());
        break;
      case '2years':
        fromDate = new Date(currentDate.getFullYear() - 2, currentDate.getMonth(), currentDate.getDate());
        break;
      case '5years':
        fromDate = new Date(currentDate.getFullYear() - 5, currentDate.getMonth(), currentDate.getDate());
        break;
      default:
        return sellingHistory; // Return original list if filter is invalid
    }

    // Filter based on fromDate and sort by SoldDate in descending order
    return sellingHistory.filter(item => item.SoldDate >= fromDate.getTime()).sort((a, b) => b.SoldDate - a.SoldDate);
  };

  // Update filtered and sorted history whenever filter or sellingHistory changes
  useEffect(() => {
    const filteredHistory = filterAndSortHistory();
    setSellingHistory(filteredHistory);
  }, [filter, sellingHistory]);

  // Function to format date as per requirement
  const formatDate = (timestamp) => {
    const dateObject = new Date(timestamp);
    if (isNaN(dateObject.getTime())) {
      return 'Invalid Date';
    }
    return dateObject.toLocaleDateString('en-US'); // Adjust locale as per your requirement
  };

  // Function to render order status based on the given orderStatus value
  const renderOrderStatus = (status) => {
    return status === 1 ? 'Delivered' : 'Shipped';
  };

  return (
    <div className="selling-history-container">
      <h1 className="selling-history-title">Selling History</h1>

      {/* Filter dropdown */}
      <div className="selling-history-filter">
        <label htmlFor="filter">Filter by:</label>
        <select id="filter" value={filter} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="3months">Last 3 months</option>
          <option value="6months">Last 6 months</option>
          <option value="1year">Last 1 year</option>
          <option value="2years">Last 2 years</option>
          <option value="5years">Last 5 years</option>
        </select>
      </div>

      {/* Selling history table */}
      <table className="selling-history-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Quantity Sold</th>
            <th>Total Sale Amount</th>
            <th>Buyer</th>
            <th>Transaction ID</th>
            <th>Date</th>
            <th>Payment Method</th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
          {sellingHistory.map((item, index) => (
            <tr key={index}>
              <td>
                <Link to={`/product/${item.product.id}`}>{item.product.title}</Link>
              </td>
              <td>₹{item.price.toFixed(2)}</td>
              <td>{item.quantitySold}</td>
              <td>₹{item.totalSaleAmount.toFixed(2)}</td>
              <td>{item.buyer.name}</td>
              <td>{item.transactionId}</td>
              <td>{formatDate(item.SoldDate)}</td>
              <td>{item.paymentMethod}</td>
              <td>{renderOrderStatus(item.orderStatus)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SellingHistory;
