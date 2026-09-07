const router=require("express").Router();const auth=require("../middleware/auth");const N=require("../models/Notification");
router.get("/",auth,async(req,res)=>res.json(await N.find({userId:req.user._id}).sort({createdAt:-1}).limit(50)));
router.put("/:id/read",auth,async(req,res)=>res.json(await N.findOneAndUpdate({_id:req.params.id,userId:req.user._id},{read:true},{new:true})));
module.exports=router;
