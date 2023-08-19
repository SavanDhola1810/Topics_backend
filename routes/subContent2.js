const express = require('express');
const router = express.Router();
const subContent2 = require('../models/subContent2');
const List2 = require('../models/subContentListing2');
const Counter = require('../models/counterS3');
const Counter1 = require('../models/listingCounter4');
const multer = require('multer');
const upload1=multer()


router.get('/getContent', async (req, resp) => {
  try {
    const messages = await subContent2.find();
    resp.json(messages);
  } catch (error) {
    console.error(err);
    resp.status(500).send("some error occured")
  }
})
// router.get('/getSubcontent_4', async (req, resp) => {
//   try {
//     const messages = await subContent2.find().select({_id:0,seq:1,content:1,subTopicName:1,subTopic:1});
//     resp.json(messages);
//   } catch (error) {
//     console.error(err);
//     resp.status(500).send("some error occured")
//   }
// })
router.post('/getSubcontent_4_ByID',upload1.none(), async (req, resp) => {
  try {
    const {topicID}=req.body
    const messages = await subContent2.find({topicID}).select({_id:0,seq:1,id:1,content:1,isClickable:1});
    resp.json(messages);
  } catch (error) {
    console.error(err);
    resp.status(500).send("some error occured")
  }
})


router.post('/addContent', upload1.none(),async (req, resp) => {
  try {
    // this is called destruction of request
    const { user, topicC, topicContent, inputType } = req.body;

    //for increment seq.
    const note = await Counter.findOneAndUpdate({ id: "autoVal" }, { $inc: { seq: 1 } }, { new: true })

    var seqId;
    if (!note) {
      const newVal = new Counter({ id: "autoVal", seq: 1 })
      await newVal.save()
      seqId = 1
    }
    else {
      seqId = note.seq
    }

    //for add a content
    // console.log(req.body)
   
    if(inputType==="text"){
      const addContent = new subContent2({
        seq: seqId, id: seqId, topicID: user, topicName: topicC, type: inputType, content: topicContent,isClickable:req.body.isClickable
      })
      const savedNote = await addContent.save();
      resp.json(savedNote)
    }
    else{
      const addContent = new subContent2({
        seq: seqId, id: seqId, topicID: user, topicName: topicC, type: inputType, content: topicContent
      })
      const savedNote = await addContent.save();
      resp.json(savedNote)
    }



    //listing content
    const existingTopic = await List2.findOne({ topicID: user });

    if (existingTopic) {
      existingTopic.content.push(topicContent);
      await existingTopic.save();
      // resp.json(existingTopic);
      // resp.send("Content added successfully")
    } else {
      const note = await Counter1.findOneAndUpdate({ id: "autoVal" }, { $inc: { seq: 1 } }, { new: true })
      var seq;
      if (!note) {
        const newVal = new Counter1({ id: "autoVal", seq: 1 })
        await newVal.save()
        seq = 1
      }
      else {
        seq = note.seq
      }
      const addNotes = new List2(
        {
          seq:seq,topicID: user, topicName: topicC, content: topicContent
        }
      );
      const savedNote = await addNotes.save();
      // resp.json(savedNote)

    }
  } catch (error) {
    console.error(err);
    resp.status(500).send("some error occured")
  }
})

router.post('/editClickable',async (req,resp)=>{
  try{

    // console.log(req.body,"hello")
    const { isClickable ,id} = req.body;
        //Find the notes to be updated and update it
        let note = await subContent2.findOne({id:id});
        console.log(note)
        if (!note) { return resp.status(404).send("not found") }
        note = await subContent2.updateOne({id:id}, { $set: {isClickable} }, { new: true })
        resp.json({ note })
  }
  catch (error) {
    console.error(err);
    resp.status(500).send("some error occured")
  }
})


router.post('/updateContent', async (req, resp) => {
  try {
    const { startId, endId } = req.body
    console.log(req.body)

    const note = await subContent2.find()
    let note1 = await subContent2.findById(startId);


    let note2 = await subContent2.findById(endId);
    if (!note1 && !note2) { return resp.status(404).send("not found") }

    console.log(note1, note2)

    // for updating list
    let arrayList = await List2.find({ topicName: note1.topicName })
    if (!arrayList) { return resp.status(404).send("not found") }
    // console.log(arrayList[0].content)

    let index1,index2;
    if (arrayList) {
      arrayList[0].content.map((ele, index) => {
        if (ele === note1.content) {
          // console.log(index)
           index1 = index
        }

        else if (ele === note2.content) {
          // console.log(index)
           index2 = index
        }
        
      })
      
      if (index1 > index2) {

        let tempC1=arrayList[0].content[index1]
        // console.log(tempC1)
        for(let i=index1;i>index2;i--){
          arrayList[0].content[i]=arrayList[0].content[i-1]
        }
        arrayList[0].content[index2]=tempC1
      }
      else {
        let tempC2=arrayList[0].content[index1]
        // console.log(tempC2)
        for(let i=index1;i<index2;i++){
          arrayList[0].content[i]=arrayList[0].content[i+1]
        }
        arrayList[0].content[index2]=tempC2
      }
      await arrayList[0].save()
    }

    //for main data
    if (note1 && note2) {
      console.log(note1.seq, note2.seq)
      // console.log(note)

      if ((note1.seq) > (note2.seq)) {
        const temp = {}
        temp.id = note1.id
        temp.topicID = note1.topicID
        temp.topicName = note1.topicName
        temp.type = note1.type
        temp.content = note1.content        
        temp.isClickable = note1.isClickable        

        console.log(temp)

        for (let i = (note1.seq) - 1; i >= (note2.seq); i--) {
          console.log(note[i - 1])
          note[i].id = note[i - 1].id
          note[i].topicID = note[i - 1].topicID
          note[i].topicName = note[i - 1].topicName
          note[i].type = note[i - 1].type
          note[i].content = note[i - 1].content
          note[i].isClickable = note[i - 1].isClickable
        }

        note[(note2.seq) - 1].id = temp.id
        note[(note2.seq) - 1].topicID = temp.topicID
        note[(note2.seq) - 1].topicName = temp.topicName
        note[(note2.seq) - 1].type = temp.type
        note[(note2.seq) - 1].content = temp.content
        note[(note2.seq) - 1].isClickable = temp.isClickable

        for (let j = (note2.seq) - 1; j < note1.seq; j++) {
          await note[j].save()
        }
      }

      else if ((note1.seq) < (note2.seq)) {
        console.log("hello")
        const temp1 = {}
        temp1.id = note1.id
        temp1.topicID = note1.topicID
        temp1.topicName = note1.topicName
        temp1.type = note1.type
        temp1.content = note1.content
        temp1.isClickable = note1.isClickable

        console.log(temp1)

        for (let i = (note1.seq) - 1; i < ((note2.seq) - 1); i++) {
          note[i].id = note[i + 1].id
          note[i].topicID = note[i + 1].topicID
          note[i].topicName = note[i + 1].topicName
          note[i].type = note[i + 1].type
          note[i].content = note[i + 1].content
          note[i].isClickable = note[i + 1].isClickable
        }

        note[(note2.seq) - 1].id = temp1.id
        note[(note2.seq) - 1].topicID = temp1.topicID
        note[(note2.seq) - 1].topicName = temp1.topicName
        note[(note2.seq) - 1].type = temp1.type
        note[(note2.seq) - 1].content = temp1.content
        note[(note2.seq) - 1].isClickable = temp1.isClickable

        for (let j = (note1.seq) - 1; j < note2.seq; j++) {
          await note[j].save()
        }


      }
      resp.json("updated successfully")
    }

  } catch (error) {
    console.error(err);
    resp.status(500).send("some error occured")
  }
})


module.exports = router

