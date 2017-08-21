var Alexa = require('alexa-sdk');
var utils = require('../utils')
var jiraClient = require('../jiraClient')

var messages = [
        "Here is the description: ",
        "I found the description: ",
        "Here is the issue's description: ",
        "I will read the description to you: ",
        "Issue description: "
    ]

module.exports = {
    'messages' : messages,
    'handlers': {
        'ReadIssueDescription': function () {

            //call the jira function
            var description = jiraClient.getIssueDescription()

            if(description){

            
                var speechOutput = utils.getRandomIntroMessage(messages) + description;
                // Use this.t() to get corresponding language data
                this.emit(':askWithCard', speechOutput, 'You can ask for another field or try one of my other capabilities.', this.t("SKILL_NAME"), description)
            
            }
            else{ 
                this.emit(':askWithCard', 'I did not understand that request', "Please provide a valid project key and issue number.", this.t("SKILL_NAME"), 'I did not understand that request. Please provide a valid project key and issue number.');
            }
            
        },
    }
}

