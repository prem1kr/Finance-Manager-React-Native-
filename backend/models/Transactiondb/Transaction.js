import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  title: { type: String, required: true },                   
  amount: { type: Number, required: true },                   
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String },                                                
  date: { type: Date, required: true },                                   
  note: { type: String },  
  icon: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "auth", required: true },
});


const TransactionModel = mongoose.model("Transaction", TransactionSchema);
export default TransactionModel;