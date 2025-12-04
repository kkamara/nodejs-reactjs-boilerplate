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

let createdAccountID = null;

const firstName = "Test";
const lastName = "Account "+generateToken(faker.number.int({ min: 3, max: 6, }));
const payload = {
  firstName,
  lastName,
  email: faker.internet.email({ firstName, lastName, }),
  dob: "2004-01-01",
  password: "secret",
  passwordConfirmation: "secret",
  isAdmin: false,
};

describe('Login User API Tests', function() {
  before(async function() {
    const createdAccount = await db.sequelize.models
      .user
      .testCreateUser(payload);
    if (false === createdAccount) {
      throw new Error("Error encountered when creating account.");
    }
    createdAccountID = createdAccount.userID;
  });
  it('Tests Login User Success', function(done) {
    chai.request(app)
      .post('/user')
      .send({
        email: payload.email,
        password: payload.password,
      })
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done();
        }
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('data');
        chai.expect(res.body.data).to.have.property('user');
        chai.expect(res.body.data.user).to.have.property('id');
        chai.expect(res.body.data.user.id).to.equal(createdAccountID);
        done();
      });
  });
  after(async function() {
    await db.sequelize.models
      .userToken
      .testDeleteAllUsersAuthTokens(createdAccountID);
    await db.sequelize.models
      .user
      .testDeleteUser(createdAccountID);
  });
});
