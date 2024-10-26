import "dotenv/config"; 
import express from "express";
import mongoose from "mongoose";
import itemRouter from "./Routes/ItemRoutes.mjs"; 
import orderRouter from "./Routes/OrderRoutes.mjs";
import cors from 'cors'
import timeRouter from "./Routes/TimeRoutes.mjs";
import { Server } from "socket.io";
import http from 'http';
import { Mealtime } from "./Schemas/MealtimeSchema.mjs";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", //anything allowed
    methods: ["GET", "POST"],
  },
});
app.use(cors());

const port = process.env.port || 3000;

app.use(express.json());
app.use(itemRouter);
app.use(orderRouter);
app.use(timeRouter);

mongoose.connect("mongodb+srv://thesevenstarscompany:6gCP3UgjzmaDK7Mj@meals.fgv99.mongodb.net/CanteenDB?retryWrites=true&w=majority&appName=meals")
.then(()=>{
  console.log("Database connected")
}).catch((err)=>{
  console.log(`Error : ${err}`)
});

io.on("connection",(socket)=>{
   console.log("an user connected");
   socket.on("message",(msg)=>{
    console.log(msg);
   });

   socket.on("disconnect",()=>{
    console.log("user disconnected");
   })
});

const timeChangeStream=Mealtime.watch();

timeChangeStream.on("change",(change)=>{
  
  console.log("Meal timings modified");
  console.log("Operation Type:",change.operationType);
  console.log("updated field:",change.updateDescription.updatedFields);
 
  io.emit("changes happened",change);
})


server.listen(port, ()=>{
  console.log(`Running on port ${port}`)
});




