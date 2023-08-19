const mongoose=require('mongoose');

const topicSchema=new mongoose.Schema({
    seq:{
        type:Number,
        required:true
    },
    id:{
        type:Number,
        required:true
    },
    topic:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true,
    }
});

module.exports=mongoose.model('topic',topicSchema)