require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const User = require('./models/User');

const API_URL = 'http://localhost:5000/api';

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/expenseswise');
        console.log('Connected to DB');

        const email = 'backend@verify.com';
        await User.deleteOne({ email });
        console.log('Cleaned up user');

        console.log('1. Signing up...');
        try {
            await axios.post(`${API_URL}/auth/signup-init`, {
                name: 'Backend Verify',
                email,
                status: 'student',
                currency: 'USD'
            });
        } catch (e) {
            // It might succeed, or fail if email sending fails but user is created
            console.log('Signup Init Output:', e.response?.data || e.message);
        }

        const user = await User.findOne({ email });
        if (!user) throw new Error('User not created in DB');
        const otp = user.otp;
        console.log(`2. Got OTP: ${otp}`);

        console.log('3. Verifying...');
        const verifyRes = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
        const token = verifyRes.data.token;
        if (!token) throw new Error('No token returned');
        console.log('   Token received');

        console.log('4. Adding Expense...');
        await axios.post(`${API_URL}/expenses`, {
            amount: 100,
            category: 'food',
            note: 'BackendSyncTest',
            date: new Date()
        }, { headers: { 'x-auth-token': token } });

        console.log('5. Fetching Expenses...');
        const fetchRes = await axios.get(`${API_URL}/expenses`, { headers: { 'x-auth-token': token } });

        console.log('   Expenses count:', fetchRes.data.length);
        const saved = fetchRes.data.find(e => e.note === 'BackendSyncTest');

        if (saved) {
            console.log('SUCCESS: Expense persisted and retrieved!');
        } else {
            console.error('FAILURE: Expense not found in list');
            console.log('List:', fetchRes.data.map(e => e.note));
        }

    } catch (e) {
        console.error('ERROR:', e.response?.data || e.message);
    } finally {
        await mongoose.disconnect();
    }
}
run();
