const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speakOutput = 'Welcome to Pet Care Assistant! You can ask me for reminders, grooming tips, and more. How can I assist you today?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt('How can I help you with your pet today?')
            .getResponse();
    }
};

const GetFeedingReminderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetFeedingReminderIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Brother, remember to feed your pet at 7 AM and 7 PM daily.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const GetGroomingTipIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetGroomingTipIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Regularly brush your pet to keep their coat healthy and reduce shedding.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const GetPetCareAdviceIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetPetCareAdviceIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Ensure your pet gets regular exercise, a balanced diet, and routine vet check-ups.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SetMedicationReminderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetMedicationReminderIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Medication reminder set for 8 AM daily.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ScheduleVetAppointmentIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ScheduleVetAppointmentIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Vet appointment scheduled for next Saturday at 10 AM.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SetPetReminderIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SetPetReminderIntent';
    },
    async handle(handlerInput) {
        const { action, time } = handlerInput.requestEnvelope.request.intent.slots;
        
        try {
            const reminder = {
                requestTime: new Date().toISOString(),
                trigger: {
                    type: "SCHEDULED_ABSOLUTE",
                    scheduledTime: time.value,
                    timeZoneId: "Asia/Kolkata", // Indian timezone
                    recurrence: {
                        freq: "DAILY",
                    }
                },
                alertInfo: {
                    spokenInfo: {
                        content: [{
                            locale: "en-IN",
                            text: `It's time to ${action.value}.`
                        }]
                    }
                },
                pushNotification: {
                    status: "ENABLED"
                }
            };
            
            const reminderApiClient = handlerInput.serviceClientFactory.getReminderManagementServiceClient();
            await reminderApiClient.createReminder(reminder);
            
            const speakOutput = `Reminder set to ${action.value} at ${time.value}. What else can I help you with?`;
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Is there anything else you need help with?')
                .getResponse();
            
        } catch (error) {
            console.error(error);
            const speakOutput = 'Sorry, I had trouble setting the reminder. Please try again later.';
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .reprompt('Is there anything else you need help with?')
                .getResponse();
        }
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say things like, give me a feeding reminder, or, tell me a grooming tip.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

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

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GetFeedingReminderIntentHandler,
        GetGroomingTipIntentHandler,
        GetPetCareAdviceIntentHandler,
        SetMedicationReminderIntentHandler,
        ScheduleVetAppointmentIntentHandler,
        SetPetReminderIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler
    )
    .addErrorHandlers(ErrorHandler)
    .withApiClient(new Alexa.DefaultApiClient()) // Required for reminders API
    .lambda();
