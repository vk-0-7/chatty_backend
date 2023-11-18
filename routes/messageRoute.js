const express=require('express');
const {sendMessage,allMessages}=require('../controllers/messageController')
const router=express.Router();

router.post('/api/message',sendMessage);
router.get('/api/message/:chatId',allMessages);

module.exports=router;