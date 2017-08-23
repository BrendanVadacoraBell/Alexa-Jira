//require libraries
const Alexa = require('alexa-sdk');
const utils = require('../utils')
const jiraClient = require('../jiraClient')

//messages for VUI authenticity
const messages = [
    "I have moved the issue.",
    "Jira has moved the issue.",
    "The issue has been moved.",
    "I have moved that ticket for you.",
    "I have moved that ticket."
]

//export messages and handlers
module.exports = {
    'messages': messages,
    'handlers': {
        'MoveIssueIntent': function () {
            this.emit('MoveIssue');
        },
        'MoveIssue': function () {
            const transitionId = this.event.request.intent.slots.TRANSITION_ID.value;

            if (transitionId) {
                try{
                    //call the Jira api
                    Promise.all(jiraClient.moveIssue(transitionId))
                        .then(results => {
                            //set the response from the second promise
                            jiraClient.setCurrentResponse(results[1])
                            // Create speech output
                            var speechOutput = utils.getRandomIntroMessage(messages);
                            // Use this.t() to get corresponding language data
                            this.emit(':askWithCard', speechOutput, 'You can ask for another task like you did before.', this.t("SKILL_NAME"), speechOutput)
                        })
                        .catch(error => {
                            //catch the error and use the resolve error helper from jiraClient to get appropriate responses
                            var output = jiraClient.resolveError(error)
                            this.emit(':askWithCard', output.speechOutput, output.suggestion,
                                this.t("SKILL_NAME"), output.speechOutput + output.suggestion);
                        })
                }
                catch(error){
                    //catch the error and use the resolve error helper from jiraClient to get appropriate responses
                    var output = jiraClient.resolveError(error)
                    this.emit(':askWithCard', output.speechOutput, output.suggestion,
                        this.t("SKILL_NAME"), output.speechOutput + output.suggestion);
                }
            }
            else {
                this.emit(':askWithCard', 'I did not understand that request', "Please provide a transition ID.", this.t("SKILL_NAME"), 'I did not understand that request. Please provide a valid transition id.');
            }
        },
    }
}