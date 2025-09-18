const User=require('../models/user.js');

async function handleGetAllUsers(req,res){
    const allDbUsers=await User.find({})
    return res.json(allDbUsers);
}

async function handleGetUserById(req,res){
    const user=await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.json(user);
}

async function handleUpdateUserById(req,res){
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
}

async function handleDeleteUserById(req,res){
    try{
        const deletedUser=await User.findByIdAndDelete(req.params.id);
        if(!deletedUser){
            return res.status(404).json({message:"User not found"});
        }
        res.status(201).json(deletedUser);
    }catch(error){
        res.status(400).json({error:error.message});
    }
}

async function handleCreateNewUser(req,res) {
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
}

module.exports={
    handleGetAllUsers,
    handleGetUserById,
    handleUpdateUserById,
    handleDeleteUserById,
    handleCreateNewUser
}