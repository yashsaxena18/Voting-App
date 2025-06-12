const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String
    },
    address:{
        type:String,
        required:true
    },
    aadharCardNumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['user','admin','voter'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
    
});
userSchema.pre('save',async function(next){
    const person=this;
    //Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')){
        return next();
    }
    try{
        //hash password generation
        const salt = await bcrypt.genSalt(10);
        //hash password
        const hashedPassword=await bcrypt.hash(person.password,salt);
        //overwrite the plain text password with the hashed one
        person.password=hashedPassword;
        next(); //proceed to save the person
    }catch(err){
        console.error('Error hashing password:', err);
        return next(err); //pass the error to the next middleware
    }
})
userSchema.methods.comparePassword=function(candidatePassword){
    try{
        const isMatch=bcrypt.compareSync(candidatePassword,this.password);
        return isMatch; //return true if passwords match, false otherwise
    }catch(err){
        console.error('Error comparing password:', err);
        throw err; //throw the error to be handled by the calling code
    }
}

userSchema.pre('save', async function(next) {
  if (this.role === 'admin') {
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin && !existingAdmin._id.equals(this._id)) {
      throw new Error('Only one admin can exist');
    }
  }
  next();
});
const User= mongoose.model('User',userSchema);
module.exports=User;
