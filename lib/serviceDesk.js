var jira = require('./jiraConnect').jira;

jira.prototype.servicedeskInfo = function(input, callback) {
  var options = {
    uri: this.host + this.servicedeskUrl + '/info',
    method: 'GET'
  };

  this.request(options, function(error, response, body) {
    if (error) {
      callback(error, null);
      return;
    }
    if (response.statusCode === 404) {
      callback('404 not found!');
      return;
    }
    if (response.statusCode !== 200) {
      callback(response.statusCode + ': Unable to connect to JIRA.');
      return;
    }
    if (body === undefined) {
      callback('Response body was undefined.');
      return;
    }
    callback(null, JSON.parse(body));

  });
};
