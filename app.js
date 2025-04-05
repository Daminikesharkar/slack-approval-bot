const express = require('express');
const bodyParser = require('body-parser');

require('dotenv').config();

const app = express();

//Middleware to parse URL-encoded data and to parse JSON data in incoming requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Start the server on the port defined in environment variables or to port 3000
app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on port: ",process.env.PORT);
})