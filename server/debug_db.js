const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/spendwise';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        try {
            const users = await mongoose.connection.db.collection('users').find({}).toArray();
            console.log('Total Users:', users.length);
            console.log('Users with no email:', users.filter(u => !u.email).length);

            const indexes = await mongoose.connection.db.collection('users').indexes();
            console.log('Indexes:', JSON.stringify(indexes, null, 2));

        } catch (err) {
            console.error('Error:', err);
        } finally {
            mongoose.disconnect();
        }
    })
    .catch(err => console.error('Connection Error:', err));
