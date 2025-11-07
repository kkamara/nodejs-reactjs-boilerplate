'use strict';
const db = require("../../../../models/V1");
const { status, } = require('http-status');
const { integerNumberRegex, } = require("../../../../utils/regexes");
const { message500, } = require("../../../../utils/httpResponses");
const asyncHandler = require("express-async-handler");

const getUsers = asyncHandler(async (req, res) => {
  const page = req.query.page;
  if (page && null === `${page}`.match(integerNumberRegex)) {
    res.status(status.BAD_REQUEST);
    throw new Error(
      "The page query parameter, if provided, must be type integer.",
    );
  }

  const users = await db.sequelize.models.user.getUsersPaginated(
    page || 1,
  );
  if (false === users) {
    res.status(status.INTERNAL_SERVER_ERROR)
    throw new Error(message500);
  }

  return res.json(users);
});

module.exports = { getUsers, };