let chai = require('chai')
let expect = chai.expect
const JiraApi = require('../index.js').jira

describe('JIRA SERVICE DESK FUNCTIONS TEST:', () => {
  const jira = new JiraApi({
    host: <your-jira-host>,
    username: <jira-user>,
    password: <jira-user-password>
  })

  describe('SERVICE DESK INFO:', () => {
    it('Should return version, platformVersion, _links for valid request', (done) => {
      jira.serviceDeskInfo(null, (error, body) => {
        expect(error).to.equal(null)
        expect(body).to.have.property('version')
        expect(body).to.have.property('platformVersion')
        expect(body).to.have.property('_links')
        done()
      })
    })
  })

  describe('GET ALL SERVICE DESKS INFO:', () => {
    it('Should return start, limit, _links for valid request', (done) => {
      jira.getAllServiceDesks(null, (error, body) => {
        expect(error).to.equal(null)
        expect(body).to.have.property('start')
        expect(body).to.have.property('limit')
        expect(body).to.have.property('_links')
        done()
      })
    })
    it('Should return base, next, self inside _links', (done) => {
      jira.getAllServiceDesks(null, (error, body) => {
        expect(error).to.equal(null)
        expect(body).to.have.property('_links')
        expect(body._links).to.have.property('base')
        expect(body._links).to.have.property('next')
        expect(body._links).to.have.property('self')
        done()
      })
    })
    it('Should return values array containing service desks details (can be empty)', (done) => {
      jira.getAllServiceDesks(null, (error, body) => {
        expect(error).to.equal(null)
        expect(body).to.have.property('values')
        done()
      })
    })
  })

  describe('GET SERVICE DESK BY ID:', () => {
    it('Should throw error ("Service desk id is missing.") if no serviceDeskId is passed', (done) => {
      expect(jira.getServiceDeskById).to.throw('Service desk id is missing.')
      done()
    })
    it('Should return error ("403: Forbidden") if user doesn\'t have access to specified service desk', (done) => {
      jira.getServiceDeskById(222, (error, body) => {
        expect(error).to.not.equal(null)
        expect(error).to.equal('404: Not Found!')
        done()
      })
    })
    it('Should return error ("404: Not Found!") if no such service desk exists', (done) => {
      jira.getServiceDeskById(222, (error, body) => {
        expect(error).to.not.equal(null)
        expect(error).to.equal('404: Not Found!')
        done()
      })
    })
    it('Should return id, projectId, projectName, projectKey, _links for valid serviceDeskId', (done) => {
      jira.getServiceDeskById(22, (error, body) => {
        expect(error).to.equal(null)
        expect(body).to.have.property('id')
        expect(body).to.have.property('projectId')
        expect(body).to.have.property('projectName')
        expect(body).to.have.property('projectKey')
        expect(body).to.have.property('_links')
        done()
      })
    })
  })

  describe('CREATE SERVICE DESK TICKET:', () => {
    it('Should throw error ("Invalid request.") if no config is passed', (done) => {
      expect(jira.createServiceDeskTicket).to.throw('Invalid request.')
      done()
    })
    it('Should throw error ("serviceDeskId is missing.") if no serviceDeskId is passed to function', (done) => {
      let input = {}
      expect(function () { jira.createServiceDeskTicket(input) }).to.throw('serviceDeskId is missing.')
      done()
    })
    it('Should throw error ("requestTypeId (queue id) is missing.") if queue id is not passed to function', (done) => {
      let input = { serviceDeskId: 1 }
      expect(function () { jira.createServiceDeskTicket(input) }).to.throw('requestTypeId (queue id) is missing.')
      done()
    })
    it('Should throw error ("Please add summary for request.") if summary is not passed to function', (done) => {
      let input = { serviceDeskId: 1, requestTypeId: 1 }
      expect(function () { jira.createServiceDeskTicket(input) }).to.throw('Please add summary for request.')
      done()
    })
    it('Should throw error ("Please add description for request.") if description is not passed to function', (done) => {
      let input = { serviceDeskId: 1, requestTypeId: 1, summary: 'Test Case Running' }
      expect(function () { jira.createServiceDeskTicket(input) }).to.throw('Please add description for request.')
      done()
    })
  })
})
