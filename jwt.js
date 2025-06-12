const jwt=require('jsonwebtoken');
const jwtAuthMiddleware=(req,res,next)=>{
    const authorization=req.headers.authorization; // Get the authorization header from the request
    if(!authorization){
        return res.status(401).json({error:'Token Not Found'});
    }
    const token=req.headers.authorization.split(' ')[1]; //extract the token from the authorization header
    if(!token){
        return res.status(401).json({error:'unauthorized access'});
    }
    try{
        //verify the JWT token
        const decoded=jwt.verify(token,process.env.JWT_SECRET); // Use the secret key from environment variables
        req.user=decoded; // Attach the decoded user information to the request object
        next(); // Call the next middleware or route handler
    }catch(err){
        console.error('JWT verification error:', err);
        return res.status(401).json({error:'unauthorized access'});
    }
}
//Function to generate a JWT token
const generateToken=(userData)=>{
    // Create a JWT token with user information and an expiration time
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn: '1h'});   // Use the secret key from environment variables
}  

// Export the JWT authentication middleware
module.exports={jwtAuthMiddleware,generateToken}; // Export the JWT authentication middleware
// This code defines a JWT authentication middleware for Express.js applications
