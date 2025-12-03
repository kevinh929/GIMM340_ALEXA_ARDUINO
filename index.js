const express = require("express");
const Alexa = require('ask-sdk-core');
const { ExpressAdapter } = require('ask-sdk-express-adapter');

// const bedtime = require("./Model/bedtime");
// const events = require("./Model/events");
// const kid = require("./Model/kid");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.post('/postData/', (req, res) => {
    // todo!!!!
    
})