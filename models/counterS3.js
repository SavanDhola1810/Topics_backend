
const mongoose=require('mongoose');

const counterS3Schema=new mongoose.Schema({
    id:{
        type:String,
        required:true,
    },
    seq:{
        type:Number,
        required:true
    }
});

module.exports=mongoose.model('counterS3',counterS3Schema)