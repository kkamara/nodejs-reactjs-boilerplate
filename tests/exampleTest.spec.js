'use strict';
const assert = require('assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('../src/config');

chai.use(chaiHttp);

const app = `http://localhost:${config.appPort}`;

describe('API Tests', () => {
  it('Tests /api/v1/auth', () => {
    // {"data":{"routeName":"Login","user":{"page":{"title":"Login","loginEmails":["admin@mail.com","clientadmin@mail.com","clientuser@mail.com"]},"auth":null}}}
    chai.request(app)
      .get('/api/v1/auth')
      .end((err, res) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('data');
    });
  });
});
