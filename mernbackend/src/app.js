
const express = require('express')
const hbs = require('hbs');
const fs = require('fs')
const bcrypt = require('bcryptjs')
const cookieParser = require('cookie-parser')
const auth = require('./middlewares/auth')
require('./db/conn')
const path = require('path');
// const dotenv_path = path.join(__dirname,'../.env');
require('dotenv').config()
const Users = require('./models/user');
const { CLIENT_RENEG_LIMIT } = require('tls');


const app = express();

const port = process.env.port || 8000;
const index_path = path.join(__dirname, '../public')
const views_path = path.join(__dirname, '/templates/views')
const partials_path = path.join(__dirname, '/templates/partials')

/**to get the data from form at /regiter route this code was added */

const useMiddlewares = () => {
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())
    app.use(cookieParser());


    /**
     * to show the static files
     */

    app.use(express.static(index_path))
}



/**
 * to set the handlebar view engine and path
 */
const hbsSetup = () => {
    app.set("view engine", "hbs");
    app.set('views', views_path)
    hbs.registerPartials(partials_path)
    console.log(index_path)
}





/**
 * to serve the fetch request at /
 */
app.get('/', (req, res) => {
    res.render("index");

})

/**get requuest for /register route */

const getRequest = () => {
    app.get('/register', async (req, res) => {
        try {
            res.send('register');

        } catch (error) {
            res.status(400).send(' ' + error);
        }
    })
}


/**to register the user using post */
const postRegister = () => {
    app.post('/register', async (req, res) => {
        try {
            const userName = req.body.usernameSignup;
            const email = req.body.email;
            const phone = req.body.phone;
            const password = req.body.password;

            const user = Users({
                userName, email, phone, password

            })
            const token = await user.createAuthToken();
            const result = await user.save();
            res.status(201).render('index');
            res.cookie('jwt', token, {
                expires: new Date(Date.now() + 60000),
                httpOnly: true
            });


        } catch (error) {
            res.status(400).send(' ' + error);
        }
    })
}


/**to login the user by username, password */
const postLogin = () => {
    app.post('/login', async (req, res) => {
        try {

            const password = req.body.password;

            const userName = req.body.usernameSignin;


            const result = await Users.findOne({ userName });


            if (result == null) res.send('invalid credentials');
            else {
                const passwordDb = result.password;
                console.log(passwordDb);
                const match = await bcrypt.compare(password, passwordDb);
                console.log('match = ' + match)

                if (match) {
                    const token = await result.createAuthToken();
                    res.cookie('jwt', token, {
                        expires: new Date(Date.now() + 3000000),
                        httpOnly: true
                    });
                    res.render('login')

                } else {
                    res.send('invalid credentials')
                }
            }


        } catch (error) {
            res.status(400).send(' ' + error);
        }
    })
}

 /**
  * home route
  */

const showHomepage = () =>{
    app.get('/home', auth, (req,res)=>{
        console.log('jwt token = ' + req.cookies.jwt);
        res.render('home');
       
     })
}

const showErrorPage = () =>{
    app.get('/',(req,res)=>{
        res.status(401).send('404 not found');
    })
}

const logout = () =>{
    app.get('/logout',auth,async (req,res)=>{
        try {
            res.clearCookie('jwt');

            req.user.tokens = req.user.tokens.filter((curr) =>{
                return curr.token !== req.token;
            })
            await req.user.save();
            res.render('index');
             
        } catch (error) {
            console.log('log out error = ' + error);
        }
    })
}
app.listen(port, () => {
    console.log('listening to the port ' + `${port}`)
})


/**
 * showing dot env variable
 */
        // const sec_key = process.env.SECRET_KEY;
        // console.log('secret key = ' + sec_key);


// console.log('path = '+ path.join(__dirname,'../.env'))


/**
 *  Reading the dot env file */

// const val = fs.readFileSync(dotenv_path,'utf-8');
// console.log('read the file = '+val)


/** calling all the functions  */
useMiddlewares();
hbsSetup();
getRequest();
postRegister();
postLogin();
showHomepage();
showErrorPage();
logout();



