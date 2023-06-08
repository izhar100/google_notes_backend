const express=require("express")
const userRouter=express.Router()
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
require("dotenv").config()
const { UserModel } = require("../models/user.model");

userRouter.post("/register",async(req,res)=>{
    const {name,email,pass}=req.body;
    console.log(req.body)
    try {
        bcrypt.hash(pass,5,async(err,hash)=>{
            if(err){
                return res.json({error:err})
            }else{
                const user=new UserModel({name,email,pass:hash})
                await user.save()
            }
        })
        res.json({msg:"User has been registered",user:req.body})
    } catch (error) {
        res.json({error:error.message})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,pass}=req.body;
    try {
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(pass,user.pass,(err,result)=>{
                if(result){
                    const token=jwt.sign({userID:user._id,user:user.name},process.env.secretKey)
                    res.json({msg:"Login Success",token:token})
                }else{
                    res.json({error:"Wrong credentials"})
                }
            })
        }else{
            res.json({msg:"User does not exist!"})
        }
    } catch (error) {
        res.json({error:error.message})
    }
})

module.exports={
    userRouter
}