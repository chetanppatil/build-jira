let chai = require('chai')
let expect = chai.expect
const JiraApi = require('../index.js').jira

describe('JIRA CONNECT TEST:', () => {
  it('Should throw error ("Invalid config passed.") if no config is passed to function', (done) => {
    expect(JiraApi).to.throw('Invalid config passed.')
    done()
  })

  it('Should throw error ("Missing JIRA host") if no host is passed to function', (done) => {
    let config = { test: 't' }
    expect(function () { new JiraApi(config) }).to.throw('Missing JIRA host')
    done()
  })

  it('Should throw error ("Missing JIRA username") if no username is passed to function', (done) => {
    let config = { host: 'https://<your-host>' }
    expect(function () { new JiraApi(config) }).to.throw('Missing JIRA username')
    done()
  })

  it('Should throw error ("Missing JIRA username") if no username is passed to function', (done) => {
    let config = { host: 'https://<your-host>', username: '<your-jira-username>' }
    expect(function () { new JiraApi(config) }).to.throw('Missing JIRA user passwords')
    done()
  })
})
