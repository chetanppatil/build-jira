const jira = require('./jiraConnect').jira

/* GET SERVICE DESK INFORMATION */
jira.prototype.serviceDeskInfo = function (input, callback) {
  let _this = this
  let options = {
    uri: this.host + this.serviceDeskUrl + '/info',
    method: 'GET',
    json: true
  }

  this.doRequest(options, false, (error, response, body) => {
    _this.handleResponse(error, response, body, callback)
  })
}

/* GET ALL AVAIALABLE SERVICE DESKS */
jira.prototype.getAllServiceDesks = function (input, callback) {
  let _this = this
  let start = (input && input.start) ? input.start : 0
  let limit = (input && input.limit) ? input.limit : 10
  let options = {
    uri: this.host + this.serviceDeskUrl + '/servicedesk',
    method: 'GET',
    qs: {
      start: start,
      limit: limit
    },
    json: true
  }

  this.doRequest(options, true, (error, response, body) => {
    _this.handleResponse(error, response, body, callback)
  })
}

/* GET SERVICE DESK BY ID */
jira.prototype.getServiceDeskById = function (serviceDeskId, callback) {
  let _this = this
  if (!serviceDeskId) {
    throw new Error('Service desk is missing.')
  }

  let options = {
    uri: this.host + this.serviceDeskUrl + '/servicedesk/' + serviceDeskId,
    method: 'GET',
    json: true
  }

  this.doRequest(options, true, (error, response, body) => {
    _this.handleResponse(error, response, body, callback)
  })
}

/* CREATE TICKET/REQUEST IN SERVICE DESK */
jira.prototype.createServiceDeskTicket = function (input, callback) {
  let _this = this
  if (!input) {
    throw new Error('Invalid request.')
  }
  if (!input.serviceDeskId) {
    throw new Error('serviceDeskId is missing.')
  }
  if (!input.requestTypeId) {
    throw new Error('requestTypeId (queue id) is missing.')
  }
  if (!input.summary) {
    throw new Error('Please add summary for request.')
  }
  if (!input.description) {
    throw new Error('Please add description for request.')
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
  }

  this.doRequest(options, true, (error, response, body) => {
    _this.handleResponse(error, response, body, callback)
  })
}

/* GET CUSTOMER'S ALL REQUESTS/TICKETS */
jira.prototype.getAllRequestsOfCustomer = function (input, callback) {
  let _this = this
  let qs = {
    start: (input && input.start) ? input.start : 0,
    limit: (input && input.limit) ? input.limit : 10
  }
  if (input && input.requestOwnership) qs.requestOwnership = input.requestOwnership
  if (input && input.searchString) qs.searchTerm = input.searchString
  if (input && input.serviceDeskId) qs.serviceDeskId = input.serviceDeskId
  if (input && input.requestStatus) qs.requestStatus = input.requestStatus

  let options = {
    uri: this.host + this.serviceDeskUrl + '/request',
    method: 'GET',
    qs: qs,
    json: true
  }

  this.doRequest(options, true, (error, response, body) => {
    _this.handleResponse(error, response, body, callback)
  })
}
