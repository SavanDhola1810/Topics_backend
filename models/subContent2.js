const mongoose=require('mongoose');

const subContentSchema=new mongoose.Schema({
    seq:{
        type:Number,
        required:true
    },
    id:{
        type:Number,
        required:true
    },
    topicID:{
        type:Number,
        required:true
    },
    topicName:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    isClickable:{
        type:Boolean
    }
});

module.exports=mongoose.model('subContent2',subContentSchema)