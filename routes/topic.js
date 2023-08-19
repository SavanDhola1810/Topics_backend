const express = require('express');
const router = express.Router();
// const Notes = require('../models/notes');
const Topic = require('../models/topics');
const multer = require('multer');
const Counter = require('../models/counterT');
const Counter1 = require('../models/counterT1');
// const upload = multer({ dest: 'uploads/' });
const upload1=multer()

router.get('/getTopic', async (req, resp) => {
    console.log(req.body)
    try {
        const t = await Topic.find();
        resp.json(t);
    } catch (error) {
        console.error(err);
        resp.status(500).send("some error occured")
    }
})


router.post('/dragTopic', async (req, resp) => {
    try {
      const { startId, endId } = req.body
      console.log(req.body)
  
      const note = await Topic.find()
      let note1 = await Topic.findById(startId);
  
  
      let note2 = await Topic.findById(endId);
      if (!note1 && !note2) { return resp.status(404).send("not found") }
  
      // console.log(note1, note2)
  
      //for main data
      if (note1 && note2) {
        console.log(note1.seq, note2.seq)
        // console.log(note)
  
        if ((note1.seq) > (note2.seq)) {
          const temp = {}
          temp.id = note1.id
          temp.topic = note1.topic
          temp.imageUrl = note1.imageUrl
        //   console.log(temp)
  
          for (let i = (note1.seq) - 1; i >= (note2.seq); i--) {
            console.log(note[i - 1])
            note[i].id = note[i - 1].id
            note[i].topic = note[i - 1].topic
            note[i].imageUrl = note[i - 1].imageUrl
          }
  
          note[(note2.seq) - 1].id = temp.id
          note[(note2.seq) - 1].topic = temp.topic
          note[(note2.seq) - 1].imageUrl = temp.imageUrl
  
          for (let j = (note2.seq) - 1; j < note1.seq; j++) {
            await note[j].save()
          }
        }
  
        else if ((note1.seq) < (note2.seq)) {
          console.log("hello")
          const temp1 = {}
          temp1.id = note1.id
          temp1.topic = note1.topic
          temp1.imageUrl = note1.imageUrl
          console.log(temp1)
  
          for (let i = (note1.seq) - 1; i < ((note2.seq) - 1); i++) {
            note[i].id = note[i + 1].id
            note[i].topic= note[i + 1].topic
            note[i].imageUrl = note[i + 1].imageUrl
          }
  
          note[(note2.seq) - 1].id = temp1.id
          note[(note2.seq) - 1].topic = temp1.topic
          note[(note2.seq) - 1].imageUrl = temp1.imageUrl
  
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

//for changing a position of topic
router.post('/changePositionOfTopic', async (req, resp) => {
    console.log(req.body)
    const {topic}=req.body;

    const note=await Topic.find() 
    // console.log(note[0])

    const note1=await Topic.findOne({topic:topic})

    const temp={}
    temp.id=note1.id
    temp.topic=note1.topic
    temp.imageUrl=note1.imageUrl
    console.log(temp)
    

    for(let i=(note1.seq)-1;i>0;i--){
        note[i].id=note[i-1].id
        note[i].topic=note[i-1].topic
        note[i].imageUrl=note[i-1].imageUrl
    }
    note[0].id=temp.id
    note[0].topic=temp.topic
    note[0].imageUrl=temp.imageUrl


    // console.log(note)

    for(let j=0;j<note1.seq;j++){
        await note[j].save()
    }
    
    resp.json("update successfully")
    // resp.json(savedNote)
})

// router.get('/getTopics', async (req, resp) => {
//   console.log(req.body)
//   try {
//       const t = await Topic.find().select({_id:0,seq:1,topic:1,imageUrl:1});
//       resp.json(t);
//   } catch (error) {
//       console.error(err);
//       resp.status(500).send("some error occured")
//   }
// })

router.post('/getTopicsByName',upload1.none(), async (req, resp) => {
    // console.log(req.body)
    const {topic}=req.body;

    const note=await Topic.find() 
    // console.log(note[0])

    const note1=await Topic.findOne({topic:topic})

    const temp={}
    temp.id=note1.id
    temp.topic=note1.topic
    temp.imageUrl=note1.imageUrl
    // console.log(temp)
    

    for(let i=(note1.seq)-1;i>0;i--){
        note[i].id=note[i-1].id
        note[i].topic=note[i-1].topic
        note[i].imageUrl=note[i-1].imageUrl
    }
    note[0].id=temp.id
    note[0].topic=temp.topic
    note[0].imageUrl=temp.imageUrl


    // console.log(note)

    for(let j=0;j<note1.seq;j++){
        await note[j].save()
    }
    
    const note2=await Topic.find().select({_id:0,seq:1,topic:1,id:1,imageUrl:1})
    resp.json(note2)
})

router.post('/addTopic', upload1.none(),async (req, resp) => {
    const { topicName, imageUrl } = req.body;
    // console.log(req.body)
    try {

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
        const note1 = await Counter1.findOneAndUpdate({ id: "autoVal" }, { $inc: { seq: 1 } }, { new: true })

        var seqI;
        if (!note1) {
            const newVal = new Counter1({ id: "autoVal", seq: 1 })
            await newVal.save()
            seqI = 1
        }
        else {
            seqI = note1.seq
        }
        const addTopic = new Topic({
           seq:seqId,id:seqI,topic: topicName, imageUrl
        });
        const savedNote = await addTopic.save();
        resp.json(savedNote);
    } catch (error) {
        console.error(error);
        resp.status(500).send("Some error occurred");
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage: storage
})

//Route 5:Add File using :post /api/topic/addFile .
router.post('/addImage', upload.single('image'), async (req, resp) => {
    resp.send('Image uploaded successfully');
    console.log("hello")
})

router.delete('/deleteTopic/:id', async (req, resp) => {
    try {
        //Find the notes to be delete and delete it
        
        let note = await Topic.findById(req.params.id);
        if (!note) { return resp.status(404).send("not found") }
        let seqNo=note.seq
        note = await Topic.findByIdAndDelete(req.params.id)
        resp.json({ success: "your note has been deleted" })
        // console.log("hello")

        await Counter.findOneAndUpdate({ id: "autoVal" }, { $inc: { seq: -1 } }, { new: true })

        //for increment seq.
        let note2 = await Topic.find();
        let a=note2.length
        console.log(a,seqNo)
        
        console.log(note2)
        for(let i=(seqNo-1);i<a;i++){ //1(0)  3(1) 4(2) 
          note2[i].seq=(note2[i].seq)-1
        //   console.log(note2[i].seq)
          await note2[i].save();
        }
        // await note2.save()
        
    } catch (error) {
        // console.error(err);
        resp.status(500).send("some error occured")
    }

})


router.put('/updateTopic/:id', async (req, resp) => {
    try {
        const { topicName, imageUrl } = req.body;
        //create a new Object

        const newNote = {};
        if (topicName) { newNote.topic = topicName }
        if (imageUrl) { newNote.imageUrl = imageUrl }

        //Find the notes to be updated and update it

        let note = await Topic.findById(req.params.id);
        if (!note) { return resp.status(404).send("not found") }
        note = await Topic.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        resp.json({ note })
    } catch (error) {
        console.error(err);
        resp.status(500).send("some error occured")
    }

})

module.exports = router