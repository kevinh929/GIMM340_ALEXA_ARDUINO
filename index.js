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



// ************************************** ALEXA Defaults ***************************************

//Alexa Launch Request Handler
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to parent alarm, would you like to set the bedtime, end it, or check on your child';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//Alexa Help Intent Handler
const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//Alexa Cancel and Stop Intent Handler
const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

//Alexa Fallback Intent Handler
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, please try again. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

//Alexa Session Ended Request Handler
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

// ************************************** CUSTOM INTENT HANDLERS ***************************************

//AlertParentIntentHandler
const AlertParentIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AlertParentIntent';
    },
    handle(handlerInput) {
        let data = [Alexa.getSlotValue(handlerInput.requestEnvelope, 'kid'), Alexa.getSlotValue(handlerInput.requestEnvelope, 'sensor'), Alexa.getSlotValue(handlerInput.requestEnvelope, 'time')];
        const speakOutput = `Alert from parent alarm: ${data[1]} triggered from ${data[0]} at ${data[2]}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('anything else?')
            .getResponse();
    }
};

//StartBedtimeIntentHandler
const StartBedtimeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartBedtimeIntent';
    },
    handle(handlerInput) {
        let child = Alexa.getSlotValue(handlerInput.requestEnvelope, 'kid');
        const speakOutput = `You activated the StartBedtimeIntent ${(child) ? " with name: " + child : ""}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('anything else?')
            .getResponse();
    }
};

//EndBedtimeIntentHandler
const EndBedtimeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'EndBedtimeIntent';
    },
    handle(handlerInput) {
        let child = Alexa.getSlotType(handlerInput.requestEnvelope, 'kid');
        const speakOutput = `You activated the EndBedtimeIntent ${(child) ? " with name: " + child : ""}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('anything else?')
            .getResponse();
    }
};


//Entry Point
const skill = Alexa.SkillBuilders.custom()
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(LogRequestInterceptor)
    .addResponseInterceptors(LogResponseInterceptor)
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        AlertParentIntentHandler,
        StartBedtimeIntentHandler,
        EndBedtimeIntentHandler
    )
    .withCustomUserAgent('reference-skills/intro-to-alexa-conversations/v7')
    .create(); 
     
const adapter = new ExpressAdapter(skill, false, false);

app.post('/', adapter.getRequestHandlers());
app.listen(3000);