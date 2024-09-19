import { Order } from "../Schemas/OrderSchema.mjs";
import { Item } from "../Schemas/ItemSchema.mjs";
import { Router } from "express";

const orderRouter = new Router();

orderRouter.post('/orders',async (request,response)=>{
  try{
    const { body } = request;
    const {  itemName, mealTime, quantity:incrementBy} = body;
    const itemPresent = await Item.findOneAndUpdate(
      { itemName,mealTime },
      { $inc:{ quantity : incrementBy }},
      { new : true }
    );
    console.log(itemPresent);
    if(itemPresent!=null){
      const newOrder = new Order(body);
      await newOrder.save();
      response.status(200).send(newOrder);
    }else{
      response.sendStatus(401);
    }
  }catch(err){
    response.status(500).send(err);
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
