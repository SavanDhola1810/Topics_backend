const mongoose=require('mongoose');
require('dotenv').config();
const mongoURI=process.env.URL;

const connectToMongo=()=>{
    mongoose.connect(mongoURI,, { useNewUrlParser: true, useUnifiedTopology: true });
}

module.exports=connectToMongo;
