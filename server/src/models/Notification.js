const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",index:true},
 type:String,title:String,message:String,read:{type:Boolean,default:false},data:mongoose.Schema.Types.Mixed
},{timestamps:true});
module.exports=mongoose.model("Notification",schema);
