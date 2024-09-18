import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [orderCount, setOrderCount] = useState(1);

  const handleClick = async () => {
    const orderName = `Order ${orderCount}`;  // Use backticks for template literals
    try {
      // Update the endpoint here
      const response = await axios.post('http://localhost:5003/api/order', {
        name: orderName
      });
      alert(response.data.message);  // Should show 'Order placed successfully'
      setOrderCount(orderCount + 1); // Increment order count for the next click
    } catch (error) {
      console.error('Error placing order', error);
      alert('Failed to place order');
    }
  };

  return (
    <div>
      <button onClick={handleClick}>
        Place Order {orderCount}
      </button>
    </div>
  );
}

export default App;
