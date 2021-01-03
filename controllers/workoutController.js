const router = require('express').Router();
const models = require('../models');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const Workout = require('../models/Workout');
require("dotenv").config();

//Post route to send images to cloudinary

router.post('/', upload.single('image'), async (req , res) => {
    //console.log(cloudinary);
    console.log(process.env.CLOUD_NAME);
    console.log(process.env.MONGO_URI);
    try{
        //upload image to cloudinary
        const myWorkout = await cloudinary.uploader.upload(req.file.path);
        //creating a new image which is an object can be whatever your models is 
        const workout = new Workout({
            name: req.body.name,
            picture: myWorkout.secure_url,
            cloudinary_id: myWorkout.public_id,
            sets: req.body.sets,
            reps: req.body.reps,
            description: req.body.description 
        });
        await workout.save();
        res.json(workout);
    }catch (error){
        console.log(error)
    }
});

//Get route to display all images we have sent to cloudinary 

router.get('/', async (req, res) => {
    console.log('--get route--')
    try {
        const workout = await Workout.find();
        res.json(workout);
    }catch(error){
        console.log(error);
    }
});

//get each workout by id this route works
// router.get('/:id', async (req, res) => {
//     try {
//         const workout = await Workout.findById(req.params.id)
//         res.json(workout);
//     }catch(error){
//         console.log(error);
//     }
// });


//Get each workout by name
router.get('/:name', async (req, res) => {
    try {
        const workout = await Workout.findOne(req.body.name)
        res.json(workout);
    }catch(error){
        console.log(error);
    }
});

//Delete route by id this route works

router.delete('/:id' , async (req, res) => {
    try {
        //Find workout by the ID
        const workout = await Workout.findById(req.params.id);
        //Deleting the workout from cloudinary
        await cloudinary.uploader.destroy(workout.cloudinary_id);
        //Delete the workout from the database
        await workout.remove();
        res.json(workout);
    } catch (error){
        console.log(error);
    }
});

//delete workout by name
// router.delete('/:name' , async (req, res) => {
//     try {
//         //Find workout by the ID
//         const workout = await Workout.findOne(req.body.name)
//         //Deleting the workout from cloudinary
//         await cloudinary.uploader.destroy(workout.cloudinary_id);
//         //Delete the workout from the database
//         await workout.remove();
//         res.json(workout);
//     } catch (error){
//         console.log(error);
//     }
// });


//PUT route for changing the workout using id
router.put('/:id', upload.single('image'), async (req, res ) => {
    try {
        let workout = await Workout.findById(req.params.id);
        //Delete the workout from cloudinary
        await cloudinary.uploader.destroy(workout.cloudinary_id);
        //upload new workout to cloudinary
        const myWorkout = await cloudinary.uploader.upload(req.file.path);
        const data = {
            name: req.body.name || workout.name,
            picture: myWorkout.secure_url || workout.picture,
            cloudinary_id: myWorkout.public_id || workout.cloudinary_id,
            sets: req.body.sets || workout.sets,
            reps: req.body.reps || workout.reps,
            description: req.body.description || workout.description  
        }
        workout = await Workout.findByIdAndUpdate(req.params.id, data, {
            new:true
        });
        res.json(workout);

    }catch(error){
        console.log(error)
    }
})

//PUT route for changing workout using name

// router.put('/:name', upload.single('image'), async (req, res ) => {
//     try {
//         let workout = await Workout.findOne(req.body.name)
//         //Delete the workout from cloudinary
//         await cloudinary.uploader.destroy(workout.cloudinary_id);
//         //upload new workout to cloudinary
//         const myWorkout = await cloudinary.uploader.upload(req.file.path);
//         const data = {
//             name: req.body.name || workout.name,
//             picture: myWorkout.secure_url || workout.picture,
//             cloudinary_id: myWorkout.public_id || workout.cloudinary_id,
                // sets: req.body.sets || workout.sets,
                // reps: req.body.reps || workout.reps,
                // description: req.body.description || workout.description
//         }
//         workout = await Workout.findOneAndUpdate(req.body.name, data, {
//             new:true
//         });
//         res.json(workout);

//     }catch(error){
//         console.log(error)
//     }
// })


module.exports = router; 

