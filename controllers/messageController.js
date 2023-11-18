const Chat = require("../models/chatModel.js");
const Message = require("../models/messageModel.js");
const User = require("../models/userModel.js");


const sendMessage=async (req,res)=>{
   const {content,senderId,chatId}=req.body;

   if(!content || !senderId || !chatId){
       return res.status(400).send({message:"send required data"});
   }
   
   var newMessage={
       sender:senderId,
       content:content,
       chat:chatId,
   }



  try {
    var message=await Message.create(newMessage);

    message=await message.populate("sender","name pic");
    message=await message.populate("chat");
    message=await User.populate(message,{
        path:"chat.users",
        select:"name pic email"
    });
    await Chat.findByIdAndUpdate(req.body.chatId,{
        latestMessage:message,
    })

    res.json(message);
    
  } catch (error) {
      res.status(400).send(error.message);
  }


}


const allMessages=async(req,res)=>{
   try {
     const messages=await Message.find({chat:req.params.chatId}).populate(
        "sender","name pic email"
     ).populate("chat");

     res.json(messages);

   } catch (error) {
      res.status(400).send(error.message);
   }
}

module.exports={sendMessage,allMessages};