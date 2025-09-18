const express = require('express');
const fs = require('fs');
const { stripTypeScriptTypes } = require('module');
const mongoose =require('mongoose'); 


const app = express();
const PORT = 8000;

mongoose
.connect('mongodb://127.0.0.1:27017/youtube-app-1')
.then(()=>console.log("MongoDb connected"))
.catch(err=>console.log("Connection from mongoose to mongodb faced an error. Watch out the details",err));

//Schema
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:String,
    email:{
        type:String,
        required:true,
        unique:true
    },
    jobTitle:String,
    gender:String
},{timestamps:true})

//User Object, User Class
const User=mongoose.model("user",userSchema);

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // 👈 needed for PATCH/POST JSON body

// Routes
app.get("/users", async (req, res) => {
    const allDbUsers=await User.find({})
    const html = `
    <ul>
        ${allDbUsers.map((user) => `<li>${user.firstName}-${user.lastName} - ${user.email}</li>`).join('')}
    </ul>`;
    res.send(html);
});

app.get('/api/users', async (req, res) => {
    const allDbUsers=await User.find({})
    return res.json(allDbUsers);
});

app.route('/api/users/:id')
.get(async (req, res) => {
    const user=await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
})
.patch(async (req, res) => {
    try {
        const updatedUser=await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,runValidators:true
            }
        );
        if(!updatedUser){
            return res.status(404).json({message:"User not found"});
        }
        res.json(updatedUser);
    }catch(error){
        res.status(400).json({error:error.message});
    }
})
.delete(async (req, res) => {
    try{
        const deletedUser=await User.findByIdAndDelete(req.params.id);
        if(!deletedUser){
            return res.status(404).json({message:"User not found"});
        }
        res.status(201).json(deletedUser);
    }catch(error){
        res.status(400).json({error:error.message});
    }
});

app.post("/api/users", async(req, res) => {
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({ error: "Missing required user fields" }); 
    }
    const result=await User.create({
        firstName:body.first_name,
        lastName:body.last_name,
        email:body.email,
        gender:body.gender,
        jobTitle:body.job_title,
    }
)
    return res.status(201).json({msg:'success'})

});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
