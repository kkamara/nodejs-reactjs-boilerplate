'use strict';
const assert = require('node:assert');
const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('../../../../src/config');
const db = require("../../../../src/models/v1");

chai.use(chaiHttp);

const app = `http://localhost:${config.appPort}/api/v1`;

let createdAccountID = null;
let bearerToken = null;
let authTokenID = null;

const payload = {
  email: "testaccount@example.com",
  firstName: "Test",
  lastName: "Account",
  dob: "2004-01-01",
  password: "secret",
  passwordConfirmation: "secret",
  isAdmin: false,
};

describe('Logout User API Tests', () => {
  before(async () => {
    const createdAccount = await db.sequelize.models
      .user
      .testCreateUser(payload, true);
    createdAccountID = createdAccount.userId;
    
    const createdUserToken = await db.sequelize.models
      .userToken
      .createAuthToken(createdAccountID);
    authTokenID = createdUserToken.authTokenId;
    
    const userToken = await db.sequelize.models
      .userToken
      .getAuthToken(authTokenID);
    bearerToken = "Bearer "+userToken.token;
  });
  it('Tests Logout User Success', done => {
    chai.request(app)
      .delete('/user')
      .set("authorization", bearerToken)
      .end(async (err, res) => {
        if (err) {
          console.log(err);
        }
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('success');
        chai.expect(res.body.success).to.equal(true);

        const authenticated = await db.sequelize.models
          .userToken
          .authenticate(
            bearerToken,
          );
        chai.expect(authenticated).to.equal(false);

        done();
      });
  });
  after(async () => {
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
