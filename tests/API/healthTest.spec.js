'use strict';
const assert = require('node:assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('../../src/config');

chai.use(chaiHttp);

const app = `http://localhost:${config.appPort}`;

describe('API Tests', function() {
  it('Tests /api/health', function(done) {
    chai.request(app)
      .get('/api/health')
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('message');
        chai.expect(res.body.message).to.equal("Success");
        done();
      });
  });
});
