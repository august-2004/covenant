import { Router } from "express";
import { Item } from "../Schemas/ItemSchema.mjs"

const itemRouter = new Router();

itemRouter.post("/items",async (request,response)=>{
  try{
    const { body:items } = request;
    if (!Array.isArray(items)) {
      return response.status(400).send({ error: "Request body should be an array of items." });
    }
    let savedItems = [];
    let unsavedItems =[];
    for(const item of items){
      if (!item.itemName || !item.mealTime) {
        unsavedItems.push({ item:item, error:"Each item must have 'itemName' and 'mealTime'." });
        continue;
      }
      const newItem= new Item(item);
      await newItem.save();
      savedItems.push(newItem);
    }
    if(savedItems.length !== 0){
      return response.status(200).send({ savedItems : savedItems, unsavedItems : unsavedItems });
    }
    response.status(400).send({ savedItems : savedItems, unsavedItems : unsavedItems });
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

itemRouter.delete("/items", async (request,response)=>{
  try{
    const { mealTime, itemName } = request.query;
    if(!mealTime || !itemName){
      return response.status(400).send("ItemName and/or Mealtime fields empty");
    }
    if(mealTime && itemName){
      const deletedItem = await Item.findOneAndDelete({ itemName : itemName, mealTime : mealTime });
      if(deletedItem){
        return response.status(200).send({item: deletedItem, status: "Deleted successfully"});
      }
      return response.status(422).send({ item: deletedItem, status: "Not deleted"});
    }
  }catch(err){
    console.log(err);
    response.status(500).send({error: err});
  }

});

export default itemRouter;