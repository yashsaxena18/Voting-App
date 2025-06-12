const express=require('express');
const router=express.Router();
const User=require('../models/user'); // Import the Person model
const {jwtAuthMiddleware,generateToken}= require('../jwt');
const Candidate = require('../models/candidate');

//signup route
router.post('/signup',async (req,res)=>{
 try{
  const data=req.body;
  //create a new user using the mongoose model
  const newUser=new User(data);

  //save the new user to the database
  const response= await newUser.save();
  console.log('data saved successfully');

  const payload={
    id:response.id
  }
  console.log(JSON.stringify(payload));
//generating token when person sign up
  const token = generateToken(payload);
  console.log("Token is :",token);
  res.status(200).json({response : response,token:token});

 }catch(err){
  console.log('error in saving data:',err);
  res.status(500).json({message:'Internal server error',error:err});
 }
})

//Login Route
router.post('/login', async (req, res) => {
  try {
    const { aadharCardNumber, password } = req.body;

    // Check if required fields are missing
    if (!aadharCardNumber || !password) {
      return res.status(400).json({ error: 'AadharCardNumber and password are required' });
    }

    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid AadharCardNumber or password' });
    }

    const payload = { id: user.id };
    const token = generateToken(payload);
    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//profile route
router.get('/profile', jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user; // From JWT middleware
    const userId = userData.id;

    // Find the user, excluding sensitive fields
    const user = await User.findById(userId)
      .select('-password -__v -createdAt -updatedAt'); // Exclude sensitive fields

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return sanitized user data
    return res.status(200).json({
      id: user._id,
      name: user.name,
      aadharCardNumber: user.aadharCardNumber,
      // Include other non-sensitive fields you need
    });

  } catch (err) {
    console.error('Error fetching user profile:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/profile/password',jwtAuthMiddleware,async(req,res)=>{
  try{
    const userId=req.user; //extract the id from token
    const {currentPassword,newPassword}=req.body; //extract old and new password from request body
    //find the user by id
    const user= await User.findById(userId.id);
    //if  password doesnt match return error
    if(!(await user.comparePassword(currentPassword))){
        return res.status(401).json({error: 'Invalid username or password '});
    }
    //update the password
    user.password=newPassword;
    //save the updated user
    await user.save();
    console.log('Password Updated successfully');
    res.status(200).json({message: 'Password updated successfully'});
  }catch(err){
    console.log(err);
    res.status(500).json({error:'Internal Server Erroor'});
  }
})
//route for getting all users
router.get('/list', jwtAuthMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password -__v -createdAt -updatedAt'); // Exclude sensitive fields
    return res.status(200).json(users);
  } catch (err) {
    console.error('Error while fetching users:', err);
    return res.status(500).json({ message: 'Internal server error', error: err });
  }
});
//route for only one admin can exist
router.get('/admin', jwtAuthMiddleware, async (req, res) => {
  try {
    const admin = await User.findOne({ role: 'admin' }).select('-password -__v -createdAt -updatedAt'); // Exclude sensitive fields
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    return res.status(200).json(admin);
  } catch (err) {
    console.error('Error while fetching admin:', err);
    return res.status(500).json({ message: 'Internal server error', error: err });
  }
});
module.exports=router;