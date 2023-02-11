const { text } = require('body-parser')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const { brotliCompressSync } = require('zlib')
const userSchema = mongoose.Schema({
    userName : {
        type :String,
        unique : [true,'username already exists'],
        required:true,
        minLength : [3,'username too short']
        
    },
    email : {
        type :String,
        unique : [true,'username already exists'],
        required:true,
        
    },
    phone : {
        type :Number,
        minLength : [10,'phone number must be of 10 length'],
        maxLength : [10,'phone number must be of 10 length']
        
    },
    password : {
        type :String,
        
        required:true,
        
    },
    tokens :[
        {
            token : {type : String,required : true}
        }
    ]

})
/**
 * generating authentication token using a middleware and methods which are used on documents and statics are used with models
 */

 userSchema.methods.createAuthToken = async function(){
    try {
        const token = await jwt.sign({_id : this._id},process.env.SECRET_KEY);
        
        this.tokens = this.tokens.concat({token});
        await this.save();
        console.log('token = '+token)
        return token;
        
        
    } catch (error) {
        // res.send('error in token creation =  ' + error);
        console.log(error);
        
    }
 }

/**
 * hashing the password before saving using middleware
 */
const passwordHasher = () =>{
        userSchema.pre('save',async function(next){
            if(this.isModified('password')){
                this.password = await bcrypt.hash(this.password,10);

            }
            next();
    })
}
passwordHasher();
const Users = new mongoose.model('User',userSchema);
module.exports = Users;