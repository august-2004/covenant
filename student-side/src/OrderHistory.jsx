import { useEffect, useState } from "react";
import QrMaker from "./QrMaker";
function OrderHistory(props){

    const [orders,setOrders] = useState([])

    const fetchOrders = async () =>{
        try{
            const response = await fetch(`http://localhost:3000/orders/?filter=userID&value=${props.userID}`,{
                method: 'GET'
            });
            const fetchedOrders = await response.json()
            setOrders(fetchedOrders)
        }
        catch(err){
            console.error(err);
        }
    }
    useEffect(()=>{
       fetchOrders(); 
    },[])

    return(
        <div>
            {orders.map((order, index) => (
                <div key={index} style={{
                    border: '2px solid black', 
                    padding: '10px', 
                    margin: '5px'
                  }}>
                    <QrMaker className="order-qr" value={order._id}/>
                    <div className="order-id">Order id: {order._id}</div>
                    <div className="order-userID">User ID: {order.userID}</div>
                    <div className="order-itemName">Item Name: {order.itemName}</div>
                    <div className="order-mealtime">Mealtime: {order.mealTime}</div>
                    <div className="order-quantity">Quantity: {order.quantity}</div>
                    <div className="order-createdAt">Created At: {order.createdAt}</div>
                </div>
            ))}
        </div>
        
    )
}

export default OrderHistory