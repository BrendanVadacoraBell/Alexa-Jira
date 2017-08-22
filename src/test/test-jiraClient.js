'use strict'
const expect = require('chai').expect;
const assert = require('chai').assert;
const jira = require('../jiraClient')

describe("Test Error Cases for Jira Client", function () {
    describe("Testing errors thrown when there is no staged issue", function () {
        before(function(done){
            jira.setCurrentResponse(null);
            done();
        })
        it('should have an error with cause and code CISSUENOTFOUND for getIssueDescription', function () {
            expect(jira.getIssueDescription).to.throw().that.deep.equals({cause: {code : 'CISSUENOTFOUND'}});
            
        })
        it('should have an error with cause and code CISSUENOTFOUND for moveIssue', function () {
            expect(jira.moveIssue).to.throw().that.deep.equals({cause: {code : 'CISSUENOTFOUND'}});
        })
    })
});