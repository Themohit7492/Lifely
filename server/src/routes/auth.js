const router=require("express").Router();
const bcrypt=require("bcryptjs"), jwt=require("jsonwebtoken");
const User=require("../models/User");
const issue=(u)=>jwt.sign({id:u._id},process.env.JWT_SECRET,{expiresIn:"7d"});
router.post("/register",async(req,res)=>{
 try{
  const {username,email,password,confirmPassword,firstName,lastName,phone,country,state,city}=req.body;
  if(!username||!email||!password||!firstName||!lastName) return res.status(400).json({message:"Required fields are missing."});
  if(password!==confirmPassword) return res.status(400).json({message:"Passwords do not match."});
  if(password.length<8) return res.status(400).json({message:"Password must be at least 8 characters."});
  if(await User.findOne({$or:[{email:email.toLowerCase()},{username}]})) return res.status(409).json({message:"Username or email already exists."});
  const role=(process.env.ADMIN_EMAILS||"").split(",").map(x=>x.trim().toLowerCase()).includes(email.toLowerCase())?"admin":"user";
  const u=await User.create({username,email,passwordHash:await bcrypt.hash(password,12),firstName,lastName,phone,country,state,city,role});
  res.status(201).json({token:issue(u),user:{id:u._id,username:u.username,email:u.email,firstName:u.firstName,lastName:u.lastName,role:u.role}});
 }catch(e){res.status(500).json({message:e.message});}
});
router.post("/login",async(req,res)=>{
 const {login,password}=req.body; const u=await User.findOne({$or:[{email:(login||"").toLowerCase()},{username:login}]});
 if(!u||!(await bcrypt.compare(password||"",u.passwordHash))) return res.status(401).json({message:"Invalid credentials."});
 res.json({token:issue(u),user:{id:u._id,username:u.username,email:u.email,firstName:u.firstName,lastName:u.lastName,role:u.role}});
});
module.exports=router;
