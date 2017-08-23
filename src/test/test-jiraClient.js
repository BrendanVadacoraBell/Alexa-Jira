'use strict'
const expect = require('chai').expect;
const assert = require('chai').assert;
const jira = require('../jiraClient')
var fs = require('fs')
var sampleIssueResponse = JSON.parse(fs.readFileSync('./test/sampleIssueResponse.json', 'utf-8'));

describe("Test Jira Client", () => {
    describe("Test Error Cases", function () {
        describe("Testing errors thrown when issue is not found", function () {
            before(function (done) {
                jira.setCurrentResponse(sampleIssueResponse);
                done();
            })
            it('should have an error with cause and code FIELDNOTFOUND for getIssueField', function () {
                expect(jira.getIssueField).to.throw().that.deep.equals({ cause: { code: 'FIELDNOTFOUND' } });

            })
        })
        describe("Testing errors thrown when there is no staged issue", function () {
            before(function (done) {
                jira.setCurrentResponse(null);
                done();
            })
            it('should have an error with cause and code CISSUENOTFOUND for getIssueField', function () {
                expect(jira.getIssueField).to.throw().that.deep.equals({ cause: { code: 'CISSUENOTFOUND' } });

            })
            it('should have an error with cause and code CISSUENOTFOUND for moveIssue', function () {
                expect(jira.moveIssue).to.throw().that.deep.equals({ cause: { code: 'CISSUENOTFOUND' } });
            })
        })
    });
    describe("Test getIssueField with different field properties", () => {
        before(function (done) {
            jira.setCurrentResponse(sampleIssueResponse);
            done();
        })
        it('should return the description as description is a key value pair where the value is a string', () => {
            expect(jira.getIssueField('description')).to.equal('This should be the description returned by NodeJS jira-client');
        })
        it('should return the displayName of reporter as reporter is an object with displayName', () => {
            expect(jira.getIssueField('reporter')).to.equal('Cool display name');
        })
        it('should return the name of priority as priority is an object only with name', () => {
            expect(jira.getIssueField('priority')).to.equal('Low');
        })
    });
});