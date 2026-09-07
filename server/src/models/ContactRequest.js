const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 requesterId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
 targetUserId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
 donorId:{type:mongoose.Schema.Types.ObjectId,ref:"DonorRegistration"},
 recipientId:{type:mongoose.Schema.Types.ObjectId,ref:"RecipientRequest"},
 message:{type:String,maxlength:1000},
 status:{type:String,enum:["pending","accepted","declined"],default:"pending"}
},{timestamps:true});
module.exports=mongoose.model("ContactRequest",schema);
