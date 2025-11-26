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
let bearerToken = null;
let authTokenID = null;

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

describe('Logout User API Tests', function() {
  before(async function() {
    const createdAccount = await db.sequelize.models
      .user
      .testCreateUser(payload);
    if (false === createdAccount) {
      throw new Error("Error encountered when creating account.");
    }
    createdAccountID = createdAccount.userId;
    
    const createdUserToken = await db.sequelize.models
      .userToken
      .createAuthToken(createdAccountID);
    if (false === createdUserToken) {
      throw new Error("Error encountered when creating auth token.");
    }
    authTokenID = createdUserToken.authTokenId;
    
    const userToken = await db.sequelize.models
      .userToken
      .getAuthToken(authTokenID);
    if (false === userToken) {
      throw new Error("Error encountered when getting auth token.");
    }
    bearerToken = "Bearer "+userToken.token;
  });
  it('Tests Logout User Success', function(done) {
    chai.request(app)
      .delete('/user')
      .set("authorization", bearerToken)
      .end(async (err, res) => {
        if (err) {
          console.log(err);
          return done();
        }
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('message');
        chai.expect(res.body.message).to.equal("Success.");

        const authenticated = await db.sequelize.models
          .userToken
          .authenticate(
            bearerToken,
          );
        chai.expect(authenticated).to.equal(false);

        done();
      });
  });
  after(async function() {
    await db.sequelize.models
      .userToken
      .testDeleteUserToken(
        authTokenID,
      );
    await db.sequelize.models
      .user
      .testDeleteUser(createdAccountID);
  });
});
