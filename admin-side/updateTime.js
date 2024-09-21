const express=require('express');
const cors=require('cors');
const mongoose=require('mongoose');



const app=express();
app.use(cors());
app.use(express.json());

/*
const time={
  mealtime:"b/l/d",
  optime:'HH:MM',
  cltime:"HH:MM"
}
post request=>
    fetch('url/settime',{
      method:'POST',
      headers:{
       content-type:"application/json"
      },
      body:JSON.stringify(time)
})
*/

const MealtimeSchema = new mongoose.Schema({
    mealtime :{
      type: String,
      required: true,
      unique:true,
      lowercase: true
    },
    openingTime :{
      type: String,
      required: true
    },
    closingTime :{
      type: String,
      required: true
    }
    },{collection:"mealtime"});
    
const mealmodel=mongoose.model('mealtime',MealtimeSchema);

const timeUpdate=async(meal,opening,closing)=>{
   const updateObj={};
   if(opening){
    updateObj.openingTime=opening;
   }
   if(closing){
    updateObj.closingTime=closing;
   }

    try{
    const result=await mealmodel.findOneAndUpdate(
      {mealtime:meal},
      {$set:updateObj},
      {new:true}

    );
    console.log(result);
    return;
}catch(error){
    console.log(error);

}}





app.post('/setoptime',async (req,res)=>{
   const mealtime=req.body.mealtime;
   const optime=req.body.optime;
   try{
    await timeUpdate(mealtime,optime,null);
    res.status(200).send("done");
   }catch(er){
    console.error(er);
    res.status(500).send('error occures');
   }
})

app.post('/setcltime',async (req,res)=>{
    const mealtime=req.body.mealtime;
    const cltime=req.body.cltime;
    try{
     await timeUpdate(mealtime,null,cltime);
     res.status(200).send("done");
    }catch(er){
     console.error(er);
     res.status(500).send('error occures');
    }
 })



 mongoose.connect("mongodb+srv://thesevenstarscompany:6gCP3UgjzmaDK7Mj@meals.fgv99.mongodb.net/CanteenDB?retryWrites=true&w=majority&appName=meals")
.then(()=>{
  app.listen(3000,()=>{
    console.log(`connected to DB and server is running`);
});
})
.catch((er)=>{
    console.log(er);
})



