const express = require("express");
const Alexa = require('ask-sdk-core');
const { ExpressAdapter } = require('ask-sdk-express-adapter');

const bedtime = require("./Model/bedtime");
const bedtimes = new bedtime();
const events = require("./Model/events");
const event = new events();
const kid = require("./Model/kid");
const kids = new kid();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/kid/', async (req, res) => {
    let result = {};
    async (request, response) => {
        try {
            console.log("Query Parameters: ", req.query);
            result = await kids.getAll(req.query);
            console.log("Kids fetched: ", result);
        }
        catch (error) {
            console.error("Error fetching kids: ", error);
            response.status(500).send("Error fetching kids");
        }
        response.json({'data': result });
    }
});

app.get('/bedtime/', async (req, res) => {
    let result = {};
    async (request, response) => {
        try {
            console.log("Query Parameters: ", req.query);
            result = await bedtimes.getAll(req.query);
            console.log("Bedtimes fetched: ", result);
        }
        catch (error) {
            console.error("Error fetching bedtimes: ", error);
            response.status(500).send("Error fetching bedtimes");
        }
        response.json({'data': result });
    }
});

app.get('/events/', async (req, res) => {
    let result = {};
    async (request, response) => {
        try {
            console.log("Query Parameters: ", req.query);
            result = await event.getAll(req.query);
            console.log("Events fetched: ", result);
        }
        catch (error) {
            console.error("Error fetching events: ", error);
            response.status(500).send("Error fetching events");
        }
        response.json({'data': result });
    }
});

app.post('/postData/', (req, res) => {
    // todo!!!!
    
})