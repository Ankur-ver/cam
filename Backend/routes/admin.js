//codefores sync route   [sync and update student details for all student at 2 AM daily]

const express=require('express');
const scheduleCFdatasync = require('../services/codeforcessync');
const router=express.Router();
let currcron=null;
router.post('/cron-update',(req,res)=>{
  const {cronTime}=req.body;
  try {
    if(currcron)currcron.stop();
    currcron=scheduleCFdatasync(cronTime);
    res.json({message:"CRON SCHEDULE UPDATED",cronTime})
  } catch (error) {
   res.status(500).json({message:'failed to update crontime'})
  }
})
module.exports=router;
