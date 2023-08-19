const mongoose=require('mongoose');

const counterS4Schema=new mongoose.Schema({
    id:{
        type:String,
        required:true,
    },
    seq:{
        type:Number,
        required:true
    }
});

module.exports=mongoose.model('counterS4',counterS4Schema)