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
var intents = sch.intents;

// https://www.thepolyglotdeveloper.com/2016/08/test-amazon-alexa-skills-offline-with-mocha-and-chai-for-node-js/
const context = require('aws-lambda-mock-context');
const ctx1 = context();
const ctx2 = context();

describe("Test Cases for LoadIssueIntent", function () {
    describe("Testing utterance list for LoadIssueIntent", function () {
        it('should have at least 15 utterances for LoadIssueIntent', function () {
            var count = (utterances.match(/LoadIssueIntent/g) || []).length;
            expect(count).to.be.gte(15)
        })
        it('should have at least 15 PROJECT_KEY slots', function () {
            var count = (utterances.match(/{PROJECT_KEY}/g) || []).length;
            expect(count).to.be.gte(15)
        })
        it('should have at least 15 ISSUE_NUMBER slots', function () {
            var count = (utterances.match(/{ISSUE_NUMBER}/g) || []).length;
            expect(count).to.be.gte(15)
        })
    })
    describe("Testing IntentSchema for LoadIssueIntent slots", function () {
        it('should include LoadIssueIntent', function () {
            var hasMoveIssueIntent = false;
            for (var i = 0; i < intents.length; i++) {
                if (intents[i].intent == "LoadIssueIntent") {
                    hasMoveIssueIntent = true
                }
            }
            expect(hasMoveIssueIntent).to.be.true
        })
        it('should include at least one slot', function () {
            var slots = null;
            for (var i = 0; i < intents.length; i++) {
                if (intents[i].intent == "LoadIssueIntent") {
                    slots = intents[i].slots
                }
            }
            expect(slots).to.exist
        })
        it('should include a slot named PROJECT_KEY', function () {
            var hasCorrectSlot = false;
            var slots = null;
            for (var i = 0; i < intents.length; i++) {
                if (intents[i].intent == "LoadIssueIntent") {
                    slots = intents[i].slots
                    for (var j = 0; j < slots.length; j++) {
                        if (slots[j].name == "PROJECT_KEY") {
                            hasCorrectSlot = true
                        }
                    }
                }
            }
            expect(hasCorrectSlot).to.be.true
        })
        it('should include a slot named ISSUE_NUMBER', function () {
            var hasCorrectSlot = false;
            var slots = null;
            for (var i = 0; i < intents.length; i++) {
                if (intents[i].intent == "LoadIssueIntent") {
                    slots = intents[i].slots
                    for (var j = 0; j < slots.length; j++) {
                        if (slots[j].name == "ISSUE_NUMBER") {
                            hasCorrectSlot = true
                        }
                    }
                }
            }
            expect(hasCorrectSlot).to.be.true
        })
    });
    describe("Testing LoadIssueIntent with matching slot value", function () {
        var speechResponse = null;
        var speechError = null;

        before(function (done) {
            index.handler(events.LoadIssueIntent, ctx1)
            ctx1.Promise
                .then(resp => { speechResponse = resp; done(); })
                .catch(err => { speechError = err; done(); })
        })
        describe("request for WUNJHB-2", function () {
            it("should receive response", () => {
                var msg = speechResponse.response.outputSpeech.ssml;
                resultArr.push(msg);
                expect(msg).to.be.string
            })
        })
    });
    describe("Testing conversational elements of LoadIssueIntent", function () {
        var speechResponse = null;
        var speechError = null;

        before(function (done) {
            index.handler(events.LoadIssueIntent, ctx2)
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
        describe("Testing LOAD_ISSUE Random segments", function () {
            it("should include at least 5 different phrase options", () => {
                expect(index.MoveIssueMsg.length).to.be.gte(5)
            })
            it("should randomly include segments from the LOAD_ISSUE array", () => {
                var msg = speechResponse.response.outputSpeech.ssml;
                resultArr.push(msg);
                var numPhrasesUsed = utils.calcNumPhrasesIncluded(resultArr, index.loadIssueMsg);
                expect(numPhrasesUsed).to.be.gte(1)
            })
        })
    });
});