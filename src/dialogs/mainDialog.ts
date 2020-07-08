import { MessageFactory, InputHints } from 'botbuilder'
import { LuisApplication, LuisRecognizer, LuisRecognizerOptionsV3 } from 'botbuilder-ai';
import { LuiRecognizer } from './luisRecognizer';
import { BookDialog} from './bookDialog';
//import {  DialogAndWelcomeBot} from './bots/dialogAndWelcomeBot';
import {FlightBookingRecognizer} from './flightBookingRecognizer';
import { ComponentDialog, ConfirmPrompt, DialogSet, DialogTurnStatus, ChoiceFactory,ChoicePrompt,TextPrompt, WaterfallDialog } from 'botbuilder-dialogs'
//const Feedbackdialg= require('../dialogs/feedbackdialg');
//const feedbackDetails={};
const MAIN_WATERFALL_DIALOG = 'mainWaterfallDialog'
//const BOOKING_DIALOG = 'bookDialog';
//const FLIGHT_BOOKING_RECOGNIZER = 'flightBookingRecognizer';
//const{ListStyle} = require('botbuilder-dialogs');
//const CHOICE_PROMPT = 'CHOICE_PROMPT';
//var cp = new ChoicePrompt(CHOICE_PROMPT);
    //cp.style = ListStyle.list;
    //this.addDialog(cp);
     //this.choicesX = ['Pick1', 'Pick2', 'Pick3'];
export class MainDialog extends ComponentDialog {
    private luisRecognizer: LuiRecognizer;
    constructor(luisRecognizer:LuiRecognizer, bookingDialog:BookDialog, flightBookingRecognizer:FlightBookingRecognizer) 
    {
        super('MainDialog');
        if (!luisRecognizer) throw new Error('[mainDialog]: Missing parameter \'luisRecognizer\' is required');
        this.luisRecognizer = luisRecognizer;

        if (!bookingDialog) throw new Error('[mainDialog]: Missing parameter \'ticketDialog\' is required');
        if (!flightBookingRecognizer) throw new Error('[mainDialog]: Missing parameter \'hardwareDialog\' is required');
       // if (!feedBackDialog) throw new Error('[mainDialog]: Missing parameter \'ticketDialog\' is required');
        
        this.addDialog(new TextPrompt('TextPrompt'))
            .addDialog(new ConfirmPrompt('ConfirmPrompt'))
            .addDialog(new ChoicePrompt('ChoicePrompt'))
            .addDialog(bookingDialog)
            .addDialog(flightBookingRecognizer)
            //.addDialog(feedBackDialog)
           
            .addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.introStep.bind(this),
            this.actStep.bind(this),
            this.finalStep.bind(this),
            this.lastStep.bind(this)
            ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
    }
   async run(turnContext, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);
        const dialogContext = await dialogSet.createContext(turnContext);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
        await dialogContext.beginDialog(this.id);
        }
    }
    private async introStep(stepContext) {
        if (!this.luisRecognizer.isConfigured) {
            const luisConfigMsg = 'NOTE: LUIS is not configured. To enable all capabilities, add `LuisAppId`, `LuisAPIKey` and `LuisAPIHostName` to the .env file.';
            await stepContext.context.sendActivity(luisConfigMsg, null, InputHints.IgnoringInput);
            return await stepContext.next();
        }
        const messageText = (stepContext.options as any).restartMsg ? (stepContext.options as any).restartMsg : 'What can I help you with today?\nSay something like "Unable to connect to Global Protect or Create Incident"';
        const promptMessage = MessageFactory.text(messageText, messageText, InputHints.ExpectingInput);
        return await stepContext.prompt('TextPrompt', { prompt: promptMessage });
}

    async actStep(stepContext) {
        if (this.luisRecognizer.isConfigured) {
        console.log('hi');
        const globalDetails = {};
        const CreateIncidentDetails = {};
       // const feedbackDetails={};
        const luisResult = await this.luisRecognizer.executeLuisQuery(stepContext.context);
        console.log(luisResult);
        switch(LuisRecognizer.topIntent(luisResult)) {

        case 'Global_Protect': {
            //console.log('hi');
            return await stepContext.beginDialog('bookDialog', globalDetails);
            }
        case 'Create_Incident': {
            //return await stepContext.beginDialog('feedBackDialog', feedbackDetails);
            return await stepContext.beginDialog('flightBookingRecognizer', CreateIncidentDetails);
            }
        default: {
                //Catch all for unhandled intents
                const didntUnderstandMessageText = `Sorry, I didnt get that. Please try asking in a different way (intent was ${ LuisRecognizer.topIntent(luisResult) })`;
                await stepContext.context.sendActivity(didntUnderstandMessageText);
            }
        }
            }
    return await stepContext.next();
    }


    async finalStep(stepContext) {
        //return await stepContext.beginDialog('Feedbackdialg', feedbackDetails);
    const promptMessage = 'Do you have any other query??'
    return await stepContext.prompt('ConfirmPrompt', { prompt: promptMessage });
    }
    async lastStep(stepContext) {
        if (!stepContext.result) {
            return await stepContext.context.sendActivity('THANKYOU')
        }
        else {
            //return await stepContext.beginDialog('feedBackDialog', FeedBackDialog);
            return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: 'What else can I do for you?' });
        }
    }
}