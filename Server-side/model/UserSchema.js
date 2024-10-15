const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female","Prefer not to say","male","female","prefer not to say"], //enum is case-sensitive
        required:true
    },
    password:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        immutable:true
    }
})

module.exports=new mongoose.model('User',userSchema)