// in this we will create our shcema and model 
 import mongoose, { model } from "mongoose";

 const userSchema= new mongoose.Schema({

    userName:{
        type:String,
        required: true,
        unique: true,
        trim:true
    },

    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },

    password:{
        type:String,
        required:true,
        trim:true
    }

 });

 // model 
const userModel= mongoose.model('User',userSchema)
export default userModel