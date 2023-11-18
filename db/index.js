const mongoose=require('mongoose');
// import mongoose from "mongoose"


const mongoConnect=async()=>{
    try {
        const conn=await mongoose.connect(process.env.DATABASE,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log(`MongoDB conected ${conn.connection.host}`)
    } catch (error) {
        console.log('Error connecting database')
        process.exit();
    }
}


module.exports=mongoConnect;