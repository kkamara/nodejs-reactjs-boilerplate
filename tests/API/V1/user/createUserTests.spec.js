'use strict';
const assert = require('node:assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('../../../../src/config');
const db = require("../../../../src/models/V1");
const { faker, } = require("@faker-js/faker");
const { generateToken, } = require("../../../../src/utils/tokens");

chai.use(chaiHttp);

const app = `http://localhost:${config.appPort}/api/v1`;

describe('Create User API Tests', function() {
  it('Tests Register User Success', function(done) {
    const firstName = "Test";
    const lastName = "Account "+generateToken(faker.number.int({ min: 3, max: 6, }));
    const payload = {
      firstName,
      lastName,
      email: faker.internet.email({ firstName, lastName, }),
      password: "secret",
      passwordConfirmation: "secret",
    };
    chai.request(app)
      .post('/user/register')
      .send(payload)
      .end(async (err, res) => {
        if (err) {
          console.log(err);
          return done();
        }
        console.log("create body -", res.body);
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('user');
        chai.expect(res.body.user).to.have.property('id');
        await db.sequelize.models
          .user
          .testDeleteUser(res.body.user.id);
        done();
      });
  });
});
