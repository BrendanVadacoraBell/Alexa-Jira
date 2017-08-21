//require libraries
var Alexa = require('alexa-sdk');
var utils = require('../utils')
var jiraClient = require('../jiraClient')

//messages for VUI authenticity
var messages = [
    "I have moved the issue.",
    "Jira has moved the issue.",
    "The issue has been moved.",
    "I have moved that ticket for you.",
    "I have moved that ticket."
]

//export messages and handlers
module.exports = {
    'messages' : messages,
    'handlers': {
        'MoveIssue': function () {
            var transitionId = this.event.request.intent.slots.TRANSITION_ID.value;
    
            if(transitionId){
                //call the Jira api
                var moveIssuePromise = jiraClient.moveIssue(transitionId)

                //once the promise is resolved
                Promise.resolve(moveIssuePromise).then(result => {
                    // Create speech output
                    var speechOutput = utils.getRandomIntroMessage(messages);
                    // Use this.t() to get corresponding language data
                    this.emit(':askWithCard', speechOutput, 'You can ask for another task like you did before.', this.t("SKILL_NAME"), speechOutput)
                })
            }
            else{ 
                this.emit(':askWithCard', 'I did not understand that request', "Please provide a transition ID.", this.t("SKILL_NAME"), 'I did not understand that request. Please provide a valid transition id.');
            }
        },
    }
}