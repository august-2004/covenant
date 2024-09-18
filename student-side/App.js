import React, { useState } from 'react';
import axios from 'axios';

const foodItems = [
  { name: 'Pizza', price: 100 },
  { name: 'Biryani', price: 80 },
  { name: 'Curd Rice', price: 50 },
  { name: 'Pasta', price: 90 },
  { name: 'Sambar Rice', price: 60 }
];

function App() {
  const [order, setOrder] = useState(
    foodItems.reduce((acc, item) => ({ ...acc, [item.name]: 0 }), {})
  );

  const incrementItem = (itemName) => {
    setOrder((prevOrder) => ({
      ...prevOrder,
      [itemName]: prevOrder[itemName] + 1
    }));
  };

  const confirmOrder = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/order', order);
      alert('Order confirmed!');
      console.log(response.data);
    } catch (error) {
      console.error('Error confirming order', error);
      alert('Failed to confirm order');
    }
  };
  return (
    <div className="App">
    <h1>Place Your Order</h1>
    <div className="menu">
      {foodItems.map((item) => (
        <div key={item.name} className="food-item">
          <span>{item.name} - ₹{item.price}</span>
          <span>Quantity: {order[item.name]}</span>
          <button onClick={() => incrementItem(item.name)}>Add</button>
        </div>
      ))}
    </div>
    <button className="confirm-btn" onClick={confirmOrder}>Confirm Order</button>
  </div>
);
}

export default App;
