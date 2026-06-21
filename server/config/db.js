const mongoose=require("mongoose");
const connectDB=async()=>{
  try{
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("monogodb connected succesfully");
  }catch(error){
    console.error("MOngoDB connections failed",error.message);
    process.exit(1);
  }
};
module.exports=connectDB;