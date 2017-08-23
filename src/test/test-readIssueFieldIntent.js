'use strict'
var expect = require('chai').expect;
var assert = require('chai').assert;
var index = require('../index');
var events = require('./events');
var resultArr = [];
var utils = require('./utils');
var fs = require("fs");
var sch = JSON.parse(fs.readFileSync('../speechAssets/IntentSchema.json', 'utf-8'));
var utterances = fs.readFileSync('../speechAssets/SampleUtterances_en_US.txt', "utf-8");
var sampleIssueResponse = JSON.parse(fs.readFileSync('./test/sampleIssueResponse.json', 'utf-8'));
const jira = require('../jiraClient')
var intents = sch.intents;

// https://www.thepolyglotdeveloper.com/2016/08/test-amazon-alexa-skills-offline-with-mocha-and-chai-for-node-js/
const context = require('aws-lambda-mock-context');
const ctx1 = context();
const ctx2 = context();

describe("Test Cases for ReadIssueFieldIntent", function () {
    before(function (done) {
        jira.setCurrentResponse(sampleIssueResponse);
        done();
    })
    describe("Testing utterance list for ReadIssueFieldIntent", function () {
        it('should have at least 15 utterances for ReadIssueFieldIntent', function () {
            var count = (utterances.match(/ReadIssueFieldIntent/g) || []).length;
            expect(count).to.be.gte(15)
        })
        it('should have at least 15 PROJECT_KEY slots', function () {
            var count = (utterances.match(/{FIELD_KEY}/g) || []).length;
            expect(count).to.be.gte(15)
        })
    })
    describe("Testing IntentSchema for ReadIssueFieldIntent slots", function () {
        it('should include ReadIssueFieldIntent', function () {
            var hasReadIssueFieldIntent = false;
            for (var i = 0; i < intents.length; i++) {
                if (intents[i].intent == "ReadIssueFieldIntent") {
                    hasReadIssueFieldIntent = true
                }
            }
            expect(hasReadIssueFieldIntent).to.be.true
        })
        it('should include at least one slot', function () {
            var slots = null;
            for (var i = 0; i < intents.length; i++) {
                if (intents[i].intent == "ReadIssueFieldIntent") {
                    slots = intents[i].slots
                }
            }
            expect(slots).to.exist
        })
        it('should include a slot named FIELD_KEY', function () {
            var hasCorrectSlot = false;
            var slots = null;
            for (var i = 0; i < intents.length; i++) {
                if (intents[i].intent == "ReadIssueFieldIntent") {
                    slots = intents[i].slots
                    for (var j = 0; j < slots.length; j++) {
                        if (slots[j].name == "FIELD_KEY") {
                            hasCorrectSlot = true
                        }
                    }
                }
            }
            expect(hasCorrectSlot).to.be.true
        })
    });
    describe("Testing conversational elements of ReadIssueFieldIntent", function () {
        var speechResponse = null;
        var speechError = null;

        before(function (done) {
            index.handler(events.ReadIssueFieldIntent, ctx2)
            ctx2.Promise
                .then(resp => { speechResponse = resp; done(); })
                .catch(err => { speechError = err; done(); })
        })
        describe("The response keeps the conversation open", function () {
            it("should have a reprompt available", () => {
                expect(speechResponse.response.reprompt).to.exist
            })
            it("should not end the alexa session", function () {
                expect(speechResponse.response.shouldEndSession).to.be.false
            })
        })
        describe("The response is structurally correct", function () {
            it('should not have errored', function () {
                expect(speechError).to.be.null
            })
            it('should have a speechlet response', function () {
                expect(speechResponse.response).to.exist
            })

            it("should have a spoken response", () => {
                expect(speechResponse.response.outputSpeech).to.exist
            })

            it("should have a card response", () => {
                expect(speechResponse.response.card).to.exist
            })
        })
        describe("Testing GET_ISSUE_FIELD Random segments", function () {
            it("should include at least 5 different phrase options", () => {
                expect(index.ReadIssueFieldMsg.length).to.be.gte(5)
            })
            it("should randomly include segments from the GET_ISSUE_FIELD array", () => {
                var msg = speechResponse.response.outputSpeech.ssml;
                resultArr.push(msg);
                var numPhrasesUsed = utils.calcNumPhrasesIncluded(resultArr, index.ReadIssueFieldMsg);
                expect(numPhrasesUsed).to.be.gte(1)
            })
        })
        describe("Testing getIssueField response", function () {
            it("should include the description from the test Jira issue", () => {
                var msg = speechResponse.response.outputSpeech.ssml;
                resultArr.push(msg);
                expect(msg).to.contain("This should be the description returned by NodeJS jira-client")
            })
        })
    });
});