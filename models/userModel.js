import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    name:{
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        unique:true,
        required:true,
        index:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:"user"
    },
},{timestamps:true});

const User=mongoose.model('user',userSchema);
export default User;