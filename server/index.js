const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spendwise';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

const { initScheduler } = require('./services/scheduler');
initScheduler();

app.get('/', (req, res) => res.send('API Running'));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/accounts', require('./routes/accounts'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/loans', require('./routes/loans'));
app.use('/api/budgets', require('./routes/budgets'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
