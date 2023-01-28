const mongoose = require('mongoose')
mongoose.set({strictQuery : true})
mongoose.connect('mongodb://127.0.0.1:27017').then(()=>{
    console.log('mongodb connection is successfull')
}).catch((err)=>{
    console.log('mongodb refused to connect followint error occured : \n' + err)
})