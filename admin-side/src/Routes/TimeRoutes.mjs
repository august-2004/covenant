import { Mealtime } from "../Schemas/MealtimeSchema.mjs";
import { Router } from "express";


const timeRouter=new Router();


timeRouter.get("/time",async(req,res)=>{
    const meal=req.query.meal;
    const timings=await Mealtime.find({mealtime:meal});
    res.status(200).send(timings);


});

timeRouter.post("/time",async(req,res)=>{
    const {opening,closing,meal}=req.body;
    console.log(opening,closing,meal);
    const filter={mealtime:meal};
    const update={openingTime:opening,closingTime:closing};
    const doc=await Mealtime.findOneAndUpdate(filter,update);
    res.status(200).send({json:"updated succesfully"});
})

export default timeRouter;