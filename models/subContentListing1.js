const mongoose=require('mongoose');

const listSchema=new mongoose.Schema({
    seq:{
        type:Number,
        required:true
    },
    topicID:{
        type:Number,
        required:true
    },
    topicName:{
        type:String,
        require:true
    },
    content:{
        type:Array,
        require:true
    }
});

module.exports=mongoose.model('subContentListing1',listSchema)