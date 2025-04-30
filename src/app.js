'use strict';
const path = require('node:path');
const cookieParser = require('cookie-parser');
const sanitize = require('sanitize');
const minifyHTML = require("express-minify-html");
const express = require('express');
const session = require('express-session');
const fs = require('node:fs');
const morgan = require('morgan');
const moment = require("moment-timezone");

const config = require('./config');
const routes = require('./routes');
const { messageDefaultSystemError, } = require('./utils/httpResponses');
const { status, } = require('http-status');

const app = express();

// For request logs when deployed on remote servers.
// If we don't do this, the logs show the remote address as "127.0.0.1".
if ("production" === config.nodeEnv) {
  app.enable("trust proxy");
}

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '..', 'logs', 'nodejs_reactjs_boilerplate.log'), 
  { flags: 'a' },
);
morgan.token('date', (req, res, tz) => {
  return moment().tz(tz).format('YYYY-MM-DD HH:mm:ss');
});
morgan.format(
  'boilerplate-request-log-format',
  `:remote-addr - :remote-user [:date[${config.appTimezone}]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"`,
);
app.use(morgan(
  'boilerplate-request-log-format',  
  { stream: accessLogStream, },
));

app.set('view engine', 'pug');
app.set('views', path.join(
  __dirname,
  'views',
));

app.use(express.static("public"));
app.use('/static', express.static("frontend/build/static"));
app.get('/*', express.static('frontend/build'));

if (config.nodeEnv === 'production') {
  app.use(
    minifyHTML({
      override: true,
      exception_url: false,
      htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true,
      },
    })
  );
}

app.use(session({
  secret: config.appKey,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: "production" === config.nodeEnv,
  },
}));
app.use(cookieParser(config.appKey));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// The following jsonErrorHandler goes after express.json() middleware. Otherwise, it doesn't run.
const jsonErrorHandler = (err, req, res, next) => {
  if ("production" !== config.nodeEnv) {
    console.log(err);
  }
  return res.status(err.status || status.INTERNAL_SERVER_ERROR)
    .send({
      message: messageDefaultSystemError,
    });
};
app.use(jsonErrorHandler);

app.use(sanitize.middleware);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', config.appURL+':'+config.appPort);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, x-id, Content-Length, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  next();
});

app.use('/', routes);

if (config.nodeEnv === 'production') {
  app.listen(config.appPort);
} else {
  app.listen(config.appPort, () => {
    const url = `http://127.0.0.1:${config.appPort}`;
    console.log(`Listening on ${url}`);
    if (['test', 'development'].includes(config.nodeEnv)) {
        return;
    }
    const open = require('open');
    open(url);
  });
}
