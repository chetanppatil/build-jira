const jira = require('./jiraConnect').jira;

jira.prototype.servicedeskInfo = function(input, callback) {
  let _this = this;
  let options = {
    uri: this.host + this.servicedeskUrl + '/info',
    method: 'GET',
    json: true
  };

  this.doRequest(options, false, function(error, response, body) {
    _this.handleResponse(error, response, body, callback);
  });
};

jira.prototype.getAllServicedesks = function(input, callback) {
  let _this = this,
    start = (input && input.start) ? input.start : 0,
    limit = (input && input.limit) ? input.limit : 10;
  let options = {
    uri: this.host + this.servicedeskUrl + '/servicedesk',
    method: 'GET',
    qs: {
      start: start,
      limit: limit
    },
    json: true
  };

  this.doRequest(options, true, function(error, response, body) {
    _this.handleResponse(error, response, body, callback);
  });
};
