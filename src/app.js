const path = require('path');
const cookieParser = require('cookie-parser');
const sanitize = require('sanitize');
const minifyHTML = require("express-minify-html")
const express = require('express');
const { QueryTypes, } = require('sequelize');
const cons = require('consolidate');

const config = require('./config');
const db = require('./database');

const app = express();

// assign the pug engine to .html files
app.engine('html', cons.pug);

// set .html as the default extension
app.set('view engine', 'html');
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
    res.header('Access-Control-Allow-Origin', config.appURL);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, Content-Type, Authorization, x-id, Content-Length, X-Requested-With');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

const router = express.Router();
router.get('/test', async (req, res) => {
    let author = 'Jane Doe';
    const [results, metadata] = await db.query(
        "SELECT * FROM books where author=? ORDER BY uid ASC LIMIT 1", 
        {
            replacements: [ author, ],
            type: QueryTypes.SELECT,
        },
    );
    const [results2, metadata2] = await db.query(
        "SELECT * FROM books where author=:author ORDER BY uid DESC LIMIT 1", 
        {
            replacements: { author, },
            type: QueryTypes.SELECT,
        },
    );

    return res.render('home.pug', {
        title: 'Homepage',
        data: [
            results, 
            results2, 
        ],
    });
});
app.use('/api/v1', router);

app.all('*', (req, res) => {
    res.status(200).sendFile(`/`, {root: buildPath});
});

if (config.nodeEnv === 'production') {
    app.listen(config.appPort);
} else {
    app.listen(config.appPort, () => {
        const url = `http://127.0.0.1:${config.appPort}`;
        console.log(`Listening on ${url}`);
        if (['testing', 'development'].includes(config.nodeEnv)) {
            return;
        }
        const open = require('open');
        open(url);
    });
}
