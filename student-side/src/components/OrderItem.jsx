function OrderItem({ item, incrementCount, decrementCount}){
  return (
    <>
      <label>{item.itemName}</label>
      <button type="button" onClick={()=>decrementCount(item.id)}>-</button>
      <input type="number" readOnly value={item.quantity}></input>
      <button type="button" onClick={()=>incrementCount(item.id)}>+</button>
      <br/>
    </>     
  )
}

export default OrderItem;