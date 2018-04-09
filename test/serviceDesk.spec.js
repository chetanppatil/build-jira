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

  describe('GET CUSTOMER REQUEST BY ID:', () => {
    it('Should throw error ("Issue id is missing.") if no issueId is passed', (done) => {
      expect(jira.getCustomerRequestById).to.throw('Issue id is missing.')
      done()
    })
    it('Should return error ("404: Not Found!") if no such issue exists', (done) => {
      jira.getCustomerRequestById(222, (error, body) => {
        expect(error).to.not.equal(null)
        expect(error).to.equal('404: Not Found!')
        done()
      })
    })
  })

  describe('CREATE TEMPORARY ATTACHMENT:', () => {
    it('Should throw error ("Invalid request.") if no config is passed', (done) => {
      expect(jira.createTempAttachment).to.throw('Invalid request.')
      done()
    })
    it('Should throw error ("serviceDeskId is missing.") if no serviceDeskId is passed to function', (done) => {
      let input = {}
      expect(function () { jira.createTempAttachment(input) }).to.throw('serviceDeskId is missing.')
      done()
    })
    it('Should throw error ("files are missing.") if files parameter is not passed to function', (done) => {
      let input = { serviceDeskId: 1 }
      expect(function () { jira.createTempAttachment(input) }).to.throw('files are missing.')
      done()
    })
    it('Should throw error ("Invalid files") if files parameter is not array to function', (done) => {
      let input = { serviceDeskId: 1, files: 'file' }
      expect(function () { jira.createTempAttachment(input) }).to.throw('Invalid files.')
      done()
    })
    it('Should return error if file not found passed in input', (done) => {
      let input = { serviceDeskId: 1, files: ['./file'] }
      jira.createTempAttachment(input, (error, body) => {
        expect(error).to.not.equal(null)
        expect(body).to.equal(null)
        done()
      })
    })
    it('Should return property temporaryAttachments if input is valid and file is uploaded', (done) => {
      let input = { serviceDeskId: 22, files: ['./.jshintrc'] }
      jira.createTempAttachment(input, (error, body) => {
        expect(error).to.equal(null)
        expect(body).to.be.an('object')
        expect(body).to.have.property('temporaryAttachments')
        expect(body.temporaryAttachments).to.be.an('array')
        expect(body.temporaryAttachments[0]).to.have.property('temporaryAttachmentId')
        expect(body.temporaryAttachments).to.have.lengthOf(input.files.length)
        done()
      })
    })
  })

  describe('CREATE CUSTOMER ATTACHMENT:', () => {
    it('Should throw error ("Invalid request.") if no config is passed', (done) => {
      expect(jira.createCustomerAttachment).to.throw('Invalid request.')
      done()
    })
    it('Should throw error ("serviceDeskId is missing.") if no serviceDeskId is passed to function', (done) => {
      let input = {}
      expect(function () { jira.createCustomerAttachment(input) }).to.throw('serviceDeskId is missing.')
      done()
    })
    it('Should throw error ("files are missing.") if files parameter is not passed to function', (done) => {
      let input = { serviceDeskId: 1 }
      expect(function () { jira.createCustomerAttachment(input) }).to.throw('files are missing.')
      done()
    })
    it('Should throw error ("Invalid files") if files parameter is not array to function', (done) => {
      let input = { serviceDeskId: 1, files: 'file' }
      expect(function () { jira.createCustomerAttachment(input) }).to.throw('Invalid files.')
      done()
    })
    it('Should throw error ("Issue id is missing.") if no issueId is passed', (done) => {
      let input = { serviceDeskId: 1, files: ['file'] }
      expect(function () { jira.createCustomerAttachment(input) }).to.throw('Issue id is missing.')
      done()
    })
    it('Should return error if file not found passed in input', (done) => {
      let input = { serviceDeskId: 1, issueId: 253, files: ['./file'] }
      jira.createCustomerAttachment(input, (error, body) => {
        expect(error).to.not.equal(null)
        expect(body).to.equal(undefined)
        done()
      })
    })
    it('Should return 404: Not Found! if no such issue exists', (done) => {
      let input = { serviceDeskId: 1, files: ['./.jshintrc'], issueId: 122 }
      jira.createCustomerAttachment(input, (error, body) => {
        expect(error).to.not.equal(null)
        expect(error).to.equal('404: Not Found!')
        done()
      })
    })
    it('Should return property attachments if input is valid and file is uploaded', (done) => {
      let input = { serviceDeskId: 22, files: ['./.jshintrc'], issueId: 'tes-35' }
      jira.createCustomerAttachment(input, (error, body) => {
        expect(error).to.equal(null)
        expect(body).to.be.an('object')
        expect(body).to.have.property('attachments')
        expect(body.attachments).to.be.an('array')
        expect(body.attachments[0]).to.have.property('filename')
        expect(body.attachments[0]).to.have.property('_links')
        expect(body.attachments).to.have.lengthOf(input.files.length)
        done()
      })
    })
  })

  describe('ADD COMMENT ON CUSTOMER REQUEST:', () => {
    it('Should throw error ("Invalid request.") if no config is passed', (done) => {
      expect(jira.addCommentOnCustomerRequest).to.throw('Invalid request.')
      done()
    })
    it('Should throw error ("issueId is missing.") if no issueId is passed to function', (done) => {
      let input = {}
      expect(function () { jira.addCommentOnCustomerRequest(input) }).to.throw('issueId is missing.')
      done()
    })
    it('Should throw error ("Provide some valid comment.") if no comment is passed to function', (done) => {
      let input = { issueId: 'TES-35' }
      expect(function () { jira.addCommentOnCustomerRequest(input) }).to.throw('Provide some valid comment.')
      done()
    })
    it('Should return 404: Not Found! if no such issue exists', (done) => {
      let input = { issueId: 122, comment: 'Test comment' }
      jira.addCommentOnCustomerRequest(input, (error, body) => {
        expect(error).to.not.equal(null)
        expect(error).to.equal('404: Not Found!')
        done()
      })
    })
    it('Should return id, created, body for valid request', (done) => {
      let input = { issueId: 'tes-35', comment: 'Test comment' }
      jira.addCommentOnCustomerRequest(input, (error, body) => {
        expect(error).to.equal(null)
        expect(body).to.be.an('object')
        expect(body).to.have.property('id')
        expect(body).to.have.property('body')
        expect(body).to.have.property('created')
        done()
      })
    })
  })

  describe('GET COMMENTS ON CUSTOMER REQUEST:', () => {
    it('Should throw error ("Invalid request.") if no config is passed', (done) => {
      expect(jira.getCommentsOnCustomerRequest).to.throw('Invalid request.')
      done()
    })
    it('Should throw error ("issueId is missing.") if no issueId is passed to function', (done) => {
      let input = {}
      expect(function () { jira.getCommentsOnCustomerRequest(input) }).to.throw('issueId is missing.')
      done()
    })
    it('Should return 404: Not Found! if no such issue exists', (done) => {
      let input = { issueId: 122 }
      jira.getCommentsOnCustomerRequest(input, (error, body) => {
        expect(error).to.not.equal(null)
        expect(error).to.equal('404: Not Found!')
        done()
      })
    })
    it('Should return values for valid issueId', (done) => {
      let input = { issueId: 'tes-35' }
      jira.getCommentsOnCustomerRequest(input, (error, body) => {
        expect(error).to.equal(null)
        expect(body).to.be.an('object')
        expect(body).to.have.property('values')
        expect(body.values).to.be.an('array')
        done()
      })
    })
  })

  describe('GET STATUS OF CUSTOMER REQUEST:', () => {
    it('Should throw error ("Invalid request.") if no config is passed', (done) => {
      expect(jira.getCustomerRequestStatus).to.throw('Invalid request.')
      done()
    })
    it('Should throw error ("issueId is missing.") if no issueId is passed to function', (done) => {
      let input = {}
      expect(function () { jira.getCustomerRequestStatus(input) }).to.throw('issueId is missing.')
      done()
    })
    it('Should return 404: Not Found! if no such issue exists', (done) => {
      let input = { issueId: 122 }
      jira.getCustomerRequestStatus(input, (error, body) => {
        expect(error).to.not.equal(null)
        expect(error).to.equal('404: Not Found!')
        done()
      })
    })
    it('Should return values for valid issueId', (done) => {
      let input = { issueId: 'tes-35' }
      jira.getCustomerRequestStatus(input, (error, body) => {
        expect(error).to.equal(null)
        expect(body).to.be.an('object')
        expect(body).to.have.property('values')
        expect(body.values).to.be.an('array')
        done()
      })
    })
  })
})
