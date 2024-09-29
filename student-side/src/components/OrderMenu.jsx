import { useState, useEffect } from "react";
import OrderItem from "./orderItem";
function OrderMenu({value}){
  const [ menu, setMenu ] = useState([]);
  const [ order, setOrder ] = useState([]);

  useEffect(()=>{
    const fetchMenu = async ()=>{
      try{
        const response = await fetch(`http://localhost:3000/items?filter=mealTime&value=${value}`);
      if(!response.ok){
        throw new Error("Response not OK");
      }
      const data = await response.json();
      const items = data.map((item)=>(
       { id: item._id, itemName: item.itemName, mealTime: item.mealTime ,quantity: 0 }
      ));
      setMenu(items);
      }catch(err){
        console.log(`Error : ${err}`);
      }
    }
     fetchMenu();
    
  },[value]);

  const incrementCount = (id)=>{
    setMenu((prevMenu) => {
      return prevMenu.map((item) => {
        if (item.id === id) {
          const updatedMenu = { ...item, quantity: item.quantity + 1 };
          console.log("Item count incremented", updatedMenu); 
          return updatedMenu;
        }
        return item;
      });
    });
  }

  const decrementCount = (id)=>{
    setMenu((prevMenu) => {
      return prevMenu.map((item) => {
        if (item.id === id && item.quantity>0) {
          const updatedMenu = { ...item, quantity: item.quantity - 1 };
          console.log("Item count incremented", updatedMenu); 
          return updatedMenu;
        }
        return item;
      });
    });
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
    const newOrder = menu.filter((item)=>item.quantity>0).map((item)=>(
      {
        userID: "user123",
        itemName: item.itemName,
        mealTime: item.mealTime,
        quantity: item.quantity
      }
    ));
    setOrder(newOrder);
    try{
      const response = await fetch("http://localhost:3000/orders",{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newOrder)
      });
      if(response.ok){
        console.log("Order posted", response);
      }else{
        console.log("Order failed");
      } 
      setMenu((prevMenu)=>{
        return prevMenu.map((item)=>(
           {...item, quantity:0}
        ));
      });
      setOrder([]);
    }catch(err){
      console.log(`Error: ${err}`);
    }
    
  }

  return(
    <>
    <h4>{value}</h4>
    <form onSubmit={handleSubmit}>
      {Array.isArray(menu) && menu.length>0 ?
      menu.map((item)=>(
        <OrderItem key={item.id} item={item} incrementCount={incrementCount} decrementCount={decrementCount}/>
      )) : <p>No items available!</p>}
      <button type="submit">Submit</button>
    </form>
    </>
  )

}

export default OrderMenu;