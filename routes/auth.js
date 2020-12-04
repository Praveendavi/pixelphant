const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { JWT_SECRET } = require('../config/keys')
const jwt = require('jsonwebtoken')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))

router.post('/signup', (req, res) =>{
    const { name, email, password, pic,cover } = req.body
    if(!name || !email || !password){
        res.json({ error: 'plase fill the all fields' })
    }
    bcrypt.hash(password, 16)
    .then(hashedpassword=>{
        const user = new User({
            name, email, password:hashedpassword,pic:pic,cover:cover
        })
        user.save()
        .then(user=>{
            transporter.sendMail({
                to:user.email,
                from:"praveenmenaria44@gmail.com",
                subject:"signup successfully",
                html:"<h2>welcome to pixelphant</h2>"
            })
            res.json({ message: 'Your account is successfully Create' })
        }).catch(err=>{
            console.log(err)
        })
    })
    
    User.findOne({ email: email })
    .then((savedUser) =>{
        if(savedUser){
            res.json({ error: 'this email is already exsist' })
        }
    }).catch(err=>{
        console.log(err)
    })
})
router.post('/signin', (req, res)=>{
    const { email, password } = req.body
    if(!email || !password){
        return res.status(422).json({error:"please fill email or password"})
    }
    User.findOne({ email: email })
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({ message: 'You are signin successfully' })
                const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
                const { _id,name,email,followers,following,pic,cover } = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic,cover}})
            } else{
                return res.status(422).json({error:"Invalid Email or password"})
            }
        })
    }).catch(err=>{
        console.log(err)
    })
})
           
 
module.exports = router