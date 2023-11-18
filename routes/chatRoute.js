const express=require('express');
const {accessChat,fetchChats,createGroupChat,addToGroup,removeFromGroup} =require('../controllers/chatController')
const router=express.Router();


router.post('/api/chat',accessChat);
router.get('/api/chat',fetchChats);
router.post('/api/group',createGroupChat)
router.put('/api/addtogroup',addToGroup)
router.put('/api/removefromgroup',removeFromGroup)

module.exports=router;