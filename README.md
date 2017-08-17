# Alexa Jira Skill

## What will it do?
Anything and everything that Jira can. Want to update an issue, read the description, create a new project? Done.

## How do I setup Alexa and AWS Lambda?

Follow these instructions to gain an understanding of the basic architecture and setup: https://github.com/BrendanVadacoraBell/AIND-VUI-Alexa/blob/master/OLD_SPACE_GEEK_INSTRUCTIONS.md

## How do I setup Jira?

Right now, the Jira Node JS library (https://github.com/jira-node/node-jira-client), is just using Basic Authentication.
src/credentials.json will contain the Jira domain, username and password.

## So, how does it work?

Currently, it 'stages' a ticket. The user will say something like 'stage issue WUNJHB 2' as an example. The response from Jira will be contain everything to do with that issue and will be saved in memory. This allows us to read the description of the issue by saying something like "describe it". A user can also move the ticket by saying "move it to ready for development". In the future it will include features to add a comment, assign it to a Jira user, etc.

This VUI of staging a ticket is necessary to avoid long commands and allows multiple commands of an issue to take place without having to repeat oneself. Also, the same amount of work is required to just switch the staged issue.

## What have we got so far?

### IntentSchema.json
There are intents for loading and issue, reading an issue description and moving an issue. Loading an issue has a custom slot PROJECT_KEY. The PROJECT_KEY slot is a list of all the project keys in Jira, such as WUNJHB. The user spells the key out so Alexa may accurately match the key, as these are often not real words and have strange phonetics.
The move issue intent also has a custom slot, TRANSITION_ID. This a list of tranistion keys, such as "open", "ready for development". A static json file of these keys and their id values can be found in transitions.json. The key is necessary for the user and the id is necessary to move the issue in Jira. A better way should be found to translate the keys to the ids on the backend.

### SampleUtterances_en_US.txt
There are 15 sample utterances for each intent all with the relevant slots. Try keep each utterance similar for a single intent, so that NLP may be used to understand the general sentiment for the intent.

### Testing
There are tests per intent and for the general setup. This uses Mocha and Chai. The things tested for are the VUI, the jira responses (for integration of the entire skill), and - again - the general setup.

### index.js
This contains the code for the jira intents and some static messages, etc. It will get quite large rather quickly, so the fucntionality contained should be further abstracted and put into other files.

### jiraClient.js
Does the initial setup by reading the credentials.json file. Also, exposes methods to be used by the intents.

### utils.js
Any utility methods used in multiple places can be abstracted here.

### package.json
The obvious stuff. Would be great to include a script that creates the zip file to be uploaded to AWS Lambda, which includes everything in src except the tests.

## So, what do I need to do to get it up and running?

NodeJS, obviously. And NPM too. Node: 6.11.X and NPM 3.10.X preferrably.

1. Clone this project
2. Run in src folder:
        ``npm install``
3. Enter your credentials for Jira into credentials.json
4. Run:
        ``npm test``
   . You may need to adjust the mocha timeout time depending on your internet speed, as this will affect the response time for Jira calls.
5. Once it's all good, make sure you setup Alexa services and AWS Lambda as explained above https://github.com/BrendanVadacoraBell/AIND-VUI-Alexa/blob/master/OLD_SPACE_GEEK_INSTRUCTIONS.md
6. Be sure to zip everything in src, except the test folder. This is what must be uploaded to AWS Lambda. Also, keep it lean. Once over 10MB, Lambda suggests using S3. While that is not required, it does take longer to save the uploaded .zip file the larger it is.
