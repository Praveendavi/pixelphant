require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const mongoose = require('mongoose')
require('./models/user')
const bodyParser = require('body-parser')
const router = require('./routes/auth')
const cors = require('cors')
const { MONGODB_URI } = require('./config/keys')



mongoose.connect(MONGODB_URI, 
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

mongoose.connection.on('connected', () =>{
    console.log('mongodb is successfully connected')
})
mongoose.connection.on('error', () =>{
    console.log('error to connect mongodb')
})

require('./models/post')
require('./models/user')
app.use(cors())

app.use(bodyParser.json())
app.use(require('./routes/post'))
app.use(require('./routes/auth'))
app.use(require('./routes/user'))



if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT, () =>{
    console.log(`Server is running on Port ${PORT}`)
})