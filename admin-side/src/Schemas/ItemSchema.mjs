import mongoose from "mongoose"

const ItemsSchema = mongoose.Schema({
  itemName :{
    type: mongoose.Schema.Types.String,
    required: true,
    lowercase: true
  },
  quantity :{
    type: mongoose.Schema.Types.Number,
    default: 0
  },
  mealTime :{
    type: mongoose.Schema.Types.String,
    enum: ["breakfast","lunch","dinner"],
    required: true,
    lowercase:true
  }
  })

  ItemsSchema.index({itemName:1, mealTime:1}, {unique:true});

  export const Item = mongoose.model("Item",ItemsSchema);

