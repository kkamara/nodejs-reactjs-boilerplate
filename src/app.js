'use strict';
const path = require('node:path');
const cookieParser = require('cookie-parser');
const sanitize = require('sanitize');
const express = require('express');
const config = require('./config');
const routes = require('./routes');
const { notFound, jsonError, } = require('./middlewares/V1/errorMiddleware');
const { session } = require('./middlewares/V1/sessionMiddleware');
const { minifyHTML } = require('./middlewares/V1/minifyHTMLMiddleware');
const { requestLog } = require('./middlewares/V1/loggingMiddleware');
const { limiter } = require('./middlewares/V1/throttleMiddleware');
const { cors } = require('./middlewares/V1/corsMiddleware');

const app = express();

// For request logs when deployed on remote servers.
// If we don't do this, the logs show the remote address as "127.0.0.1".
if ("production" === config.nodeEnv) {
  app.enable("trust proxy");
}

app.use(limiter);
app.use(requestLog);

app.set('view engine', 'pug');
app.set('views', path.join(
  __dirname,
  'views',
));

app.use(express.static("public"));
app.use('/static', express.static("frontend/build/static"));
app.get('/*', express.static('frontend/build'));

if ('production' === config.nodeEnv) {
  app.use(minifyHTML);
}

app.use(session);
app.use(cookieParser(config.appKey));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(sanitize.middleware);
app.use(cors);

app.use('/', routes);

// Serve ReactJS app routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
});

app.use(notFound);
app.use(jsonError);

if ('production' === config.nodeEnv) {
  app.listen(config.appPort);
} else {
  app.listen(config.appPort, () => {
    const url = `http://127.0.0.1:${config.appPort}`;
    console.log(`Listening on ${url}`);
  });
}
