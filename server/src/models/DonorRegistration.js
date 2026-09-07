const mongoose=require("mongoose");
const schema=new mongoose.Schema({
 userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true,index:true},
 donationTypes:{type:[String],index:true},
 bloodInformation:{bloodGroup:String,rhFactor:String,lastDonationDate:Date,previousDonations:Number},
 medicalInformation:{height:Number,weight:Number,allergies:String,medications:String,medicalHistory:String,surgeries:String,chronicConditions:String,recentInfections:String,smoking:String,alcohol:String},
 donationSpecificInformation:mongoose.Schema.Types.Mixed,
 location:{country:String,state:String,city:String,postalCode:String,coordinates:{type:[Number],index:"2dsphere"}},
 contactPreferences:{method:String,phoneVisible:Boolean,emailVisible:Boolean},
 availability:{status:{type:String,enum:["available_now","urgent","advance_notice","temporarily_unavailable","permanently_unavailable"],default:"advance_notice"},days:[String],time:String},
 privacySettings:{visibility:{type:String,enum:["public","limited","private"],default:"limited"}},
 verificationStatus:{type:String,enum:["pending","verified","rejected","suspended","expired"],default:"pending"},
 registrationStatus:{type:String,enum:["draft","active","temporarily_unavailable","suspended","expired","deleted"],default:"active"},
 deletedAt:Date
},{timestamps:true});
schema.index({donationTypes:1,"location.city":1,verificationStatus:1,registrationStatus:1});
module.exports=mongoose.model("DonorRegistration",schema);
