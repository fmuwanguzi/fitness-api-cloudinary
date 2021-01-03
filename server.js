const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

//require connection function
const connectDB = require('./models/index');

app.use(cors({ origin: '*' }))
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//connect to mongo database
connectDB()

app.get('/', (req, res) =>{
    res.send('Hello from your image api')
})

app.use('/workout', require('./controllers/workoutController'))


//set up your PORT
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server has started on ${PORT}`)
});