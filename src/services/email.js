"use strict";
const nodemailer = require("nodemailer");
const config = require("../config/index");

/**
 * @param {Object} obj
 * @param {string} obj.subject
 * @param {string} obj.plainText
 * @param {string} obj.html
 * @returns {boolean}
 */
exports.testSendEmail = async ({
  subject,
  plainText,
  html,
  to,
}) => {
  const transporter = nodemailer.createTransport({
    host: "mailhog", // Docker app
    port: config.forwardingMailhogPort || 1025,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.mailUser,
      pass: config.mailPass,
    },
  });
  try {
    await transporter.sendMail({
      from: config.mailFrom,
      to: to || config.mailTo,
      subject: subject || "Hello ✔",
      text: plainText || `Hello world\n\n${config.appName} 2026.`, // plain‑text body
      html: html || `
        <html>
          <head>
            <style>
              h1 {
                color: red;
              }
            </style>
          </head>
          <body>
            <h1>Hello world</h1>
            <br/>
            <footer>
              ${config.appName} &copy; 2026.
            </footer>
          </body>
        </html>
      `
    });

    return true;
  } catch (err) {
    if ("production" !== config.nodeEnv) {
      console.log(err);
    }
    return false;
  }
};