const express = require("express");
const db = require("../../../../../models/v1");
const { status, } = require("http-status");

const router = express.Router();

router.post("/register", async (req, res) => {
  const inputError = db.sequelize.models
    .user
    .getRegisterError(req.body);
  if (false !== inputError) {
    res.status(status.BAD_REQUEST);
    return res.json({ error: inputError, });
  }

  return res.json({ success: true, });
});

module.exports = router;