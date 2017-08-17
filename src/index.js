'use strict';
var Alexa = require('alexa-sdk');

var utils = require('./utils')
var jiraClient = require('./jiraClient')

var APP_ID = undefined;  // can be replaced with your app ID if publishing
var GET_ISSUE_DESCRIPTION_EN = [
    "Here is the description: ",
    "I found the description: ",
    "Here is the issue's description: ",
    "I will read the description to you: ",
    "Issue description: "
]
var MOVE_ISSUE_EN = [
    "I have moved the issue.",
    "Jira has moved the issue.",
    "The issue has been moved.",
    "I have moved that ticket for you.",
    "I have moved that ticket."
]
var LOAD_ISSUE_EN = [
    "I have loaded issue: ",
    "The issue has been loaded: ",
    "Your issue has been staged: ",
    "You may now work on your issue: ",
    "I have loaded the ticket: "
]
// Test hooks - do not remove!
exports.GetIssueDescriptionMsg = GET_ISSUE_DESCRIPTION_EN;
exports.MoveIssueMsg = MOVE_ISSUE_EN;
exports.loadIssueMsg = LOAD_ISSUE_EN;
var APP_ID_TEST = "mochatest";  // used for mocha tests to prevent warning
// end Test hooks

var languageStrings = {
    "en": {
        "translation": {
            "SKILL_NAME": "Jira Skill",  // OPTIONAL change this to a more descriptive name
            "GET_ISSUE_DESCRIPTION": GET_ISSUE_DESCRIPTION_EN,
            "MOVE_ISSUE": MOVE_ISSUE_EN,
            "LOAD_ISSUE": LOAD_ISSUE_EN,
            "HELP_MESSAGE": "You can ask me to do something with a Jira Issue, or, you can say exit... What can I help you with?",
            "HELP_REPROMPT": "What can I help you with?",
            "STOP_MESSAGE": "Goodbye!"
        }
    }
};

exports.handler = function (event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // set a test appId if running the mocha local tests
    if (event.session.application.applicationId == "mochatest") {
        alexa.appId = APP_ID_TEST
    }
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('Launch')
    },
    'Launch': function(){
        var speechOutput = "Welcome to the Alexa Jira skill. You can ask me to do anything that Jira can."
        this.emit(':askWithCard', speechOutput, 'Go ahead, try it out!.', this.t("SKILL_NAME"), speechOutput)
    },
    'LoadIssueIntent': function() {
        this.emit('LoadIssue')
    },
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
                var speechOutput = utils.getRandomIntroMessage(LOAD_ISSUE_EN) + `${projectKey}-${issueNumber}`;
                // Use this.t() to get corresponding language data
                this.emit(':askWithCard', speechOutput, 'You can load another ticket or try one of my other capabilities.', this.t("SKILL_NAME"), speechOutput)
            })
        }
        else{ 
            this.emit(':askWithCard', 'I did not understand that request', "Please provide a valid project key and issue number.", this.t("SKILL_NAME"), 'I did not understand that request. Please provide a valid project key and issue number.');
        }
    },
    'ReadIssueDescriptionIntent': function () {
        this.emit('ReadIssueDescription');
    },
    'ReadIssueDescription': function () {

            //call the jira function
            var description = jiraClient.getIssueDescription()

        if(description){

        
            var speechOutput = utils.getRandomIntroMessage(GET_ISSUE_DESCRIPTION_EN) + description;
            // Use this.t() to get corresponding language data
            this.emit(':askWithCard', speechOutput, 'You can ask for another field or try one of my other capabilities.', this.t("SKILL_NAME"), description)
        
        }
        else{ 
            this.emit(':askWithCard', 'I did not understand that request', "Please provide a valid project key and issue number.", this.t("SKILL_NAME"), 'I did not understand that request. Please provide a valid project key and issue number.');
        }
        
    },
    'MoveIssueIntent': function () {
        this.emit('MoveIssue');
    },
    'MoveIssue': function () {
        var transitionId = this.event.request.intent.slots.TRANSITION_ID.value;
  
        if(transitionId){
            //call the Jira api
            var moveIssuePromise = jiraClient.moveIssue(transitionId)

            //once the promise is resolved
            Promise.resolve(moveIssuePromise).then(result => {
                // Create speech output
                var speechOutput = utils.getRandomIntroMessage(MOVE_ISSUE_EN);
                // Use this.t() to get corresponding language data
                this.emit(':askWithCard', speechOutput, 'You can ask for another task like you did before.', this.t("SKILL_NAME"), speechOutput)
            })
        }
        else{ 
            this.emit(':askWithCard', 'I did not understand that request', "Please provide a transition ID.", this.t("SKILL_NAME"), 'I did not understand that request. Please provide a valid transition id.');
        }
    },
    'AMAZON.HelpIntent': function () {
        var speechOutput = this.t("HELP_MESSAGE");
        var reprompt = this.t("HELP_MESSAGE");
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    }
};
