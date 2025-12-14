require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./models/User');

const API_URL = 'http://localhost:5000/api';

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expenseswise');
        console.log('Connected to DB');

        const email = 'migration@test.com';
        await User.deleteOne({ email });

        // Signup to get token
        console.log('1. Signing up...');
        await axios.post(`${API_URL}/auth/signup-init`, { name: 'Migration Test', email });
        const user = await User.findOne({ email });
        const verifyRes = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp: user.otp });
        const token = verifyRes.data.token;
        console.log('   Token received');

        // Sync Data
        console.log('2. Syncing Guest Data...');
        const guestExpenses = [
            { amount: 50, category: 'food', note: 'Guest Burger', date: new Date() },
            { amount: 200, category: 'travel', note: 'Guest Taxi', date: new Date() }
        ];

        const syncRes = await axios.post(`${API_URL}/expenses/sync`, { expenses: guestExpenses }, {
            headers: { 'x-auth-token': token }
        });
        console.log('   Sync response:', syncRes.data);

        // Verify
        console.log('3. Fetching Expenses...');
        const fetchRes = await axios.get(`${API_URL}/expenses`, { headers: { 'x-auth-token': token } });

        const found = fetchRes.data.filter(e => e.note.startsWith('Guest'));
        console.log(`   Found ${found.length} synced expenses.`);

        if (found.length === 2) {
            console.log('SUCCESS: Migration endpoint works!');
        } else {
            console.error('FAILURE: Data mismatch');
        }

    } catch (e) {
        console.error('ERROR:', e.response?.data || e.message);
    } finally {
        await mongoose.disconnect();
    }
}
run();
