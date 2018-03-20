# NPN Package For JIRA REST API

A node.js module, which provides an object oriented wrapper for the JIRA REST API.

This library is built to support version `3.9.1` of the JIRA Service Desk API.

JIRA Service Desk API documentation can be found [here](https://docs.atlassian.com/jira-servicedesk/REST/3.9.1/)

## Installation

Install with the node package manager [npm](http://npmjs.org):

```
$ npm install build-jira
```

## How To Use?

### Create the JIRA client

```
jiraApi = require('build-jira').jira;

var jira = new jiraApi({
  host: <your-jira-host>,
  username: <jira-user>,
  password: <jira-user-password>
});
```

### Get Service Desk Information

```
jira.servicedeskInfo('test', function(error, body){
  console.log('RESPONSE: ', error, body);
});
```

## Options

jiraApi options: <!-- * `protocol<string>`: Typically 'http:' or 'https:' -->

- `host<string>`: The hostname for your jira server
- `user<string>`: The username to log in with
- `password<string>`: Keep it secret, keep it safe
- `Jira API Version<string>`: Known to work with `2` and `2.0.alpha1`
- `verbose<bool>`: Log some info to the console, usually for debugging
- `strictSSL<bool>`: Set to false if you have self-signed certs or something non-trustworthy
- `oauth`: A dictionary of `consumer_key`, `consumer_secret`, `access_token` and `access_token_secret` to be used for OAuth authentication.
- `base<string>`: A base slug if your JIRA instance is not at the root of `host`

## Implemented APIs

- Service Desk

  - Infomation

## Changelog

- _1.0.0 Initial version_
