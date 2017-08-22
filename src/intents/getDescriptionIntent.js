//require libraries
const Alexa = require('alexa-sdk');
const utils = require('../utils')
const jiraClient = require('../jiraClient')

//messages for VUI authenticity
const messages = [
        "Here is the description: ",
        "I found the description: ",
        "Here is the issue's description: ",
        "I will read the description to you: ",
        "Issue description: "
]

//export messages and handlers
module.exports = {
    'messages' : messages,
    'handlers': {
        'ReadIssueDescriptionIntent': function () {
            //emit event for descriptionIntent.handlers
            this.emit('ReadIssueDescription')
        },
        'ReadIssueDescription': function () {

            //call the jira function
            try{
                var description = jiraClient.getIssueDescription()

                if(description){

                
                    var speechOutput = utils.getRandomIntroMessage(messages) + description;
                    // Use this.t() to get corresponding language data
                    this.emit(':askWithCard', speechOutput, 'You can ask for another field or try one of my other capabilities.', this.t("SKILL_NAME"), description)
                
                }
                else{ 
                    this.emit(':askWithCard', 'I did not understand that request', "Please provide a valid project key and issue number.", this.t("SKILL_NAME"), 'I did not understand that request. Please provide a valid project key and issue number.');
                }
            }
            catch(error){
                var output = jiraClient.resolveError(error)
                this.emit(':askWithCard', output.speechOutput, output.suggestion,
                    this.t("SKILL_NAME"), output.speechOutput + output.suggestion);
            }
            
        },
    }
}

