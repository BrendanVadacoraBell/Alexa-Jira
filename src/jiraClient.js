//using this Jira NodeJS library : https://github.com/jira-node/node-jira-client
const JiraClient = require('jira-client')

const fs = require("fs");
const credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf-8'));
const transitions = JSON.parse(fs.readFileSync('./transitions.json', 'utf-8'));

//TODO: Use OAuth
const jira = new JiraClient({
    protocol: 'https',
    host: credentials.domain,
    username: credentials.username,
    password: credentials.password,
    apiVersion: '2',
    strictSSL: true
});

//store the current issue
var currentIssueResponse;

//export methods
module.exports = {
    loadIssue: function (projectKey, issueNumber) {
        //return a promise of finding the issue
        const issue = `${projectKey}-${issueNumber}`

        return jira.findIssue(issue, '*', '*all', '*', false)
    },
    getIssueDescription: function () {
        //if the current issue is staged, return, else throw
        if (currentIssueResponse) {
            return currentIssueResponse.fields.description;
        }
        else {
            throw {cause: {code : 'CISSUENOTFOUND'}}
        }

    },

    moveIssue: function (transitionId) {

        //build the transition obj for request
        const transition = {
            transition: {
                id: transitions[transitionId]
            }
        }

        //if the current issue is staged, continue, else throw
        if (currentIssueResponse) {
            var issue = currentIssueResponse.id
        }
        else {
            throw {cause: {code : 'CISSUENOTFOUND'}}
        }

        //return a promise of transitioning the issue
        return jira.transitionIssue(issue, transition)
    },

    setCurrentResponse: function (response) {
        //setter for current issue
        currentIssueResponse = response
    },

    resolveError: function (error) {

        /**
         * Builds the error response in a predefined format
         * @param {string} speech 
         * @param {string} suggestion 
         */
        function buildErrorMessage(speech, suggestion){
            return {
                    speechOutput: speech,
                    suggestion: suggestion
            }
        }

        //log the error code
        console.error("Error:", error.cause.code)

        //switch on error code and build the appropriate message
        switch (error.cause.code) {
            case 'ENOTFOUND':
                return buildErrorMessage("I could not connect to that server.", 
                    "Please check that your server configuration is correct.")
            case 'CISSUENOTFOUND':
                return buildErrorMessage("There is no issue currently staged.",
                    "Please stage an issue first.")
        }
    }

}