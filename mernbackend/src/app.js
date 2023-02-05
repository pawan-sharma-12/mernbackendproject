
const express = require('express')
const hbs = require('hbs');
const fs = require('fs')
const bcrypt = require('bcryptjs')

require('./db/conn')
 const path = require('path');
// const dotenv_path = path.join(__dirname,'../.env');
require('dotenv').config()
const Users  = require('./models/user');


const app = express();
  
const port = process.env.port || 8000;
const index_path = path.join(__dirname ,'../public')
const views_path = path.join(__dirname ,'/templates/views')
const partials_path = path.join(__dirname ,'/templates/partials')

/**to get the data from form at /regiter route this code was added */

app.use(express.urlencoded({extended: false}))
app.use(express.json())

/**
 * to set the handlebar view engine and path
 */
app.set("view engine","hbs");
app.set('views',views_path)
hbs.registerPartials(partials_path)
console.log(index_path)

/**
 * to show the static files
 */

 app.use(express.static(index_path))


/**
 * to serve the fetch request at /
 */
app.get('/',(req,res)=>{
    res.render("index");
    
})

/**get requuest for /register route */
app.get('/register',async (req,res)=>{
    try {
        res.send('register');
        
    } catch (error) {
        res.status(400).send(' '+ error);
    }
})

/**to register the user using post */
app.post('/register',async (req,res)=>{
        try {
            const userName = req.body.usernameSignup;
            const email = req.body.email;
            const phone = req.body.phone;
            const password = req.body.password;
            
            const user = Users({
                userName,email,phone,password
                
            })
        const token =   await  user.createAuthToken();
            const result = await user.save();
            res.status(201).render('index');
            
        } catch (error) {
            res.status(400).send(' '+ error);
        }
})

/**to login the user by username, password */
app.post('/login',async (req,res)=>{
    try {
       
        const password = req.body.password;
        
        const userName = req.body.usernameSignin;
        
       
        const result = await Users.findOne({userName});
        
       
        if(result == null) res.send('invalid credentials');
        else{
            const passwordDb = result.password;
            console.log(passwordDb);
            const match = await bcrypt.compare(password,passwordDb);
            console.log('match = ' + match)
            
            if(match){
                const token =   await  result.createAuthToken();
                res.render('login') 

            }else{
                res.send('invalid credentials')
            }
        }
        
        
    } catch (error) {
        res.status(400).send(' '+ error);
    }
})


app.listen(port,()=>{
    console.log('listening to the port ' + `${port}`)
})


/**
 * showing dot env variable
 */
 const sec_key = process.env.SECRET_KEY;
 console.log('secret key = '+ sec_key);


// console.log('path = '+ path.join(__dirname,'../.env'))


/**
 *  Reading the dot env file */

// const val = fs.readFileSync(dotenv_path,'utf-8');
// console.log('read the file = '+val)



