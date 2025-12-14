const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spendwise';

console.log('Testing connection to:', MONGO_URI);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected Successfully!');
        process.exit(0);
    })
    .catch(err => {
        console.error('MongoDB Connection Failed:', err.message);
        process.exit(1);
    });
