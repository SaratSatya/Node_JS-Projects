const mongoose =require('mongoose'); 


//schema
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:String,
    email:{
        type:String,
        required:true,
        unique:true
    },
    jobTitle:String,
    gender:String
},{timestamps:true})

const User=mongoose.model("user",userSchema);

module.exports=User;