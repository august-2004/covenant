import mongoose from "mongoose"

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
  })

  export const Mealtime = mongoose.model("Mealtime",MealtimeSchema)