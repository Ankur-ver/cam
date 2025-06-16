/*  
   Main Server.js      [will maintain and modified to handle large no. of requests]
*/
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
const dotenv=require('dotenv');
const authRoutes=require('./routes/auth');
const student=require('./routes/student')
dotenv.config();

//CF data fetch at 2 AM daily 
const scheduleCFdatasync =require('./services/codeforcessync')
app.use(cors());
app.use(express.json());

//MongoDb database connection
const connectDb=async()=>{
 const mongouri=process.env.MONGO_URI;
 try{
  await mongoose.connect(mongouri);
  console.log("mongodb connected");
 }catch(err){
  console.log(err);
 }
}
connectDb();
scheduleCFdatasync();

app.use('/api/auth',authRoutes);
app.use('/api/student',student)
const PORT =process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running on port ${PORT}`));