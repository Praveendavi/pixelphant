const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name:{ type: String, required: true },
    email:{ type: String, required: true },
    password:{ type: String, required: true },
    pic:{ type: String, default:"https://res.cloudinary.com/grow-more/image/upload/v1606721710/main-qimg-6d72b77c81c9841bd98fc806d702e859_z9fm5l.jpg" },
    cover:{ type: String, default:"https://res.cloudinary.com/grow-more/image/upload/v1606827372/pexels-peter-olexa-3875821_btbhza.jpg" },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})



module.exports = mongoose.model("User", userSchema)

