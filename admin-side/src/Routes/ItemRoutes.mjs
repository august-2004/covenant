import { Router } from "express";
import { Item } from "../Schemas/ItemSchema.mjs"

const itemRouter = new Router();

itemRouter.post("/items",async (request,response)=>{
  try{
    const { body:items } = request;
    let savedItems = [];
    let unsavedItems =[];
    for(const item of items){
      const itemPresent = await Item.findOne({itemName : item.itemName, mealTime : item.mealTime});
      if(itemPresent){
        unsavedItems.push({ item: item, message: "Item already present"});
        continue;
      }
      const newItem= new Item(item);
      await newItem.save();
      savedItems.push(newItem);
    }
    return response.status(200).send({ savedItems : savedItems, unsavedItems: unsavedItems});
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
        return response.status(200).send({item: deletedItem, status: "Item deleted successfully"});
      }
      return response.status(422).send({status: "Item deletion unsuccessful"});
    }
  }catch(err){
    console.log(err);
    response.status(500).send({error: err});
  }

});

export default itemRouter;