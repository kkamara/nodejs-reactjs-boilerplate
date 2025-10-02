'use strict';
const express = require('express');
const { status, } = require("http-status");
const { testSendEmail, } = require("../../../services/email");
const { message500, } = require('../../../utils/httpResponses');
const config = require("../../../config/index");

const router = express.Router();

router.get('/', async (req, res) => {
  const sendEmail = await testSendEmail({
    subject: "Test Email ✔",
    plainText: `This is a test email.\n\n${config.appName} 2026.`,
    html: `
      <style>
        .lead {
          font-size: 18px;
          color: red;
        }
      </style>
      <div class="lead">
        This is a test email.
      </div>
      <br/>
      <footer>
        ${config.appName} &copy; 2026.
      </footer>
    `,
  });
  if (false === sendEmail) {
    res.status(message500);
    return res.json({
      error: "Error encountered when attempting to send email.",
    });
  }

  res.status(status.OK);
  return res.json({
    message: "Message Sent.",
  });
});

module.exports = router;