const express = require('express');
const {logReqRes}=require('./middlewares/index.js')
const {connectMongoDb}=require('./connection.js');
const userRouter=require('./routes/user.js');

const app = express();
const PORT = 8000;

//connection
connectMongoDb("mongodb://127.0.0.1:27017/youtube-app-1").then(()=>{
    console.log("MongoDb is connected from mongoose")
})
// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // 👈 needed for PATCH/POST JSON body

app.use(logReqRes('log.txt'));

//routes
app.use('/user',userRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
