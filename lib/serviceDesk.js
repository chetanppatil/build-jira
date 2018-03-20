const jira = require('./jiraConnect').jira;

/* GET SERVICE DESK INFORMATION */
jira.prototype.serviceDeskInfo = function(input, callback) {
  let _this = this;
  let options = {
    uri: this.host + this.serviceDeskUrl + '/info',
    method: 'GET',
    json: true
  };

  this.doRequest(options, false, function(error, response, body) {
    _this.handleResponse(error, response, body, callback);
  });
};

/* GET ALL AVAIALABLE SERVICE DESKS */
jira.prototype.serviceDesks = function(input, callback) {
  let _this = this,
    start = (input && input.start) ? input.start : 0,
    limit = (input && input.limit) ? input.limit : 10;
  let options = {
    uri: this.host + this.serviceDeskUrl + '/servicedesk',
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

/* GET SERVICE DESK BY ID */
jira.prototype.serviceDeskById = function(serviceDeskId, callback) {
  let _this = this;
  if (!serviceDeskId) {
    throw new Error('Service desk is missing.');
  }

  let options = {
    uri: this.host + this.serviceDeskUrl + '/servicedesk/' + serviceDeskId,
    method: 'GET',
    json: true
  };

  this.doRequest(options, true, function(error, response, body) {
    _this.handleResponse(error, response, body, callback);
  });
};

/* CREATE TICKET/REQUEST IN SERVICE DESK */
jira.prototype.createServiceDeskTicket = function(input, callback) {
  let _this = this;
  if (!input) {
    throw new Error('Invalid request.');
  }
  if (!input.serviceDeskId) {
    throw new Error('serviceDeskId is missing.');
  }
  if (!input.requestTypeId) {
    throw new Error('requestTypeId (queue id) is missing.');
  }
  if (!input.summary) {
    throw new Error('Please add summary for request.');
  }
  if (!input.description) {
    throw new Error('Please add description for request.');
  }

  let options = {
    uri: this.host + this.serviceDeskUrl + '/request',
    method: 'POST',
    body: {
      serviceDeskId: input.serviceDeskId,
      requestTypeId: input.requestTypeId,
      requestFieldValues: {
        summary: input.summary,
        description: input.description
      },
      requestParticipants: input.participants
    },
    json: true
  };

  this.doRequest(options, true, function(error, response, body) {
    _this.handleResponse(error, response, body, callback);
  });
};
