import { Router } from "express";
import { Item } from "../Schemas/ItemSchema.mjs"

const itemRouter = new Router();

itemRouter.post("/items",async (request,response)=>{
  try{
    const { body:items } = request;
    if (!Array.isArray(items)) {
      return response.status(400).send({ error: "Request body should be an array of items." });
    }
    let savedItems = []
    for(const item of items){
      if (!item.itemName || !item.mealTime) {
        return response.status(400).send({ error: "Each item must have 'itemName' and 'mealTime'." });
      }
      const newItem= new Item(item);
      await newItem.save();
      savedItems.push(newItem);
    }
    response.status(200).send(savedItems);
  }catch(err){
    response.status(500).send(err);
    console.log(err);
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