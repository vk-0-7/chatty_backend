const express=require('express');

const {Register,Login,getallUser}=require('../controllers/userControllerr')



const router =express.Router();

router.post("/user/login", Login);

router.post("/user/register",Register);

router.get('/api/getallUser',getallUser)

module.exports=router;