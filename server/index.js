const express = require('express'); // Server Entry Point
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

        // Allow localhost, custom domain, and any Vercel deployment
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            console.log('Blocked by CORS:', origin); // Log for debugging
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
                scriptSrc: ["'self'", "'unsafe-inline'", "https://apis.google.com", "https://www.gstatic.com"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https://images.unsplash.com", "https://*.googleusercontent.com"],
                connectSrc: ["'self'", "https://identitytoolkit.googleapis.com", "https://securetoken.googleapis.com", "https://*.firebaseio.com", "https://*.firebase.com"],
                frameSrc: ["'self'", "https://*.firebaseapp.com", "https://*.google.com"],
            },
        },
    })
);
app.use(compression());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spendwise';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        console.log('Retrying connection in 5 seconds...');
        setTimeout(connectDB, 5000);
    }
};

connectDB();

const { initScheduler } = require('./services/scheduler');
initScheduler();

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const accountRoutes = require('./routes/accounts');
const subscriptionRoutes = require('./routes/subscriptions');
const loanRoutes = require('./routes/loans');
const budgetRoutes = require('./routes/budgets');
const cronRoutes = require('./routes/cron');
const notificationRoutes = require('./routes/notifications');
const supportRoutes = require('./routes/support');
const smartRoutes = require('./routes/smart');

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/cron', cronRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/smart', smartRoutes);

app.get('/api/health', (req, res) => {
    const dbState = mongoose.connection.readyState;
    const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

    // Check Firebase
    const firebaseStatus = (admin.apps && admin.apps.length > 0) ? 'initialized' : 'missing_config';

    res.json({
        status: dbState === 1 ? 'UP' : 'DOWN',
        timestamp: new Date(),
        services: {
            database: states[dbState] || 'unknown',
            firebase: firebaseStatus,
            node_env: process.env.NODE_ENV
        }
    });
});

app.use('/api/support', require('./routes/support'));


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
} else {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
