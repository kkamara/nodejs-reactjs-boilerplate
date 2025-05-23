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

describe('Authenticate User API Tests', () => {
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
  it('Tests Authenticate User Success', done => {
    chai.request(app)
      .get('/user/authorize')
      .set("authorization", bearerToken)
      .end((err, res) => {
        if (err) {
          console.log(err);
        }
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('user');
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
