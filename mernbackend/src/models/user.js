const { text } = require('body-parser')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
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
        
    }

})
userSchema.pre('save',async function(next){
        if(this.isModified('password')){
            this.password = await bcrypt.hash(this.password,10);

        }
        next();
})
const Users = new mongoose.model('User',userSchema);
module.exports = Users;