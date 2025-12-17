const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const helmet = require('helmet');
const compression = require('compression');

const app = express();


const allowedOrigins = [
    'http://localhost:5173',           // Local development (Vite)
    'http://localhost:3000',           // Alternative local port
    'https://spendwise.satyajitmishra.me',  // Production domain
];


if (process.env.ALLOWED_ORIGINS) {
    const additionalOrigins = process.env.ALLOWED_ORIGINS.split(',');
    allowedOrigins.push(...additionalOrigins);
}

const corsOptions = {
    origin: function (origin, callback) {

        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
                connectSrc: ["'self'"],
            },
        },
    })
);
app.use(compression());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spendwise';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const { initScheduler } = require('./services/scheduler');
initScheduler();



app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/loans', require('./routes/loans'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/cron', require('./routes/cron'));


const path = require('path');
const distPath = path.join(__dirname, '../client/dist');


app.use(express.static(distPath, {
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));


app.get(/^\/(?!api).*/, (req, res, next) => {

    if (path.extname(req.path)) {
        return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
