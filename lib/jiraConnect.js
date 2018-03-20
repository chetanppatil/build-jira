const request = require('request');

function jira(config) {
  if (typeof config !== 'object') {
    throw new Error("Invalid config passed.");
  }
  if (config && !config.host) {
    throw new Error("Missing JIRA host");
  }
  if (config && !config.username) {
    throw new Error("Missing JIRA username");
  }
  if (config && !config.password) {
    throw new Error("Missing JIRA user password");
  }
  this.host = config.host;
  this.username = config.username;
  this.password = config.password;
  this.servicedeskUrl = '/rest/servicedeskapi';

  /* ERROR MESSAGES */
  this.unauthorized = 'Unauthorized Access!';
  this.notFound = 'Not Found!';
  this.forbidden = '403 Forbidden';
  this.jiraConnectError = 'Unable to connect to JIRA.';

  this.doRequest = function(options, isAuthRequired, callback) {
    // request(options, callback);
    if (isAuthRequired) {
      options.auth = {
        username: this.username,
        password: this.password
      };
    }
    request(options, callback);
  };

  this.handleResponse = function(error, response, body, callback) {
    // console.log('body', body);
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode === 401) {
      callback(response.statusCode + ': ' + this.unauthorized);
      return;
    }
    if (response.statusCode === 403) {
      callback(response.statusCode + ': ' + this.forbidden);
      return;
    }
    if (response.statusCode === 404) {
      callback(response.statusCode + ': ' + this.notFound);
      return;
    }
    if (response.statusCode !== 200) {
      callback(response.statusCode + ': ' + this.jiraConnectError);
      return;
    }

    if (body === undefined) {
      callback('Response body was undefined.');
      return;
    }
    callback(null, body);
  };
}

module.exports.jira = jira;
