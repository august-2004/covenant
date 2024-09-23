import { Order } from "../Schemas/OrderSchema.mjs";
import { Item } from "../Schemas/ItemSchema.mjs";
import { Router } from "express";
import { timeValidator } from "../Validators/timeValidator.mjs";

const orderRouter = new Router();

orderRouter.post('/orders',async (request,response)=>{
  try{
    const { body:orders } = request;
    let savedOrders = [];
    let unsavedOrders=[];
    if(!Array.isArray(orders)){
      return response.status(400).send({ error: "Request body should be an array of items." });
    }
    for(const order of orders){
      if(!order.itemName || !order.mealTime || !order.quantity || !order.userID){
        unsavedOrders.push({ order: order, error: "Each order must contain userID, itemName, mealTime and quantity" });
        continue;
      }
      const {  itemName, mealTime, quantity:incrementBy} = order;
      const itemPresent = await Item.findOneAndUpdate(
        { itemName,mealTime },
        { $inc:{ quantity : incrementBy }},
        { new : true }
      );
      console.log(itemPresent);
      if(itemPresent!=null){
        const newOrder = new Order(order);
        await newOrder.save();
        savedOrders.push(newOrder);
      }else{
        unsavedOrders.push({ order: order, error: `Item ${itemName} for mealtime ${mealTime} not found` });
        continue;
      }
    }
    if(savedOrders.length !==0){
      return response.status(200).send({ savedOrders: savedOrders, unsavedOrders: unsavedOrders }); 
    }
    response.status(400).send({ savedOrders: savedOrders, unsavedOrders: unsavedOrders });
  }catch(err){
    response.status(500).send(err);
    console.log(err);
  }
});

orderRouter.get('/orders', async (request,response)=>{
  try{
    // await Order.deleteMany({});
    // response.status(200).send("Collection deleted");
    const { query: { filter, value }} = request;
    if(!filter || !value){
      const allOrders = await Order.find({});
      return response.status(200).send(allOrders);
    }
    if(filter && value){
      const orders = await Order.find({ [filter]:value });
      response.status(200).send(orders);
    }  
  }catch(err){
    response.status(500).send(err)
  } 
});

export default orderRouter;
