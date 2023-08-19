const mongoose=require('mongoose');
require('dotenv').config();
const mongoURI=process.env.URL;

const connectToMongo=()=>{
    mongoose.connect(process.env.URL);
}

module.exports=connectToMongo;