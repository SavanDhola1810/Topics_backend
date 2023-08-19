const mongoose=require('mongoose');

const counterS1Schema=new mongoose.Schema({
    id:{
        type:String,
        required:true,
    },
    seq:{
        type:Number,
        required:true
    }
});

module.exports=mongoose.model('counterS1',counterS1Schema)