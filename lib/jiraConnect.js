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

  this.doRequest = function(options, callback) {
    request(options, callback);
  };
}

module.exports.jira = jira;
