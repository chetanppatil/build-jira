const request = require('request')

function jira (config) {
  if (typeof config !== 'object') {
    throw new Error('Invalid config passed.')
  }
  if (config && !config.host) {
    throw new Error('Missing JIRA host')
  }
  if (config && !config.username) {
    throw new Error('Missing JIRA username')
  }
  if (config && !config.password) {
    throw new Error('Missing JIRA user password')
  }
  this.host = config.host
  this.username = config.username
  this.password = config.password
  this.serviceDeskUrl = '/rest/servicedeskapi'

  /* ERROR MESSAGES */
  this.unauthorized = 'Unauthorized Access!'
  this.notFound = 'Not Found!'
  this.forbidden = 'Forbidden'
  this.jiraConnectError = 'Unable to connect to JIRA, Internal server error.'

  this.doRequest = function (options, isAuthRequired, callback) {
    // request(options, callback);
    if (isAuthRequired) {
      options.auth = {
        username: this.username,
        password: this.password
      }
    }
    request(options, callback)
  }

  this.handleResponse = function (error, response, body, callback) {
    // console.log('body', body)
    let err
    if (error) {
      callback(error, null)
      return
    }
    switch (response.statusCode) {
      case 401:
        err = response.statusCode + ': ' + this.unauthorized
        break
      case 403:
        err = response.statusCode + ': ' + this.forbidden
        break
      case 404:
        err = response.statusCode + ': ' + this.notFound
        break
      case 500:
        err = response.statusCode + ': ' + this.jiraConnectError
        break
    }

    if (body === undefined) {
      err = 'Response body was undefined.'
    }
    !err ? callback(null, body) : callback(err)
  }
}

module.exports.jira = jira
