const express = require('express');
const connectDB = require('./db/connectdb')
const {    
    retrieveUser,
    createUser,
    updateUser,
    deleteUser} 
            = require('./controllers/userController');
require('dotenv').config()

const app = express();
app.get('/retrieve', retrieveUser);
app.get('/create', createUser);
app.get('/update', updateUser);
app.get('/delete', deleteUser);


const port = process.env.PORT || 3000
const start = async ()=>{
    try{
        await connectDB(process.env.MONGO_DB_STRING);
        console.log('Connected to Database');
        app.listen(port,console.log(`Server is listening on port ${port}`));
    }
    catch(error){
        console.log(error)
    }
}

start()  