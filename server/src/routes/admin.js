const router=require("express").Router();const auth=require("../middleware/auth");const {admin}=require("../middleware/auth");const User=require("../models/User");const Donor=require("../models/DonorRegistration");const Recipient=require("../models/RecipientRequest");
router.use(auth,admin);
router.get("/stats",async(req,res)=>res.json({users:await User.countDocuments(),donors:await Donor.countDocuments({registrationStatus:"active"}),recipients:await Recipient.countDocuments({requestStatus:"active"}),pendingDonors:await Donor.countDocuments({verificationStatus:"pending"}),pendingRecipients:await Recipient.countDocuments({verificationStatus:"pending"})}));
router.get("/users",async(req,res)=>res.json(await User.find().select("-passwordHash").sort({createdAt:-1}).limit(100)));
router.put("/donors/:id/verify",async(req,res)=>res.json(await Donor.findByIdAndUpdate(req.params.id,{verificationStatus:req.body.status},{new:true})));
router.put("/recipients/:id/verify",async(req,res)=>res.json(await Recipient.findByIdAndUpdate(req.params.id,{verificationStatus:req.body.status},{new:true})));
router.put("/users/:id/suspend",async(req,res)=>res.json(await User.findByIdAndUpdate(req.params.id,{accountStatus:req.body.suspended?"suspended":"active"},{new:true}).select("-passwordHash")));
module.exports=router;
