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
    totalSaleAmount: 25.5 * 2,
    buyer: {
      id: '666b3653a34c6e81d0f94b0e',
      name: 'Koosu Viswas'
    },
    paymentMethod: 'Credit Card',
    orderStatus: 1,
    soldDate: [
      new Date('2022-05-15').getTime(),
      new Date('2024-05-15').getTime()
    ],
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
    quantitySold: 3,
    totalSaleAmount: 15 * 3,
    buyer: {
      id: '6673c1f365bc991223ec4fb3',
      name: 'VISWAS KOOSU'
    },
    paymentMethod: 'PayPal',
    orderStatus: 0,
    soldDate: [
      new Date('2019-04-10').getTime(),
      new Date('2020-04-10').getTime(),
      new Date('2021-04-10').getTime()
    ],
  },
  {
    transactionId: 'def456',
    product: {
      id: '6673be3a65bc991223ec396f',
      title: 'Fibre Cement Board',
      price: 550,
      mrp: 600,
      category: 'Building Panels & Cladding Materials'
    },
    price: 550,
    quantitySold: 5,
    totalSaleAmount: 550 * 5,
    buyer: {
      id: '666b3653a34c6e81d0f94b0e',
      name: 'John Doe'
    },
    paymentMethod: 'Debit Card',
    orderStatus: 1,
    soldDate: [
      new Date('2021-03-15').getTime(),
      new Date('2022-03-15').getTime(),
      new Date('2023-03-15').getTime(),
      new Date('2023-03-16').getTime(),
      new Date('2023-03-17').getTime()
    ],
  },
  {
    transactionId: 'ghi101',
    product: {
      id: '6673be3a65bc991223ec3971',
      title: 'PVC Pipes',
      price: 130,
      mrp: 150,
      category: 'PVC, FRP, HDPE & Other Plastic Pipes'
    },
    price: 130,
    quantitySold: 10,
    totalSaleAmount: 130 * 10,
    buyer: {
      id: '667414df9f0b1f7446cbb1bd',
      name: 'Jane Doe'
    },
    paymentMethod: 'Debit Card',
    orderStatus: 1,
    soldDate: [
      new Date('2018-07-21').getTime(),
      new Date('2019-07-21').getTime(),
      new Date('2020-07-21').getTime(),
      new Date('2021-07-21').getTime(),
      new Date('2022-07-21').getTime(),
      new Date('2022-07-22').getTime(),
      new Date('2023-07-21').getTime(),
      new Date('2023-07-22').getTime(),
      new Date('2023-07-23').getTime(),
      new Date('2023-07-24').getTime()
    ],
  },
  {
    transactionId: 'jkl345',
    product: {
      id: '6673be3a65bc991223ec3973',
      title: 'HDPE Pipes',
      price: 220,
      mrp: 250,
      category: 'PVC, FRP, HDPE & Other Plastic Pipes'
    },
    price: 220,
    quantitySold: 7,
    totalSaleAmount: 220 * 7,
    buyer: {
      id: '666b3653a34c6e81d0f94b0e',
      name: 'Alice Smith'
    },
    paymentMethod: 'Credit Card',
    orderStatus: 1,
    soldDate: [
      new Date('2019-06-10').getTime(),
      new Date('2020-06-10').getTime(),
      new Date('2021-06-10').getTime(),
      new Date('2022-06-10').getTime(),
      new Date('2023-06-10').getTime(),
      new Date('2023-06-11').getTime(),
      new Date('2023-06-12').getTime()
    ],
  },
  {
    transactionId: 'mno678',
    product: {
      id: '6673be3a65bc991223ec3975',
      title: 'FRP Pipes',
      price: 300,
      mrp: 350,
      category: 'PVC, FRP, HDPE & Other Plastic Pipes'
    },
    price: 300,
    quantitySold: 4,
    totalSaleAmount: 300 * 4,
    buyer: {
      id: '666b3653a34c6e81d0f94b0e',
      name: 'Bob Brown'
    },
    paymentMethod: 'PayPal',
    orderStatus: 1,
    soldDate: [
      new Date('2021-05-15').getTime(),
      new Date('2022-05-15').getTime(),
      new Date('2023-05-15').getTime(),
      new Date('2023-05-16').getTime()
    ],
  },
  {
    transactionId: 'pqr901',
    product: {
      id: '6673be3a65bc991223ec3977',
      title: 'HDPE Sprinkler Pipes',
      price: 150,
      mrp: 180,
      category: 'PVC, FRP, HDPE & Other Plastic Pipes'
    },
    price: 150,
    quantitySold: 8,
    totalSaleAmount: 150 * 8,
    buyer: {
      id: '666b3653a34c6e81d0f94b0e',
      name: 'Charlie Davis'
    },
    paymentMethod: 'Debit Card',
    orderStatus: 0,
    soldDate: [
      new Date('2019-09-05').getTime(),
      new Date('2020-09-05').getTime(),
      new Date('2021-09-05').getTime(),
      new Date('2022-09-05').getTime(),
      new Date('2023-09-05').getTime(),
      new Date('2023-09-06').getTime(),
      new Date('2023-09-07').getTime(),
      new Date('2023-09-08').getTime()
    ],
  },
  {
    transactionId: 'stu234',
    product: {
      id: '6673be3a65bc991223ec397d',
      title: 'Hammer Drill',
      price: 89.99,
      mrp: 99.99,
      category: 'Power Tools'
    },
    price: 89.99,
    quantitySold: 6,
    totalSaleAmount: 89.99 * 6,
    buyer: {
      id: '667414df9f0b1f7446cbb1bd',
      name: 'David Evans'
    },
    paymentMethod: 'Credit Card',
    orderStatus: 1,
    soldDate: [
      new Date('2018-08-01').getTime(),
      new Date('2019-08-01').getTime(),
      new Date('2020-08-01').getTime(),
      new Date('2021-08-01').getTime(),
      new Date('2022-08-01').getTime(),
      new Date('2023-08-01').getTime()
    ],
  },
  {
    transactionId: 'vwx567',
    product: {
      id: '6673be3a65bc991223ec397f',
      title: 'Bosch Professional GSB 180-LI',
      price: 10595,
      mrp: 10995,
      category: 'Power Tools'
    },
    price: 10595,
    quantitySold: 3,
    totalSaleAmount: 10595 * 3,
    buyer: {
      id: '666b3653a34c6e81d0f94b0e',
      name: 'Eve Fisher'
    },
    paymentMethod: 'PayPal',
    orderStatus: 1,
    soldDate: [
      new Date('2021-11-11').getTime(),
      new Date('2022-11-11').getTime(),
      new Date('2023-11-11').getTime()
    ],
  },
  {
    transactionId: 'yza890',
    product: {
      id: '6673be3a65bc991223ec3981',
      title: 'Hitachi C10FCG 15-Amp 10" Single Bevel Compound Miter Saw',
      price: 12500,
      mrp: 12900,
      category: 'Power Tools'
    },
    price: 12500,
    quantitySold: 5,
    totalSaleAmount: 12500 * 5,
    buyer: {
      id: '667414df9f0b1f7446cbb1bd',
      name: 'Frank Green'
    },
    paymentMethod: 'Debit Card',
    orderStatus: 0,
    soldDate: [
      new Date('2018-12-12').getTime(),
      new Date('2019-12-12').getTime(),
      new Date('2020-12-12').getTime(),
      new Date('2021-12-12').getTime(),
      new Date('2022-12-12').getTime()
    ],
  },
  {
    transactionId: 'bcd012',
    product: {
      id: '6673be3a65bc991223ec3983',
      title: 'Makita 5007Mg Magnesium 7-1/4-Inch Circular Saw',
      price: 8999,
      mrp: 9499,
      category: 'Power Tools'
    },
    price: 8999,
    quantitySold: 7,
    totalSaleAmount: 8999 * 7,
    buyer: {
      id: '667414df9f0b1f7446cbb1bd',
      name: 'Grace Hall'
    },
    paymentMethod: 'Credit Card',
    orderStatus: 1,
    soldDate: [
      new Date('2020-01-15').getTime(),
      new Date('2021-01-15').getTime(),
      new Date('2022-01-15').getTime(),
      new Date('2023-01-15').getTime(),
      new Date('2023-01-16').getTime(),
      new Date('2023-01-17').getTime(),
      new Date('2023-01-18').getTime()
    ],
  },
  {
    transactionId: 'efg345',
    product: {
      id: '6673be3a65bc991223ec3985',
      title: 'Dewalt DW745S Compact Job Site Table Saw',
      price: 17500,
      mrp: 18000,
      category: 'Power Tools'
    },
    price: 17500,
    quantitySold: 4,
    totalSaleAmount: 17500 * 4,
    buyer: {
      id: '666b3653a34c6e81d0f94b0e',
      name: 'Hannah Johnson'
    },
    paymentMethod: 'PayPal',
    orderStatus: 1,
    soldDate: [
      new Date('2021-04-04').getTime(),
      new Date('2022-04-04').getTime(),
      new Date('2023-04-04').getTime(),
      new Date('2023-04-05').getTime()
    ],
  },
  {
    transactionId: 'hij678',
    product: {
      id: '6673be3a65bc991223ec3987',
      title: 'Bosch 4100-09 10-Inch Worksite Table Saw with Gravity-Rise Stand',
      price: 21500,
      mrp: 22000,
      category: 'Power Tools'
    },
    price: 21500,
    quantitySold: 5,
    totalSaleAmount: 21500 * 5,
    buyer: {
      id: '667414df9f0b1f7446cbb1bd',
      name: 'Ivy King'
    },
    paymentMethod: 'Credit Card',
    orderStatus: 0,
    soldDate: [
      new Date('2018-02-18').getTime(),
      new Date('2019-02-18').getTime(),
      new Date('2020-02-18').getTime(),
      new Date('2021-02-18').getTime(),
      new Date('2022-02-18').getTime()
    ],
  },
  {
    transactionId: 'klm901',
    product: {
      id: '6673be3a65bc991223ec3989',
      title: 'Bosch JS470E 120-Volt Top-Handle Jigsaw',
      price: 8995,
      mrp: 9495,
      category: 'Power Tools'
    },
    price: 8995,
    quantitySold: 6,
    totalSaleAmount: 8995 * 6,
    buyer: {
      id: '666b3653a34c6e81d0f94b0e',
      name: 'Jack Lee'
    },
    paymentMethod: 'Debit Card',
    orderStatus: 1,
    soldDate: [
      new Date('2021-03-03').getTime(),
      new Date('2022-03-03').getTime(),
      new Date('2023-03-03').getTime(),
      new Date('2023-03-04').getTime(),
      new Date('2023-03-05').getTime(),
      new Date('2023-03-06').getTime()
    ],
  },
  {
    transactionId: 'nop234',
    product: {
      id: '6673be3a65bc991223ec398b',
      title: 'DEWALT DC970K-2 18-Volt Compact Drill/Driver Kit',
      price: 6995,
      mrp: 7495,
      category: 'Power Tools'
    },
    price: 6995,
    quantitySold: 7,
    totalSaleAmount: 6995 * 7,
    buyer: {
      id: '667414df9f0b1f7446cbb1bd',
      name: 'Karen Lewis'
    },
    paymentMethod: 'PayPal',
    orderStatus: 1,
    soldDate: [
      new Date('2020-06-06').getTime(),
      new Date('2021-06-06').getTime(),
      new Date('2022-06-06').getTime(),
      new Date('2023-06-06').getTime(),
      new Date('2023-06-07').getTime(),
      new Date('2023-06-08').getTime(),
      new Date('2023-06-09').getTime()
    ],
  },
  {
    transactionId: 'qrs567',
    product: {
      id: '6673be3a65bc991223ec398d',
      title: 'Milwaukee 2763-22 M18 1/2" Inch Impact Wrench',
      price: 11995,
      mrp: 12495,
      category: 'Power Tools'
    },
    price: 11995,
    quantitySold: 4,
    totalSaleAmount: 11995 * 4,
    buyer: {
      id: '666b3653a34c6e81d0f94b0e',
      name: 'Liam Martin'
    },
    paymentMethod: 'Credit Card',
    orderStatus: 0,
    soldDate: [
      new Date('2020-09-09').getTime(),
      new Date('2021-09-09').getTime(),
      new Date('2022-09-09').getTime(),
      new Date('2023-09-09').getTime()
    ],
  },
  {
    transactionId: 'tuv890',
    product: {
      id: '6673be3a65bc991223ec398f',
      title: 'Bosch Bare-Tool CRS180B 18-Volt Lithium-Ion Reciprocating Saw',
      price: 6999,
      mrp: 7499,
      category: 'Power Tools'
    },
    price: 6999,
    quantitySold: 8,
    totalSaleAmount: 6999 * 8,
    buyer: {
      id: '667414df9f0b1f7446cbb1bd',
      name: 'Mason Nelson'
    },
    paymentMethod: 'Debit Card',
    orderStatus: 1,
    soldDate: [
      new Date('2018-11-11').getTime(),
      new Date('2019-11-11').getTime(),
      new Date('2020-11-11').getTime(),
      new Date('2021-11-11').getTime(),
      new Date('2022-11-11').getTime(),
      new Date('2023-11-11').getTime(),
      new Date('2023-11-12').getTime(),
      new Date('2023-11-13').getTime()
    ],
  },
  {
    transactionId: 'wxy123',
    product: {
      id: '6673be3a65bc991223ec3991',
      title: 'Makita XPH07Z 18V LXT Lithium-Ion Brushless Cordless Hammer Drill',
      price: 9500,
      mrp: 10000,
      category: 'Power Tools'
    },
    price: 9500,
    quantitySold: 5,
    totalSaleAmount: 9500 * 5,
    buyer: {
      id: '666b3653a34c6e81d0f94b0e',
      name: 'Olivia Parker'
    },
    paymentMethod: 'Credit Card',
    orderStatus: 1,
    soldDate: [
      new Date('2021-10-10').getTime(),
      new Date('2022-10-10').getTime(),
      new Date('2023-10-10').getTime(),
      new Date('2023-10-11').getTime(),
      new Date('2023-10-12').getTime()
    ],
  },
];

export default dummySellingHistory;
