const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('../src/config');

chai.use(chaiHttp);

const app = `http://localhost:${config.appPort}`;

describe('API Tests', () => {
  it('Tests /api/v1/test', () => {
    chai.request(app)
      .get('/api/v1/test')
      .end((err, res) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
    });
  })

  it('Tests /', () => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
    });
  })
})
