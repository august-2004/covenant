import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  userID :{
    type: mongoose.Schema.Types.String,
    required : true
  },
  itemName :{
    type: mongoose.Schema.Types.String,
    required : true,
    lowercase: true
  },
  mealTime:{
    type: mongoose.Schema.Types.String,
    enum: ["breakfast", "lunch", "dinner"],
    required : true,
    lowercase: true
  },
  quantity:{
    type: mongoose.Schema.Types.Number,
    required: true,
    min: 1
  },
  createdAt:{
    type : mongoose.Schema.Types.Date,
    default : ()=> Date.now()
  }

});

export const Order = mongoose.model("Order",orderSchema);