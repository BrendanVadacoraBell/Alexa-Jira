//require libraries
const Alexa = require('alexa-sdk');
const utils = require('../utils')
const jiraClient = require('../jiraClient')

//messages for VUI authenticity
const messages = [
    "I have loaded issue: ",
    "The issue has been loaded: ",
    "Your issue has been staged: ",
    "You may now work on your issue: ",
    "I have loaded the ticket: "
]

//export messages and handlers
module.exports = {
    'messages': messages,
    'handlers': {
        'LoadIssueIntent': function () {
            this.emit('LoadIssue')
        },
        'LoadIssue': function () {
            // get the spoken project key and issue number
            const projectKey = this.event.request.intent.slots.PROJECT_KEY.value;
            const issueNumber = parseInt(this.event.request.intent.slots.ISSUE_NUMBER.value);

            //if the slots are presents, continue, emit return reprompt messages
            if (projectKey && issueNumber) {

                //call the jira api
                jiraClient.loadIssue(projectKey, issueNumber)
                    .then(response => {
                        //set the response in jiraClient
                        jiraClient.setCurrentResponse(response)
                        // Create speech output
                        var speechOutput = utils.getRandomIntroMessage(messages) + `${projectKey}-${issueNumber}`;
                        // Use this.t() to get corresponding language data
                        this.emit(':askWithCard', speechOutput, 'You can load another ticket or try one of my other capabilities.',
                            this.t("SKILL_NAME"), speechOutput)
                    })
                    .catch(error => {
                        //catch the error and use the resolve error helper from jiraClient to get appropriate responses
                        var output = jiraClient.resolveError(error)
                        this.emit(':askWithCard', output.speechOutput, output.suggestion,
                            this.t("SKILL_NAME"), output.speechOutput + output.suggestion);
                    })

            }
            else {
                this.emit(':askWithCard', 'I did not understand that request', "Please provide a valid project key and issue number.",
                    this.t("SKILL_NAME"), 'I did not understand that request. Please provide a valid project key and issue number.');
            }
        },
    }
}