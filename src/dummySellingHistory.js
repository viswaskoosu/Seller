const dummySellingHistory = [
  {
    product: {
      id: '6673be3a65bc991223ec3955',
      title: 'LED Bulb',
      price: 25.5,
      mrp: 30.8,
      category: 'Home requirements'
    },
    transactions: [
      {
        productId: '6673be3a65bc991223ec3955',
        title: 'LED Bulb',
        deliveryStatus: 1, // Delivered
        quantity: 1,
        soldDate: new Date('2022-05-15').getTime(),
        buyer: {
          id: '666b3653a34c6e81d0f94b0e',
          name: 'Koosu Viswas'
        },
        transactionId: 'abc123',
        paymentMethod: 'Credit Card',
        amount: 25.5 * 1,
      },
      {
        productId: '6673be3a65bc991223ec3955',
        title: 'LED Bulb',
        deliveryStatus: 1, // Delivered
        quantity: 1,
        soldDate: new Date('2021-05-15').getTime(),
        buyer: {
          id: '666b3653a34c6e81d0f94b0e',
          name: 'Koosu Viswas'
        },
        transactionId: 'def456',
        paymentMethod: 'Credit Card',
        amount: 25.5 * 1,
      },
      {
        productId: '6673be3a65bc991223ec3955',
        title: 'LED Bulb',
        deliveryStatus: 1, // Delivered
        quantity: 1,
        soldDate: new Date('2021-05-16').getTime(),
        buyer: {
          id: '666b3653a34c6e81d0f94b0e',
          name: 'Koosu Viswas'
        },
        transactionId: 'ghi789',
        paymentMethod: 'Credit Card',
        amount: 25.5 * 1,
      },
      {
        productId: '6673be3a65bc991223ec3955',
        title: 'LED Bulb',
        deliveryStatus: 1, // Delivered
        quantity: 3,
        soldDate: new Date('2024-05-17').getTime(),
        buyer: {
          id: '666b3653a34c6e81d0f94b0e',
          name: 'Koosu Viswas'
        },
        transactionId: 'jkl012',
        paymentMethod: 'Credit Card',
        amount: 25.5 * 3,
      }
    ]
  },
  {
    product: {
      id: '6673be3a65bc991223ec3973',
      title: 'HDPE Pipes',
      price: 220,
      mrp: 250,
      category: 'PVC, FRP, HDPE & Other Plastic Pipes'
    },
    transactions: [
      {
        productId: '6673be3a65bc991223ec3973',
        title: 'HDPE Pipes',
        deliveryStatus: 1, // Delivered
        quantity: 2,
        soldDate: new Date('2023-07-20').getTime(),
        buyer: {
          id: '6673be3a65bc991223ec397e',
          name: 'John Doe'
        },
        transactionId: 'mno456',
        paymentMethod: 'PayPal',
        amount: 220 * 2,
      },
      {
        productId: '6673be3a65bc991223ec3973',
        title: 'HDPE Pipes',
        deliveryStatus: -1, // Not Yet Shipped
        quantity: 1,
        soldDate: new Date('2024-03-10').getTime(),
        buyer: {
          id: '6673be3a65bc991223ec397f',
          name: 'Jane Smith'
        },
        transactionId: 'pqr789',
        paymentMethod: 'Credit Card',
        amount: 220 * 1,
      }
    ]
  },
  {
    product: {
      id: '6673be3a65bc991223ec3975',
      title: 'FRP Pipes',
      price: 300,
      mrp: 350,
      category: 'PVC, FRP, HDPE & Other Plastic Pipes'
    },
    transactions: [
      {
        productId: '6673be3a65bc991223ec3975',
        title: 'FRP Pipes',
        deliveryStatus: 0, // Shipped
        quantity: 1,
        soldDate: new Date('2023-09-05').getTime(),
        buyer: {
          id: '6673be3a65bc991223ec3980',
          name: 'Michael Brown'
        },
        transactionId: 'stu123',
        paymentMethod: 'Bank Transfer',
        amount: 300 * 1,
      }
    ]
  },
  {
    product: {
      id: '6673be3a65bc991223ec3977',
      title: 'HDPE Sprinkler Pipes',
      price: 150,
      mrp: 180,
      category: 'PVC, FRP, HDPE & Other Plastic Pipes'
    },
    transactions: [
      {
        productId: '6673be3a65bc991223ec3977',
        title: 'HDPE Sprinkler Pipes',
        deliveryStatus: 1, // Delivered
        quantity: 3,
        soldDate: new Date('2023-11-15').getTime(),
        buyer: {
          id: '6673be3a65bc991223ec3981',
          name: 'Emily Davis'
        },
        transactionId: 'vwx456',
        paymentMethod: 'Credit Card',
        amount: 150 * 3,
      },
      {
        productId: '6673be3a65bc991223ec3977',
        title: 'HDPE Sprinkler Pipes',
        deliveryStatus: 1, // Delivered
        quantity: 2,
        soldDate: new Date('2024-01-20').getTime(),
        buyer: {
          id: '6673be3a65bc991223ec3982',
          name: 'Chris Wilson'
        },
        transactionId: 'yzab789',
        paymentMethod: 'PayPal',
        amount: 150 * 2,
      }
    ]
  }
];

export default dummySellingHistory;
