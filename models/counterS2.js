const mongoose=require('mongoose');

const counterS2Schema=new mongoose.Schema({
    id:{
        type:String,
        required:true,
    },
    seq:{
        type:Number,
        required:true
    }
});

module.exports=mongoose.model('counterS2',counterS2Schema)