const jwt=require("jsonwebtoken");
const User=require("../models/User");
const auth=async(req,res,next)=>{
 try{
  const token=(req.headers.authorization||"").replace("Bearer ","");
  if(!token) return res.status(401).json({message:"Please log in to continue."});
  const payload=jwt.verify(token,process.env.JWT_SECRET);
  const user=await User.findById(payload.id).select("-passwordHash");
  if(!user || user.accountStatus==="suspended") return res.status(401).json({message:"Account unavailable."});
  req.user=user; next();
 }catch(e){res.status(401).json({message:"Invalid or expired session."});}
};
auth.admin=(req,res,next)=>req.user?.role==="admin"?next():res.status(403).json({message:"Admin access required."});
module.exports=auth;
