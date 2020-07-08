///import { }

import { InputHints, MessageFactory, CardFactory } from 'botbuilder';
import { ComponentDialog,ConfirmPrompt,ChoiceFactory, TextPrompt,ChoicePrompt,NumberPrompt, WaterfallDialog} from 'botbuilder-dialogs'
import { FeedDialog } from './feedDialog'
const Card = require('../../resources/card.json');
//import {CONFRIM_PROMPT} from 'botbuilder-dialogs'
//import {ChoicePrompt} from 'botbuilder-dialogs'
//import { TextPrompt} from 'botbuilder-dialogs'
//import{ WATERFALL_DIALOG} from 'botbuilder-dialogs'
///import {NUMBER_PROMPT} from 'botbuilder-dialogs';
const CONFIRM_PROMPT = 'confirmPrompt';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const FEED_DIALOG ='feedDialog';
const TEXT_PROMPT = 'textPrompt';

const WATERFALL_DIALOG = 'waterfallDialog';

 export class FlightBookingRecognizer extends ComponentDialog {
    constructor(id)
     {
        super(id ||'FlightBookingRecognizer');
        //if (!FeedBackDialog) throw new Error('[mainDialog]: Missing parameter \'hardwareDialog\' is required');

        this.addDialog(new TextPrompt(TEXT_PROMPT))
            .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
            .addDialog(new NumberPrompt(NUMBER_PROMPT))
            .addDialog(new ChoicePrompt(CHOICE_PROMPT))
            .addDialog(new FeedDialog(FEED_DIALOG))

            this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.Step1.bind(this),
                this.Step2.bind(this),
                this.Step3.bind(this),
                this.Step4.bind(this),
                this.Step5.bind(this),
                this.Step6.bind(this),
                this.Step7.bind(this),
                this.Step8.bind(this),
                this.Step9.bind(this),
                this.Step10.bind(this)
                
                
            ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

   
    async Step1(stepContext) {
        //const messageText = 'Please provide Short Description of the issue';
        //return await stepContext.prompt(TEXT_PROMPT, { prompt: messageText });
    
        return await stepContext.prompt(CHOICE_PROMPT, {
        prompt: 'What is your ticket category.',
        choices: ChoiceFactory.toChoices(['Create ticket', 'create incident', 'I am facing an issue', 'I need help on an issue','Report IT Issue','Create IT ticket'])
        });
    }
    async Step2(stepContext) {
        
       
            const messageText = 'Please provide Short Description of the issue';
            return await stepContext.prompt(TEXT_PROMPT, { prompt: messageText });
        }
        async Step3(stepContext) 
        {
            const messageText = 'Please provide Detailed Description of the issue.?';
             return  await stepContext.prompt(TEXT_PROMPT, { prompt: messageText });
            }
       async Step4(stepContext) {
        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: 'Select the impact level of this issue',
            choices: ChoiceFactory.toChoices(['Self', 'Group of people', 'Business'])
        });    
    }
    async Step5(stepContext) {
        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: 'Select the category of the issue:',
            choices: ChoiceFactory.toChoices([' Default', ' inquiry' ,' software',' hardware' ,' network',' database'])
        });    
    }
    async Step6(stepContext) 
    {
      {      
      
       const cardPrompt = MessageFactory.text('');
       const card1 = CardFactory.adaptiveCard(Card);
       cardPrompt.attachments = [card1];
       return await stepContext.prompt(TEXT_PROMPT,cardPrompt);
      }
    }

      async Step7(stepContext)
      {
         return await stepContext.prompt(TEXT_PROMPT,{
            prompt:'[Click here](http://inside.adm.com) if you would like to be connected to a live agent via Chat.'+  
        '\n**Note:** Live Agent availability during UAT is limited between 8AM-5PM CST, Mon-Fri.'+
        'If you prefer to contact Service Desk by phone, Contact numbers are [here](http://inside.adm.com/inside/en-US/IT/ITSupport/Pages/default.aspx) by your Region and Country.'
        });
    }


      async Step8(stepContext) {
        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: 'Is there anything else I can help you with?',
            choices: ChoiceFactory.toChoices(['yes','no'])
           
        });
    }
    async Step9(stepContext) {
            if(stepContext.results =='yes')
            {
            const messageText = 'How may I help you today?';
             return  await stepContext.prompt(TEXT_PROMPT, { prompt: messageText });
            }
            else{
                const messageText = 'Thankyou';
             return  await stepContext.prompt(TEXT_PROMPT, { prompt: messageText });
            }            
        }
        async Step10(stepContext) {
            const feedbackDetails = {};
            return await stepContext.beginDialog(FEED_DIALOG, {feedbackDetails});
            //await stepContext.context.sendActivity('Yyyyyyyy')
}
    }
    



