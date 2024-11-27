import { Mealtime } from "../Schemas/MealtimeSchema.mjs";
import { Order } from "../Schemas/OrderSchema.mjs";

export const cancellationTimeValidator = async (id)=>{
  const orderToCancel = await Order.findById(id);
  if(!orderToCancel){
    return false;
  }
  const { mealTime } = orderToCancel;
  const {closingTime} = await Mealtime.findOne({mealtime:mealTime});
  const [closingTimeHours, closingTimeMinutes] = closingTime.split(":").map(Number);
  const cancellationTime = ( closingTimeHours*60 ) + closingTimeMinutes -30;
  const now = new Date();
  const currentTime = ( now.getHours()*60 ) + now.getMinutes();
  if(currentTime<cancellationTime){
    return true;
  }
  console.log("Time limit exceeded");
  return false;
}