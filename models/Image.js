const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    name:String,
    picture: String,
    cloudinary_id: String
})

module.exports = mongoose.model('image', imageSchema);