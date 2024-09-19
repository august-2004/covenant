import { Router } from "express";
import { Item } from "../Schemas/ItemSchema.mjs"

const itemRouter = new Router();

itemRouter.post("/items",async (request,response)=>{
  try{
    const { body : { itemName, mealTime}} = request;
    const newItem= new Item({itemName, mealTime});
    await newItem.save();
    response.status(200).send(newItem);
  }catch(err){
    response.status(500).send(err);
  }
});

itemRouter.get("/items", async (request,response)=>{
  try{
    // await Item.deleteMany({});
    // response.status(200).send("Collection deleted");
    const { query: { filter,value }} = request;
    if(!filter || !value){
      const allItems = await Item.find({});
      return response.status(200).send(allItems);
    }
    if(filter && value){
      const items = await Item.find({ [filter]: value });
      response.status(200).send(items);
    } 
  }catch(err){
    response.status(500).send(err);
  } 
});

export default itemRouter;