# NPM Package For JIRA (Service Desk) REST API

A node.js module, which provides an object oriented wrapper for the JIRA REST API.

This library is built to support version `3.9.1` of the JIRA Service Desk API.

JIRA Service Desk API documentation can be found [here](https://docs.atlassian.com/jira-servicedesk/REST/3.9.1/)

[Service Desk Public REST API](https://developer.atlassian.com/cloud/jira/service-desk/rest/)

## Installation

Install with the node package manager [npm](http://npmjs.org):

```shell
$ npm install build-jira
```

## How To Use?

### Create the JIRA client

```javascript
const jiraApi = require('build-jira').jira;

const jira = new jiraApi({
  host: <your-jira-host>,
  username: <jira-user>,
  password: <jira-user-password>
});
```

### Get Service Desk Information

```javascript
/* For servicedeskInfo input is not required, hence first parameter is null in this call. */

jira.serviceDeskInfo(null, (error, body) => {
  console.log('RESPONSE: ', error, body);
});
```

### Get All Service Desks

```javascript
/* If start and limit is not passed, then default values 0 and 10 will get applied respectively */

jira.getAllServiceDesks({ start: 0, limit: 10 }, (error, body) => {
  console.log('RESPONSE: ', error, body);
});
```

### Get Service Desk By Id

```javascript
jira.getServiceDeskById(<service-desk-id>, (error, body) => {
  console.log('RESPONSE: ', error, body);
});
```

### Create New Ticket In Service Desk

```javascript
let input = {
  serviceDeskId: <service-desk-id>,
  requestTypeId: <request-queue-id>,
  summary: <your-ticket-title>,
  description: <explanation-about-ticket>
};

jira.createServiceDeskTicket(input, (error, body) => {
  console.log('RESPONSE:', error, body);
});
```

### Get Customer Requests(Tickets)

```javascript
/* start and limit are used for pagination */

/*
  NOTE: HERE input IS NOT MANDATORY
  IF YOU PASS IT THEN IT WILL RETURN DATA ACCORDINGLY
  ELSE IT WILL RETURN DEFAULT DATA
*/

let input = {
  start: <start-index>,
  limit: <number-of-records-to-return>,
  requestOwnership: <ticket-ownership-type>,
  requestStatus: <request-ticket-status>,
  searchString: <string-to-get-matching-records>,
  serviceDeskId: <servicedeskid-to-get-records>
};

jira.getAllRequestsOfCustomer(input, (error, body) => {
  console.log('RESPONSE:', error, body);
});
```

## Options

jiraApi options: <!-- * `protocol<string>`: Typically 'http:' or 'https:' -->

- `host<string>`: The hostname for your jira server
- `user<string>`: The username to log in with
- `password<string>`: Keep it secret, keep it safe

## Implemented APIs

- Service Desk

  - Infomation
  - Get All Service Desks
  - Get Service Desk By Id
  - Create New Ticket In Service Desk

## Changelog

- _1.0.3 createServiceDeskTicket function added_
- _1.0.2 serviceDeskInfo parameter corrected_
- _1.0.1 READEME file added_
- _1.0.0 Initial version_
