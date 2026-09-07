const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},
 requiredDonationType:{type:String,index:true},
 bloodInformation:{bloodGroup:String,rhFactor:String,quantity:String},
 requestInformation:{description:String,medicalContext:String},
 hospitalInformation:{name:String,city:String,contact:String},
 location:{country:String,state:String,city:String,postalCode:String},
 urgency:{type:String,enum:["critical","urgent","soon","planned"],default:"planned",index:true},
 requiredBy:Date,
 contactPreferences:{method:String,phoneVisible:Boolean,emailVisible:Boolean},
 verificationStatus:{type:String,enum:["pending","verified","rejected","suspended"],default:"pending"},
 requestStatus:{type:String,enum:["draft","active","fulfilled","closed","suspended","expired"],default:"active"},
 closedAt:Date
},{timestamps:true});
schema.index({requiredDonationType:1,"location.city":1,urgency:1,requestStatus:1});
module.exports=mongoose.model("RecipientRequest",schema);
