//import required intents
var readFieldIntent = require('./readFieldIntent')
var moveIssueIntent = require('./moveIssueIntent')
var loadIssueIntent = require('./loadIssueIntent.js')

//export required intents
module.exports = {
    'readFieldIntent': readFieldIntent,
    'moveIssueIntent': moveIssueIntent,
    'loadIssueIntent': loadIssueIntent
}