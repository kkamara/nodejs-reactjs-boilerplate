const express = require("express");
const db = require("../../../../../models/v1");
const { status, } = require("http-status");
const { message400, message500, } = require("../../../../../utils/httpResponses");

const router = express.Router();

router.post("/register", async (req, res) => {
  const inputError = db.sequelize.models
    .user
    .getRegisterError(req.body);
  if (false !== inputError) {
    res.status(status.BAD_REQUEST);
    return res.json({ error: inputError, });
  }
  
  const cleanData = db.sequelize.models
    .user
    .getCreateUserData({
      firstName: req.bodyString("firstName"),
      lastName: req.bodyString("lastName"),
      email: req.bodyString("email"),
      password: req.bodyString("password"),
    });
  if (false === cleanData) {
    res.status(status.BAD_REQUEST);
    return res.json({ error: message400, });
  }
  
  const emailExists = await db.sequelize.models
    .user
    .emailExists(
      cleanData.email,
    );
  if (true === emailExists) {
    res.status(status.INTERNAL_SERVER_ERROR);
    return res.json({ error: "The email field has already been taken.", });
  }
  
  const userInsert = await db.sequelize.models
    .user
    .createUser(
      cleanData,
    );
  if (false === userInsert) {
    res.status(status.INTERNAL_SERVER_ERROR);
    return res.json({ error: message500, });
  }

  const newUser = await db.sequelize.models.user.getUser(
    userInsert.userId,
  );
  if (false === newUser) {
    res.status(status.INTERNAL_SERVER_ERROR);
    return res.json({ error: message500, });
  }

  res.status(status.OK);
  return res.json({
    success: true,
    user: db.sequelize.models.user
      .getFormattedUserData(newUser),
  });
});

module.exports = router;