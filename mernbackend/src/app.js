const express = require('express')
const hbs = require('hbs')
require('./db/conn')
const path = require('path');
const app = express();

const port = process.env.port || 8000;
const index_path = path.join(__dirname ,'../public')
const views_path = path.join(__dirname ,'/templates/views')
const partials_path = path.join(__dirname ,'/templates/partials')
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


app.listen(port,()=>{
    console.log('listening to the port ' + `${port}`)
})