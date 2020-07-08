//import { InputHints, MessageFactory } from'botbuilder';
import { InputHints, MessageFactory, CardFactory } from 'botbuilder';
import { LuisRecognizer } from 'botbuilder-ai';
const Card1 = require('../../resources/card1.json');
import{FeedDialog} from './feedDialog';
///var feedDialog=new require ('./'feedDialog.ts);
//import { ChoiceFactory} from 'botbuilder-dialogs';
import { ComponentDialog,ChoiceFactory,ConfirmPrompt, TextPrompt,ChoicePrompt,NumberPrompt, WaterfallDialog} from 'botbuilder-dialogs'
//import ConfirmPrompt from 'botbuilder-dialogs';
//import CHOICE_PROMPT from 'CHOICE_PROMPT';
//import NUMBER_PROMPT from 'NUMBER_PROMPT';
//import TEXT_PROMPT from'TEXT_PROMPT';
//const FeedDialog={};
const CONFIRM_PROMPT = 'confirmPrompt';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const TEXT_PROMPT = 'textPrompt';
const FEED_DIALOG ='feedDialog';
const WATERFALL_DIALOG = 'waterfallDialog';
//const feedbackDetails={};
export class BookDialog extends ComponentDialog {
    constructor(id) {
        super(id || 'BookDialog');

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
                this.step7.bind(this)
                ]));

        this.initialDialogId = WATERFALL_DIALOG;
    }

    async Step1(stepContext) {
        return await stepContext.prompt(TEXT_PROMPT, {
            prompt: 'What is the issue in Unable to connect to Global protect',
            
        });

    }
    async Step2(stepContext)
     {
            const messageText ='All new Amway account have an Okta account (Okta database sync’s with Amway’s userdatabase)\n\n i.http://help.amwayconnect.com/assets/Docs/Okta-MFA-Setup.pdf\n\n ii.Amway recommends using the Okta Verify mobile app'
            const msg = MessageFactory.text(messageText, messageText,InputHints.ExpectingInput);
           return await stepContext.prompt(TEXT_PROMPT,{ prompt:msg});    
    }
    async Step3(stepContext) {
        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: 'Please confirm if the issue resolved',
            choices: ChoiceFactory.toChoices(['yes','no'])
            //const promptMessage = 'Please confirm if the issue resolved'
        //return await stepContext.prompt(CONFIRM_PROMPT, { 
            //prompt:'Please confirm if the issue resolved',  
    });
}
    async Step4(stepContext) {

        if(stepContext.result=='yes')
        {
        return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: 'Is there anything else I can help you with?',
            choices: ChoiceFactory.toChoices(['yes','no'])
        });
                }
                else
               {
            const cardPrompt = MessageFactory.text('');
            const card1 = CardFactory.adaptiveCard(Card1);
            cardPrompt.attachments = [card1];
            return await stepContext.prompt(TEXT_PROMPT,cardPrompt);
                }
        }
    
     async Step5(stepContext)
    {
      return await stepContext.prompt(TEXT_PROMPT,{
        prompt:  '[Click here](http://inside.adm.com) if you would like to be connected to a live agent via Chat.'+  
     '\n**Note:** Live Agent availability during UAT is limited between 8AM-5PM CST, Mon-Fri.'+
      'If you prefer to contact Service Desk by phone, Contact numbers are [here](http://inside.adm.com/inside/en-US/IT/ITSupport/Pages/default.aspx) by your Region and Country.'
    });
}
async Step6(stepContext)
{
    return await stepContext.prompt(TEXT_PROMPT, {
    prompt: 'Thank you for contacting CSD Bot. Have a great day.'    
    });

}
async step7(stepContext)
{
   const feedbackDetails={};
    //Feedbackdialg.feedbackStepcontextEndDialog(stepContext, feedbackDetails );
   return await stepContext.beginDialog(FEED_DIALOG, {feedbackDetails});
     //await stepContext.context.sendActivity('Yyyyyyyy')
   //Feedbackdialg.feedbackSessionEndDialog(stepContext,feedbackDetails );
   //return await stepContext.replaceDialog(this.initialDialogId, { restartMsg: 'What else can I do for you?' });
}
}
