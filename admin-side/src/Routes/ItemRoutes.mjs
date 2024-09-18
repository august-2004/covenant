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
    const allItems = await Item.find({});
    response.status(200).send(allItems);
  }catch(err){
    response.status(500).send(err);
  } 
});

export default itemRouter;