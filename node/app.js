const express = require('express');
const images = require('./routes/images');
const comments = require('./routes/comments');
const like = require('./routes/like');
const favorite = require('./routes/favorite');
const auth = require('./routes/auth');
const history = require('connect-history-api-fallback');
const path = require('path');

const app = express();
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const cors = require('cors');
app.use(cors({origin:true,credentials: true}));

function setupCORS(req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With, Content-type,Accept,X-Access-Token,X-Key');
    res.header("Access-Control-Allow-Credentials", true);
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
}

app.all('/*', setupCORS)
const staticMiddleware = express.static(path.join(__dirname, 'dist'));
app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use('/images', express.static('images'));
const options = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'reactImagesDB'
};

app.use('/api/images', images);
app.use('/api/likes', like)
app.use('/api/favorites', favorite);
app.use('/api/comments', comments)
app.use('/auth', auth);
app.use(staticMiddleware);
app.use(history());
app.use(staticMiddleware);
app.listen(8080);