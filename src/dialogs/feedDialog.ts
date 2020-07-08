//import { MessageFactory, InputHints } from 'botbuilder'
import { ComponentDialog, ConfirmPrompt, TextPrompt, WaterfallDialog, ChoicePrompt } from 'botbuilder-dialogs'
import { InputHints, MessageFactory }  from 'botbuilder'
import { ChoiceFactory} from 'botbuilder-dialogs'
//import {CONFIRM_PROMPT } from'';
const CONFIRM_PROMPT = 'confirmPrompt';
const CHOICE_PROMPT = 'CHOICE_PROMPT';
const NUMBER_PROMPT = 'NUMBER_PROMPT';
const TEXT_PROMPT = 'textPrompt';
const WATERFALL_DIALOG = 'waterfallDialog';
export class FeedDialog extends ComponentDialog {
 constructor(id) {
        super(id || 'FeedDialog');

    this.addDialog(new TextPrompt(TEXT_PROMPT))
        .addDialog(new ConfirmPrompt(CONFIRM_PROMPT))
        .addDialog(new ChoicePrompt(CHOICE_PROMPT))
            this.addDialog(new WaterfallDialog(WATERFALL_DIALOG, [
                this.Step1.bind(this),
                this.Step2.bind(this),
            ]));
          this.initialDialogId = WATERFALL_DIALOG;
        }        
    async Step1(stepContext) 
    {
    return await stepContext.prompt(CHOICE_PROMPT, {
            prompt: 'Please take a minute to share your experience with us to serve you better.'+'/n/n'+

            'How would you rate the service you just received from CSD Bot?',
            choices: ChoiceFactory.toChoices(['Great',
            'Good',
            'Average', 
            'Poor',
            'Not Helpful '])
        });
    }
    async Step2(stepContext) {
    switch(stepContext.result.index)
    {
        case 0:
            {
            const messageText = ' Thanks for the feedback and for using CSD Bot!';
            return  await stepContext.prompt(TEXT_PROMPT, { prompt: messageText });
            }
            case 1:
                {
            const messageText = 'Thanks for the feedback and for using CSD Bot!';
            return  await stepContext.prompt(TEXT_PROMPT, { prompt: messageText });
                }
            case 2:
            {
            const messageText =' Apologies for that kind of experience.'+
            'Please provide details of what went wrong during todays conversation?';
            return  await stepContext.prompt(TEXT_PROMPT, { prompt: messageText });
            }
            case 3:
            {
            const messageText =' Apologies for that kind of experience.'+
            'Please provide details of what went wrong during todays conversation?';
            return  await stepContext.prompt(TEXT_PROMPT, { prompt: messageText });
            }
            case 4:{
            const messageText =' Apologies for that kind of experience.'+
            'Please provide details of what went wrong during todays conversation?';
            return  await stepContext.prompt(TEXT_PROMPT, { prompt: messageText });
            }
            default:
            {
            const messageText = 'Thank you for contacting CSD Bot. Have a great day!';
            return  await stepContext.prompt(TEXT_PROMPT, { prompt: messageText });  
            }
    }
    }
    }