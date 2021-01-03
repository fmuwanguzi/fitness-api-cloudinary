const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    name:String,
    picture: String,
    cloudinary_id: String,
    bodypart: String,
    sets: Number,
    reps: Number,
    description: String
})

module.exports = mongoose.model('workout', workoutSchema);