import { useEffect, useState } from "react";

function CancelButton({ order, decrementOrderCount}){

  const cancelOrder = async (order)=>{
    try{
      const response = await fetch(`http://localhost:3000/orders/cancel/${order._id}`,{
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
      if(response.ok){
        console.log("Order Deleted!!",order);
        decrementOrderCount();
      }else{
        console.log("Order cancellation failed", data);
      }
    }catch(err){
      console.log(`Error : ${err}`);
    }

  }

  return (
    <>
      <button onClick={()=>cancelOrder(order)}>Cancel Order</button>
    </>
  )
}

export default CancelButton;