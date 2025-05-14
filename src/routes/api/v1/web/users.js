'use strict';
const express = require('express');
const db = require("../../../../models/v1");
const { status, } = require('http-status');
const { integerNumberRegex, } = require("../../../../utils/regexes");
const { message500, } = require("../../../../utils/httpResponses");

const router = express.Router();

router.get("/", async (req, res) => {
  const page = req.query.page;
  if (page && null === `${page}`.match(integerNumberRegex)) {
    res.status(status.BAD_REQUEST);
    return res.json({
      error: "The page query parameter, if provided, must be type integer.",
    });
  }

  const users = await db.sequelize.models.user.getUsersPaginated(
    page || 1,
  );
  if (false === users) {
    res.status(status.INTERNAL_SERVER_ERROR)
    return res.json({
      error: message500,
    });
  }

  return res.json(users);
});

module.exports = router;