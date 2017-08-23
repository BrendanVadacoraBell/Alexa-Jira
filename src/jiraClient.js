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
    getIssueField: function (fieldKey) {
        //if the current issue is staged, return, else throw
        if (currentIssueResponse) {
            const field = currentIssueResponse.fields[`${fieldKey}`];

            //throw error if undefined
            if(!field){
                throw {cause: {code : 'FIELDNOTFOUND'}}
            }

            //if the field is an object get the displayName/name
            if(field instanceof Object){
                if(field.displayName){
                    return field.displayName
                }
                else if(field.name){
                    return field.name
                }
                else{
                    throw {cause: {code : 'FIELDNOTFOUND'}}
                }
            }
            else{
                return field
            }

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

        //return a promise of transitioning the issue and then getting the issue
        return [jira.transitionIssue(issue, transition), jira.findIssue(issue, '*', '*all', '*', false)]
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

        //log the error
        console.error("Error:", error)

        //switch on error code and build the appropriate message
        switch (error.cause.code) {
            case 'ENOTFOUND':
                return buildErrorMessage("I could not connect to that server.", 
                    "Please check that your server configuration is correct.")
            case 'CISSUENOTFOUND':
                return buildErrorMessage("There is no issue currently staged.",
                    "Please stage an issue first.")
            case 'FIELDNOTFOUND':
                return buildErrorMessage("I could not find that field.",
                    "Please try again or specify another field.")
        }
    }

}