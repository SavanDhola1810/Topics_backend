const connectToMongo=require("./db");
const express=require('express');
const app=express();
var cors = require('cors')
const PORT=process.env.PORT || 4000

app.use(cors())
//for showing images from uploads folder using localhost:4000//imagename
app.use(express.static('uploads'))

connectToMongo();

app.use(express.json())

app.use('/api/topic',require('./routes/topic'))
app.use('/api/content',require('./routes/content'))
app.use('/api/subContent',require('./routes/subContent'))
app.use('/api/subContent1',require('./routes/subContent1'))
app.use('/api/subContent2',require('./routes/subContent2'))
app.use('/api/subContent3',require('./routes/subContent3'))

app.listen(PORT);