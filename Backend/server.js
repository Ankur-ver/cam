
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
const dotenv=require('dotenv');
const authRoutes=require('./routes/auth');
const student=require('./routes/student')
dotenv.config();

app.use(cors());
app.use(express.json());
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
app.use('/api/auth',authRoutes);
app.use('/api/student',student)
const PORT =process.env.PORT || 5000;
app.listen(PORT,()=>console.log(`server running on port ${PORT}`));