import { useState } from "react";
import OrderMenu from "./OrderMenu";
import OrderHistory from "./OrderHistory";

function OrderManager(){
  const [ orderCount, setOrderCount ] = useState(0);

  const incrementOrderCount = ()=>{
    setOrderCount((prevOrderCount)=> prevOrderCount+1);
  }

  const decrementOrderCount = ()=>{
    setOrderCount((prevOrderCount)=> prevOrderCount-1);
  }
  return (
    <>
      <OrderMenu value="breakfast" incrementOrderCount={incrementOrderCount}/>
      <hr></hr>
      <OrderMenu value="lunch" incrementOrderCount={incrementOrderCount}/>
      <hr></hr>
      <OrderMenu value="dinner" incrementOrderCount={incrementOrderCount}/>
      <hr></hr>
      <OrderHistory userID="user123" orderCount={orderCount} decrementOrderCount={decrementOrderCount}/>
    </>
  )

}

export default OrderManager;