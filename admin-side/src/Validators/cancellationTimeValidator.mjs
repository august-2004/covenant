import { Order } from "../Schemas/OrderSchema.mjs";

export const cancellationTimeValidator = async (id)=>{
  const orderToCancel = await Order.findById(id);
  if(!orderToCancel){
    return false;
  }
  const { createdAt } = orderToCancel;
  const [ orderHours, orderMinutes ] = createdAt.split(":").map(Number);
  const cancellationTime = ( orderHours*60 ) + orderMinutes + 1;
  const now = new Date();
  const currentTime = ( now.getHours()*60 ) + now.getMinutes();
  if(currentTime<cancellationTime){
    console.log(currentTime-cancellationTime);
    return true;
  }
  return false;
}