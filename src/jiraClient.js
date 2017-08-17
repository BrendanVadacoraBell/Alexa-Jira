//using this Jira NodeJS library : https://github.com/jira-node/node-jira-client
var JiraClient = require('jira-client')

var fs = require("fs");
var credentials = JSON.parse(fs.readFileSync('./credentials.json', 'utf-8'));
var transitions = JSON.parse(fs.readFileSync('./transitions.json', 'utf-8'));
//TODO: Use OAuth
var jira = new JiraClient({
  protocol: 'https',
  host: credentials.domain,
  username: credentials.username,
  password: credentials.password,
  apiVersion: '2',
  strictSSL: true
});

var currentIssueResponse;

module.exports = {
    loadIssue: function(projectKey, issueNumber){
        var issue = `${projectKey}-${issueNumber}`

        return jira.findIssue(issue, '*', '*all', '*', false)
            .then(response => {
                console.log(`Jira: Found Issue - ${issue}`)
                currentIssueResponse = response
                return true;
            })
            .catch(error => {
                console.error(`Jira: Did not find Issue - ${issue}`, error)
                return {error: error}
            });
    },
    getIssueDescription : function(){
        if(currentIssueResponse){
            return currentIssueResponse.fields.description;
        }
        else{
            return "Please Load an Issue First"
        }

    },

    moveIssue : function(transitionId){
        
        var transition = {
            transition: {
                id: transitions[transitionId]
            }
        }

        if(currentIssueResponse){
            var issue = currentIssueResponse.id
        }
        else{
            return "Error"
        }

        return jira.transitionIssue(issue, transition)
            .then(response => {
                console.log(`Jira: Transitioned Issue ${currentIssueResponse.key} with transition id ${transitionId} : ${transitions[transitionId]}`)
                return true
            })
            .catch(error => {
                console.error(`Jira: Did not transition issue ${currentIssueResponse.key} with transition id ${transitionId} : ${transitions[transitionId]}`, error)
                return {error: error}
            })
    }
}