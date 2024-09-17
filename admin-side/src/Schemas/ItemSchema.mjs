import mongoose from "mongoose"

const ItemsSchema = mongoose.Schema({
  itemName :{
    type: mongoose.Schema.Types.String,
    required: true,
    unique:true,
    lowercase: true
  },
  quantity :{
    type: mongoose.Schema.Types.Number,
    default: 0
  }
  })

  export const Item = mongoose.model("Item",ItemsSchema)