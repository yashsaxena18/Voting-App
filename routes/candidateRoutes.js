const express=require('express');
const router=express.Router();
const Candidate=require('../models/candidate'); // Import the candidate model
const {jwtAuthMiddleware,generateToken}= require('../jwt');
const User = require('../models/user'); //import User model


const checkAdminRole=async(userId)=>{
    try{
        const user=await User.findById(userId);
        return user.role === 'admin'; // Check if the user has admin role   
    }catch(err){
        return false; // If there's an error, assume the user is not an admin
    }
}
//post route to add a new candidate
router.post('/',jwtAuthMiddleware,async (req,res)=>{
 try{
    if(!(await checkAdminRole(req.user.id))){
        return res.status(403).json({error: 'Access denied. Only admins can add candidates.'});
    }

  //EXTRACT DATA FROM REQUEST BODY contains candidate details
  const data=req.body;
  //create a new user using the mongoose model
  const newCandidate=new Candidate(data);

  //save the new user to the database
  const response= await newCandidate.save();
  console.log('data saved successfully');
  res.status(200).json({response : response});

 }catch(err){
  console.log('error in saving data:',err);
  res.status(500).json({message:'Internal server error',error:err});
 }
})



router.put('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
  try{
    if(!(await checkAdminRole(req.user.id))){
        return res.status(403).json({error: 'Access denied. Only admins can add candidates.'});
    }
    const candidateID=req.params.candidateID; //extract the id from url parameter
    const updatedCandidateData=req.body; // upadted data for the candidate
    //find the candidate by id and update it
    const response=await Candidate.findByIdAndUpdate(candidateID,updatedCandidateData,{
      new:true,   //RETURN THE UPDATED DOCUMENT
      runValidators:true,//RUN MONGOOSE VALIDATORS
    })
    if(!response){
      console.log('Candidate not found');
      return res.status(404).json({message:'Candidate not found'});
    }
    console.log(' candidate data Updated successfully');
    res.status(200).json(response);
  }catch(err){
    console.log('error in updating candidate data:',err);
    res.status(500).json({message:'Internal server error',error:err});
  }
})

router.delete('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
  try{
    if(!(await checkAdminRole(req.user.id))){
        return res.status(403).json({error: 'Access denied. Only admins can add candidates.'});
    }
    const candidateID=req.params.candidateID; //extract the id from url parameter
    
    //find the candidate by id and update it
    const response=await Candidate.findByIdAndDelete(candidateID);
    if(!response){
      console.log('Candidate not found');
      return res.status(404).json({message:'Candidate not found'});
    }
    console.log(' candidate deleted successfully');
    res.status(200).json(response);
  }catch(err){
    console.log('error in deleting candidate data:',err);
    res.status(500).json({message:'Internal server error',error:err});
  }
})

//lets start voting
router.post('/vote/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    //no admin can vote
    //user can only vote once
    candidateID=req.params.candidateID; //extract the id from url parameter
    userId=req.user.id; //extract the user id from token
    try{
        //find the candidate document with a specified candidate id
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }
        //find the user document with a specified user id
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //check if the user has already voted
        if (user.isVoted) {
            return res.status(403).json({ message: 'You have already voted' });
        }
        //user role should not be admin
        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Admins cannot vote' });
        }
        //increment the vote count for the candidate
       candidate.votes.push({user : userId}) // Add the user ID to the candidate's votes array 
       candidate.voteCount++;
       await candidate.save(); // Save the updated candidate document

       //update the user document to mark that the user has voted
         user.isVoted = true; // Set isVoted to true
         await user.save(); // Save the updated user document
        res.status(200).json({ message: 'Vote cast successfully', candidate });
    }catch(err){
        console.error('Error while voting:', err);
        return res.status(500).json({ message: 'Internal server error', error: err });
    }
});

//vote count
router.get('/vote/count/',async(req,res)=>{
    try{
        const candidate = await Candidate.find().sort({voteCount: 'desc'});//extract the id from url parameter
        //Map the candidates to include only the necessary fields
        const voteRecord=candidate.map(data=>{
            return{
                party:data.party,
                count:data.voteCount
            };
        });
        return res.status(200).json(voteRecord);
    }catch(err){
        console.error('Error while fetching vote count:', err);
        return res.status(500).json({ message: 'Internal server error', error: err });
    }
});
//route for getting all candidates
router.get('/list',async(req,res)=>{
    try{
        const candidates=await Candidate.find(); //find all candidates
        if(candidates.length===0){
            return res.status(404).json({message:'No candidates found'});
        }
        res.status(200).json(candidates);
    }catch(err){
        console.error('Error while fetching candidates:', err);
        return res.status(500).json({ message: 'Internal server error', error: err });
    }
});
module.exports=router;