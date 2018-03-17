var jira = require('./jiraConnect').jira;

jira.prototype.servicedeskInfo = function(test) {
  console.log("called from prototype");
  var options = {
    uri: this.host + this.servicedeskUrl + '/info1',
    method: 'GET'
  };

  this.doRequest(options, function(error, response, body) {
    console.log('body', response.statusCode);
  });
};
