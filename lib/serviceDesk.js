const jira = require('./jiraConnect').jira
const fs = require('fs')

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
    throw new Error('Service desk id is missing.')
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

/* GET CUSTOMER REQUEST BY ID */
jira.prototype.getCustomerRequestById = function (issueId, callback) {
  let _this = this
  if (!issueId) {
    throw new Error('Issue id is missing.')
  }
  issueId = typeof issueId === 'string' ? issueId.toUpperCase() : issueId

  let options = {
    uri: this.host + this.serviceDeskUrl + '/request/' + issueId,
    method: 'GET',
    json: true
  }

  this.doRequest(options, true, (error, response, body) => {
    _this.handleResponse(error, response, body, callback)
  })
}

/* CREATE TEMPORARY ATTACHMENT IN SERVICE DESK REQUEST */
jira.prototype.createTempAttachment = function (input, callback) {
  let _this = this
  if (!input) {
    throw new Error('Invalid request.')
  }
  if (!input.serviceDeskId) {
    throw new Error('serviceDeskId is missing.')
  }
  if (!input.files) {
    throw new Error('files are missing.')
  }
  if (input.files && !Array.isArray(input.files)) {
    throw new Error('Invalid files.')
  }

  let files = []
  input.files.forEach(function (file) {
    files.push(fs.createReadStream(file))
  })

  let options = {
    uri: this.host + this.serviceDeskUrl + '/servicedesk/' + input.serviceDeskId + '/attachTemporaryFile',
    method: 'POST',
    headers:
    {
      'X-ExperimentalApi': 'opt-in',
      'X-Atlassian-Token': 'no-check'
    },
    formData: { file: files },
    json: true
  }

  this.doRequest(options, true, (error, response, body) => {
    _this.handleResponse(error, response, body, callback)
  })
}

/* CREATE ATTACHMENT IN SERVICE DESK */
jira.prototype.createCustomerAttachment = function (input, callback) {
  let _this = this
  if (!input) {
    throw new Error('Invalid request.')
  }
  if (!input.serviceDeskId) {
    throw new Error('serviceDeskId is missing.')
  }
  if (!input.files) {
    throw new Error('files are missing.')
  }
  if (input.files && !Array.isArray(input.files)) {
    throw new Error('Invalid files.')
  }
  if (!input.issueId) {
    throw new Error('Issue id is missing.')
  }
  if (input.comment && typeof input.comment !== 'string') {
    throw new Error('Invalid comment.')
  }
  input.issueId = typeof input.issueId === 'string' ? input.issueId.toUpperCase() : input.issueId

  this.createTempAttachment(input, (error, body) => {
    if (error) {
      callback(error)
    } else {
      let options = {
        uri: this.host + this.serviceDeskUrl + '/request/' + input.issueId + '/attachment',
        method: 'POST',
        headers: { 'X-ExperimentalApi': 'opt-in' },
        body: {
          temporaryAttachmentIds: body.temporaryAttachments.map(x => x.temporaryAttachmentId),
          public: true,
          additionalComment: { 'body': input.comment }
        },
        json: true
      }

      this.doRequest(options, true, (error, response, body) => {
        _this.handleResponse(error, response, body, callback)
      })
    }
  })
}

/* ADD COMMENT ON CUSTOMER REQUEST IN SERVICE DESK */
jira.prototype.addCommentOnCustomerRequest = function (input, callback) {
  let _this = this
  if (!input) {
    throw new Error('Invalid request.')
  }
  if (!input.issueId) {
    throw new Error('issueId is missing.')
  }
  if (!input.comment) {
    throw new Error('Provide some valid comment.')
  }
  input.issueId = typeof input.issueId === 'string' ? input.issueId.toUpperCase() : input.issueId

  let options = {
    uri: this.host + this.serviceDeskUrl + '/request/' + input.issueId + '/comment',
    method: 'POST',
    body: {
      body: input.comment,
      public: true
    },
    json: true
  }

  this.doRequest(options, true, (error, response, body) => {
    _this.handleResponse(error, response, body, callback)
  })
}

/* GET COMMENTS ON CUSTOMER REQUEST IN SERVICE DESK */
jira.prototype.getCommentsOnCustomerRequest = function (input, callback) {
  let _this = this
  if (!input) {
    throw new Error('Invalid request.')
  }
  if (!input.issueId) {
    throw new Error('issueId is missing.')
  }
  input.issueId = typeof input.issueId === 'string' ? input.issueId.toUpperCase() : input.issueId

  let qs = {
    start: (input && input.start) ? input.start : 0,
    limit: (input && input.limit) ? input.limit : 10
  }

  let options = {
    uri: this.host + this.serviceDeskUrl + '/request/' + input.issueId + '/comment',
    method: 'GET',
    qs: qs,
    json: true
  }

  this.doRequest(options, true, (error, response, body) => {
    _this.handleResponse(error, response, body, callback)
  })
}

/* GET STATUS OF CUSTOMER REQUEST IN SERVICE DESK */
jira.prototype.getCustomerRequestStatus = function (input, callback) {
  let _this = this
  if (!input) {
    throw new Error('Invalid request.')
  }
  if (!input.issueId) {
    throw new Error('issueId is missing.')
  }
  input.issueId = typeof input.issueId === 'string' ? input.issueId.toUpperCase() : input.issueId

  let qs = {
    start: (input && input.start) ? input.start : 0,
    limit: (input && input.limit) ? input.limit : 10
  }

  let options = {
    uri: this.host + this.serviceDeskUrl + '/request/' + input.issueId + '/status',
    method: 'GET',
    qs: qs,
    json: true
  }

  this.doRequest(options, true, (error, response, body) => {
    _this.handleResponse(error, response, body, callback)
  })
}
