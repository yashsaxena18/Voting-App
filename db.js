const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file


//define the mangodb connection url
const mongoURL=process.env.MONGODB_URL_LOCAL  //if we have to connect to local mongodb
 //if we have to connect to mongodb atlas
//const mongoURL=process.env.MONGODB_URL ;// Use environment variable if available, otherwise use local MongoDB URL
//set up the mongoDB connection
console.log('Connecting to MongoDB...');


// Modern connection
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

const db = mongoose.connection;
//check if the connection is successful
db.on('connected',()=>{
    console.log('MongoDB connected successfully');
})
db.on('error',(err)=>{
    console.log('MongoDB connection error:',err);
})
db.on('disconnected',()=>{
    console.log('MongoDB disconnected');
})
//EXport the connection
module.exports=db;
