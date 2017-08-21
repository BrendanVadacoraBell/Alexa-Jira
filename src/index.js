'use strict';
//required libraries
var Alexa = require('alexa-sdk');
var utils = require('./utils')
var jiraClient = require('./jiraClient')

//intents
var requiredIntents = require('./intents/requiredIntents.js')

var APP_ID = undefined;  // can be replaced with your app ID if publishing

// Test hooks - do not remove!
exports.GetIssueDescriptionMsg = requiredIntents.descriptionIntent.messages;
exports.MoveIssueMsg = requiredIntents.moveIssueIntent.messages;
exports.loadIssueMsg = requiredIntents.loadIssueIntent.messages;
var APP_ID_TEST = "mochatest";  // used for mocha tests to prevent warning
// end Test hooks

var languageStrings = {
    "en": {
        "translation": {
            "SKILL_NAME": "Jira Skill",  // OPTIONAL change this to a more descriptive name
            "GET_ISSUE_DESCRIPTION": requiredIntents.descriptionIntent.messages,
            "MOVE_ISSUE": requiredIntents.moveIssueIntent.messages,
            "LOAD_ISSUE": requiredIntents.loadIssueIntent.messages,
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
    //Add handlers from ./intents
    alexa.registerHandlers(handlers, 
        requiredIntents.descriptionIntent.handlers, 
        requiredIntents.moveIssueIntent.handlers,
        requiredIntents.loadIssueIntent.handlers);
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
    'ReadIssueDescriptionIntent': function () {
        //emit event for descriptionIntent.handlers
        this.emit('ReadIssueDescription')
    },
    'MoveIssueIntent': function () {
        this.emit('MoveIssue');
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
