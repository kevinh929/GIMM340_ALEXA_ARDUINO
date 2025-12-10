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

console.log("Starting Parent Alarm Alexa Skill Server...");

app.use(express.urlencoded({ extended: true }));

/*
app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    next();
});
*/

/*
app.get('/kid/', async (req, res) => {
    let result = {};
    
    try {
        console.log("Query Parameters: ", req.query);
        result = await kids.getAll(req.query);
        console.log("Kids fetched: ", result);
    }
    catch (error) {
        console.error("Error fetching kids: ", error);
        res.status(500).send("Error fetching kids");
    }
    res.json({'data': result });
});

app.get('/bedtime/', async (req, res) => {
    let result = {};
    try {
        console.log("Query Parameters: ", req.query);
        result = await bedtimes.getAll(req.query);
        console.log("Bedtimes fetched: ", result);
    }
    catch (error) {
        console.error("Error fetching bedtimes: ", error);
        res.status(500).send("Error fetching bedtimes");
    }
    res.json({'data': result });
});

app.get('/events/', async (req, res) => {
    let result = {};
    try {
        console.log("Query Parameters: ", req.query);
        result = await event.getAll(req.query);
        console.log("Events fetched: ", result);
    }
    catch (error) {
        console.error("Error fetching events: ", error);
        res.status(500).send("Error fetching events");
    }
    res.json({'data': result });
});



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

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
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

const AddKidIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AddKidIntent';
    },
    handle(handlerInput) {
        let child = Alexa.getSlotValue(handlerInput.requestEnvelope, 'kid');
        const speakOutput = `You activated the AddKidIntent ${(child) ? " with name: " + child : ""}`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('anything else?')
            .getResponse();
    }
};

const RemoveKidIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'RemoveKidIntent';
    },
    handle(handlerInput) {
        let child = Alexa.getSlotValue(handlerInput.requestEnvelope, 'kid');
        const speakOutput = `You activated the RemoveKidIntent ${(child) ? " with name: " + child : ""}`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('anything else?')
            .getResponse();
    }
};

const ChangeKidNameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChangeKidNameIntent';
    },
    handle(handlerInput) {
        let child = Alexa.getSlotValue(handlerInput.requestEnvelope, 'kid');
        const speakOutput = `You activated the ChangeKidNameIntent ${(child) ? " with name: " + child : ""}`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('anything else?')
            .getResponse();
    }
};

const GetBedtimeReportIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetBedtimeReportIntent';
    },
    handle(handlerInput) {
        let child = Alexa.getSlotValue(handlerInput.requestEnvelope, 'kid');
        const speakOutput = `You activated the GetBedtimeReportIntent ${(child) ? " with name: " + child : ""}`;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('anything else?')
            .getResponse();
    }
};

//Entry Point
const skill = Alexa.SkillBuilders.custom()
    .addErrorHandlers(ErrorHandler)
    .addRequestHandlers(
        LaunchRequestHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        AlertParentIntentHandler,
        StartBedtimeIntentHandler,
        EndBedtimeIntentHandler,
        AddKidIntentHandler,
        RemoveKidIntentHandler,
        ChangeKidNameIntentHandler,
        GetBedtimeReportIntentHandler
    )
    .withCustomUserAgent('reference-skills/intro-to-alexa-conversations/v7')
    .create(); 
*/
//const adapter = new ExpressAdapter(skill, false, false);

//app.post('/alexa', adapter.getRequestHandlers());
app.listen(8080);


console.log("Parent Alarm Alexa Skill Server started on port 8080");