const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true ,unique:true},
    password: { type: String, required: true },
    pic: { type: String, required: false, default: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png" },
},
{
    timestamps:true
})

userSchema.methods.matchPassword=async function(password) {
    return await bcrypt.compare(password,this.password)
   
}

userSchema.pre('save',async function (next){
    if(this.isModified('password')){
        this.password= await bcrypt.hash(this.password,10);
        
    }
    next();
    
})

const User=mongoose.model("User",userSchema)

module.exports=User;


// module.exports=User;