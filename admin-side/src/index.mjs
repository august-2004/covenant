import "dotenv/config"; 
import express from "express";
import mongoose from "mongoose";
import itemRouter from "./Routes/ItemRoutes.mjs"; 
import orderRouter from "./Routes/OrderRoutes.mjs";
import cors from 'cors'

const app = express();
app.use(cors())
const port = process.env.port || 3000;

app.use(express.json());
app.use(itemRouter);
app.use(orderRouter);

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
  console.log("Database connected")
}).catch((err)=>{
  console.log(`Error : ${err}`)
});

app.listen(port, ()=>{
  console.log(`Running on port ${port}`)
});




