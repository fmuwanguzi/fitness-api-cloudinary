# cloudinary-mongoose

This is a the workout API. This api was built using moongose for the Schema(model). In order to post and store images we are using cloudinary.

To access each portion of this code please `npm install` after you have `forked and cloned`.

After a simple set up of our `server.js` we being to set up for the use of cloudinary and multer but first you need to create a `.env` file. 

Our `config folder` sets up the use of multer which allows for the movement of files. In this case it will only accept .jpg, .jpeg. and .png files.

```js
module.exports = multer({
    storage: multer.diskStorage({}),
    fileFIlter: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png'){
            cb(new Error ('Image file type is not supported must jpg, jpeg or png'),false);
                return;
        }
        cb(null,true)

    },
});
```

The cloudinary file stores our user name, api-key and the secret key.

```js 
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
}); 
module.exports = cloudinary;
```

We created a simple model for workouts using this model.

```js
const workoutSchema = new mongoose.Schema({
    name:String,
    picture: String, //secure_url from cloudinary 
    cloudinary_id: String, //id of the picture once its in the cloud
    sets: Number,
    reps: Number,
    description: String
})

module.exports = mongoose.model('workout', workoutSchema);
```

Below are some routes we used to post and get 

```js

///POST
router.post('/', upload.single('image'), async (req , res) => {
   
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

//GET route to display all images we have sent to cloudinary 

router.get('/', async (req, res) => {
    console.log('--get route--')
    try {
        const workout = await Workout.find();
        res.json(workout);
    }catch(error){
        console.log(error);
    }
});

```

PUT and DELETE routes using id

```js

//DELETE route also removes it from cloudinary cloud
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
```

The PUT route below works by first deleting the picture from the cloud and then allowing you to post a new picture in the place of that one.


```js
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
```

Some of the images we used are in the images folder. 