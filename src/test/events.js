module.exports = {
  "LoadIssueIntent": {
    "session": {
      "sessionId": null,
      "application": {
        "applicationId": "mochatest"
      },
      "attributes": {},
      "user": {
        "userId": null
      },
      "new": true
    },
    "request": {
      "type": "IntentRequest",
      "requestId": null,
      "locale": "en-US",
      "timestamp": "2017-04-26T19:29:57Z",
      "intent": {
        "name": "LoadIssueIntent",
        "slots": {
          "PROJECT_KEY": {
            "name": "PROJECT_KEY",
            "value": "WUNJHB"
          },
          "ISSUE_NUMBER": {
            "name": "ISSUE_NUMBER",
            "value": "2"
          }
        }
      }
    },
    "version": "1.0"
  },
  "ReadIssueFieldIntent": {
    "session": {
      "sessionId": null,
      "application": {
        "applicationId": "mochatest"
      },
      "attributes": {},
      "user": {
        "userId": null
      },
      "new": true
    },
    "request": {
      "type": "IntentRequest",
      "requestId": null,
      "locale": "en-US",
      "timestamp": "2017-04-26T19:29:57Z",
      "intent": {
        "name": "ReadIssueFieldIntent",
        "slots": {
          "FIELD_KEY": {
            "name": "FIELD_KEY",
            "value": "description"
          }
        }
      }
    },
    "version": "1.0"
  },

  "MoveIssueIntent": {
    "session": {
      "sessionId": null,
      "application": {
        "applicationId": "mochatest"
      },
      "attributes": {},
      "user": {
        "userId": null
      },
      "new": true
    },
    "request": {
      "type": "IntentRequest",
      "requestId": null,
      "locale": "en-US",
      "timestamp": "2017-04-26T19:29:57Z",
      "intent": {
        "name": "MoveIssueIntent",
        "slots": {
          "TRANSITION_ID": {
            "name": "TRANSITION_ID",
            "value": "open"
          }
        }
      }
    },
    "version": "1.0"
  },

  "HelpIntent": {
    "session": {
      "sessionId": null,
      "application": {
        "applicationId": "mochatest"
      },
      "attributes": {},
      "user": {
        "userId": null
      },
      "new": true
    },
    "request": {
      "type": "IntentRequest",
      "requestId": null,
      "locale": "en-US",
      "timestamp": "2017-04-26T19:29:57Z",
      "intent": {
        "name": "AMAZON.HelpIntent",
        "slots": {}
      }
    },
    "version": "1.0"
  },
  
  "StopIntent": {
    "session": {
      "sessionId": null,
      "application": {
        "applicationId": "mochatest"
      },
      "attributes": {},
      "user": {
        "userId": null
      },
      "new": true
    },
    "request": {
      "type": "IntentRequest",
      "requestId": null,
      "locale": "en-US",
      "timestamp": "2017-04-26T19:29:57Z",
      "intent": {
        "name": "AMAZON.StopIntent",
        "slots": {}
      }
    },
    "version": "1.0"
  },

  "CancelIntent": {
    "session": {
      "sessionId": null,
      "application": {
        "applicationId": "mochatest"
      },
      "attributes": {},
      "user": {
        "userId": null
      },
      "new": true
    },
    "request": {
      "type": "IntentRequest",
      "requestId": null,
      "locale": "en-US",
      "timestamp": "2017-04-26T19:29:57Z",
      "intent": {
        "name": "AMAZON.CancelIntent",
        "slots": {}
      }
    },
    "version": "1.0"
  }
}