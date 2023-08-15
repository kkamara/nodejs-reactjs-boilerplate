const path = require('path');
const cookieParser = require('cookie-parser');
const sanitize = require('sanitize');
const minifyHTML = require("express-minify-html")
const express = require('express');
const { QueryTypes, } = require('sequelize');
const fs = require('fs');
const morgan = require('morgan');

const config = require('./config');
const db = require('./models/index');

const app = express();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, '..', 'logs', 'nodejs_react_boilerplate.log'), 
    { flags: 'a' },
);
app.use(morgan(
    'combined', 
    { stream: accessLogStream },
));

app.set('view engine', 'pug');
app.set('views', path.join(
    __dirname,
    './views',
));

/** serving react with static path */
const buildPath = path.join(
    __dirname,
    '../',
    'frontend',
    'build'
);
app.use(express.static(buildPath));
app.use(express.static("public"));

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

app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(sanitize.middleware);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', config.appURL+':'+config.appPort);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, x-id, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

const router = express.Router();
router.get('/test', async (req, res) => {
    let email = 'doesntexist@example.com';
    let [results, metadata] = await db.sequelize.query(
        "SELECT id, firstName, lastName, email FROM Users where email != ?", 
        {
            replacements: [ email, ],
            type: QueryTypes.SELECT,
        },
    );
    if (!Array.isArray(results)) {
        results = [results];
    }
    return res.render('home.pug', {
        title: 'Homepage',
        data: results,
    });
});
app.use('/api/v1', router);

app.all('*', (req, res) => {
    res.status(200).sendFile(`/`, {root: buildPath});
});

app.use((err, req, res, next) => {
    res.status(500).json({
        message: 'Something went wrong, please contact administrator.',
    });
});

if (config.nodeEnv === 'production') {
    app.listen(config.appPort);
} else {
    app.listen(config.appPort, () => {
        const url = `http://127.0.0.1:${config.appPort}`;
        console.log(`Listening on ${url}`);
    });
}
