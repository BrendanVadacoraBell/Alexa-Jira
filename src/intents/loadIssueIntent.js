//require libraries
var Alexa = require('alexa-sdk');
var utils = require('../utils')
var jiraClient = require('../jiraClient')

//messages for VUI authenticity
var messages = [
    "I have loaded issue: ",
    "The issue has been loaded: ",
    "Your issue has been staged: ",
    "You may now work on your issue: ",
    "I have loaded the ticket: "
]

//export messages and handlers
module.exports = {
    'messages' : messages,
    'handlers': {
        'LoadIssue': function() {
            // get the spoken project key and issue number
            var projectKey = this.event.request.intent.slots.PROJECT_KEY.value;
            var issueNumber = parseInt(this.event.request.intent.slots.ISSUE_NUMBER.value);

            if(projectKey && issueNumber){

                //call the jira api
                var loadIssuePromise = jiraClient.loadIssue(projectKey, issueNumber)

                //once the promise is resolved
                Promise.resolve(loadIssuePromise).then(result => {
                    // Create speech output
                    var speechOutput = utils.getRandomIntroMessage(messages) + `${projectKey}-${issueNumber}`;
                    // Use this.t() to get corresponding language data
                    this.emit(':askWithCard', speechOutput, 'You can load another ticket or try one of my other capabilities.', this.t("SKILL_NAME"), speechOutput)
                })
            }
            else{ 
                this.emit(':askWithCard', 'I did not understand that request', "Please provide a valid project key and issue number.", this.t("SKILL_NAME"), 'I did not understand that request. Please provide a valid project key and issue number.');
            }
        },
    }
}