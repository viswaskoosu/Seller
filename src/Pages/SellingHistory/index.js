import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SellingHistory() {
  const [sellingHistory, setSellingHistory] = useState([]);
  // console.log(sellingHistory)
  // useEffect(() => {
  //   axios.get('http://localhost:4000/product/sellinghistory')
  //     .then(response => {
  //       setSellingHistory(response.data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching selling history:', error);
  //     });
  // }, []);

  return (
    <div>
      <h1>Selling History</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Quantity Sold</th>
            <th>Total Sale Amount</th>
            <th>Buyer</th>
            <th>Transaction ID</th>
            <th>Payment Method</th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
          {sellingHistory.map(item => (
            <tr key={item.transactionId}>
              <td>{item.title}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.quantitySold}</td>
              <td>${item.totalSaleAmount.toFixed(2)}</td>
              <td>{item.buyer.name}</td>
              <td>{item.transactionId}</td>
              <td>{item.paymentMethod}</td>
              <td>{item.orderStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SellingHistory;
