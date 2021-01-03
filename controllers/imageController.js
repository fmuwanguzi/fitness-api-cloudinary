const router = require('express').Router();
const models = require('../models');
const cloudinary = require('../config/cloudinary');
const upload = require('../config/multer');
const Image = require('../models/Image');
require("dotenv").config();

//Post route to send images to cloudinary

router.post('/', upload.single('image'), async (req , res) => {
    //console.log(cloudinary);
    console.log(process.env.CLOUD_NAME);
    try{
        //upload image to cloudinary
        const myImage = await cloudinary.uploader.upload(req.file.path);
        //creating a new image which is an object can be whatever your models is 
        const image = new Image({
            name: req.body.name,
            picture: myImage.secure_url,
            cloudinary_id: myImage.public_id, 
        });
        await image.save();
        res.json(image);
    }catch (error){
        console.log(error)
    }
});

//Get route to display all images we have sent to cloudinary 

router.get('/', async (req, res) => {
    try {
        const image = await Image.find();
        res.json(image);
    }catch(error){
        console.log(error);
    }
});

//get each image by id this route works
// router.get('/:id', async (req, res) => {
//     try {
//         const image = await Image.findById(req.params.id)
//         res.json(image);
//     }catch(error){
//         console.log(error);
//     }
// });


//Get each image by name
router.get('/:name', async (req, res) => {
    try {
        const image = await Image.findOne(req.body.name)
        res.json(image);
    }catch(error){
        console.log(error);
    }
});

//Delete route by id this route works

// router.delete('/:id' , async (req, res) => {
//     try {
//         //Find image by the ID
//         const image = await Image.findById(req.params.id);
//         //Deleting the image from cloudinary
//         await cloudinary.uploader.destroy(image.cloudinary_id);
//         //Delete the image from the database
//         await image.remove();
//         res.json(image);
//     } catch (error){
//         console.log(error);
//     }
// });

//delete image by name
router.delete('/:name' , async (req, res) => {
    try {
        //Find image by the ID
        const image = await Image.findOne(req.body.name)
        //Deleting the image from cloudinary
        await cloudinary.uploader.destroy(image.cloudinary_id);
        //Delete the image from the database
        await image.remove();
        res.json(image);
    } catch (error){
        console.log(error);
    }
});


//PUT route for changing the image using id
router.put('/:id', upload.single('image'), async (req, res ) => {
    try {
        let image = await Image.findById(req.params.id);
        //Delete the image from cloudinary
        await cloudinary.uploader.destroy(image.cloudinary_id);
        //upload new image to cloudinary
        const myImage = await cloudinary.uploader.upload(req.file.path);
        const data = {
            name: req.body.name || image.name,
            picture: myImage.secure_url || image.picture,
            cloudinary_id: myImage.public_id || image.cloudinary_id, 
        }
        image = await Image.findByIdAndUpdate(req.params.id, data, {
            new:true
        });
        res.json(image);

    }catch(error){
        console.log(error)
    }
})

//PUT route for changing image using name

// router.put('/:name', upload.single('image'), async (req, res ) => {
//     try {
//         let image = await Image.findOne(req.body.name)
//         //Delete the image from cloudinary
//         await cloudinary.uploader.destroy(image.cloudinary_id);
//         //upload new image to cloudinary
//         const myImage = await cloudinary.uploader.upload(req.file.path);
//         const data = {
//             name: req.body.name || image.name,
//             picture: myImage.secure_url || image.picture,
//             cloudinary_id: myImage.public_id || image.cloudinary_id, 
//         }
//         image = await Image.findOneAndUpdate(req.body.name, data, {
//             new:true
//         });
//         res.json(image);

//     }catch(error){
//         console.log(error)
//     }
// })


module.exports = router; 

