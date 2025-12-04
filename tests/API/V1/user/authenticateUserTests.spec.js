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

describe('Authenticate User API Tests', function() {
  before(async function() {
    const createdAccount = await db.sequelize.models
      .user
      .testCreateUser(payload);
    if (false === createdAccount) {
      throw new Error("Error encountered when creating account.");
    }
    createdAccountID = createdAccount.userID;
    
    const createdUserToken = await db.sequelize.models
      .userToken
      .createAuthToken(createdAccountID);
    if (false === createdUserToken) {
      throw new Error("Error encountered when creating auth token.");
    }
    authTokenID = createdUserToken.authTokenID;
    
    const userToken = await db.sequelize.models
      .userToken
      .getAuthToken(authTokenID);
    if (false === userToken) {
      throw new Error("Error encountered when getting auth token.");
    }
    bearerToken = "Bearer "+userToken.token;
  });
  it('Tests Authenticate User Success', function(done) {
    chai.request(app)
      .get('/user/authorise')
      .set("authorization", bearerToken)
      .end((err, res) => {
        if (err) {
          console.log(err);
          return done();
        }
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        chai.expect(res.body).to.have.property('user');
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
