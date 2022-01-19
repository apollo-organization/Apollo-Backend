const express = require('express')
const app = express()
const config = require('config')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const debug = require('debug')
const startupdebug = debug('app:startup')
const dbDebug = debug('app:db')
const dbErrors = debug('app:errors')
const error = debug('error')
const dotenv = require('dotenv')
dotenv.config()
//calling the bodyParsing middleware
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
// app.use(express.static())

//calling the routes
// app.use(require("./routes/"))
app.get('/', (req, res) =>{
    res.send('Hello World!')
})
//connecting to the database
let password = config.get("DATABASE_PASSWORD")
mongoose.connect(`mongodb+srv://Apollo:apollo123@apollo.2ectx.mongodb.net/Apollo`)
.then(() =>{
    dbDebug("Connected to the database successfully...")
})
.catch(err => {
    dbErrors("Failed to connect due to ",err)
})

//Listening on port and checking if PORT environment variable is set
if(!config.get("PORT")){
    error("FATAL ERROR: Connection to port is not defined")
    process.exit(-1);
}
const port = process.env.PORT
app.listen(port, ()=>{
    startupdebug(`Listening on port ${port}`)
} )