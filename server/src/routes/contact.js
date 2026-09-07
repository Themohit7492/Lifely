const router=require("express").Router();const auth=require("../middleware/auth");const Contact=require("../models/ContactRequest");const Notification=require("../models/Notification");
router.post("/",auth,async(req,res)=>{const c=await Contact.create({...req.body,requesterId:req.user._id});await Notification.create({userId:req.body.targetUserId,type:"contact_request",title:"New contact request",message:"Someone wants to contact you about a donation/request.",data:{contactRequestId:c._id}});res.status(201).json(c);});
router.get("/",auth,async(req,res)=>res.json(await Contact.find({$or:[{requesterId:req.user._id},{targetUserId:req.user._id}]}).sort({createdAt:-1})));
router.put("/:id",auth,async(req,res)=>{const c=await Contact.findOne({_id:req.params.id,targetUserId:req.user._id});if(!c)return res.status(404).json({message:"Request not found."});c.status=req.body.status==="accepted"?"accepted":"declined";await c.save();res.json(c);});
module.exports=router;
