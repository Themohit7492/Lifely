const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  username:{type:String,required:true,unique:true,trim:true},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  passwordHash:{type:String,required:true},
  firstName:{type:String,required:true}, lastName:{type:String,required:true},
  phone:String, country:String, state:String, city:String,
  role:{type:String,enum:["user","admin"],default:"user"},
  accountStatus:{type:String,enum:["active","suspended"],default:"active"},
  privacySettings:{profileVisibility:{type:String,enum:["public","limited","private"],default:"limited"},phoneVisible:{type:Boolean,default:false},emailVisible:{type:Boolean,default:false}},
  notificationSettings:{email:{type:Boolean,default:true},inApp:{type:Boolean,default:true}}
},{timestamps:true});
module.exports=mongoose.model("User",schema);
