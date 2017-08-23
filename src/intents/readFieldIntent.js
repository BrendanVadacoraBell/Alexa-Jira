//require libraries
const Alexa = require('alexa-sdk');
const utils = require('../utils')
const jiraClient = require('../jiraClient')

//messages for VUI authenticity
const messages = [
    "Here is the field: ",
    "I found the field: ",
    "Here is the issue's field: ",
    "I will read the field to you: ",
    "Issue field: "
]

//export messages and handlers
module.exports = {
    'messages': messages,
    'handlers': {
        'ReadIssueFieldIntent': function () {
            //emit event for descriptionIntent.handlers
            this.emit('ReadIssueField')
        },
        'ReadIssueField': function () {

            //get the slot
            var fieldKey = this.event.request.intent.slots.FIELD_KEY.value;

            if (fieldKey) {

                //call the jira function
                try {
                    var field = jiraClient.getIssueField(fieldKey)

                    if (field) {

                        var speechOutput = utils.getRandomIntroMessage(messages) + field;
                        // Use this.t() to get corresponding language data
                        this.emit(':askWithCard', speechOutput, 'You can ask for another field or try one of my other capabilities.', this.t("SKILL_NAME"), field)

                    }
                    else {
                        this.emit(':askWithCard', 'I did not understand that request', "Please provide a valid field key.", this.t("SKILL_NAME"), 'I did not understand that request. Please provide a valid field key.');
                    }
                }
                catch (error) {
                    var output = jiraClient.resolveError(error)
                    this.emit(':askWithCard', output.speechOutput, output.suggestion,
                        this.t("SKILL_NAME"), output.speechOutput + output.suggestion);
                }
            }
            else{
                this.emit(':askWithCard', 'I did not understand that request', "Please provide a valid field key.", this.t("SKILL_NAME"), 'I did not understand that request. Please provide a valid field key.');
            }

        },
    }
}

