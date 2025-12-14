const axios = require('axios');

async function testLogin() {
    try {
        const res = await axios.post('http://localhost:5000/api/auth/init', {
            name: 'Guest',
            status: 'student',
            currency: 'INR',
            budget: 0
        });
        console.log('Success:', res.data);
    } catch (err) {
        console.error('Error Status:', err.response?.status);
        console.error('Error Data:', err.response?.data);
        console.error('Error Message:', err.message);
    }
}

testLogin();
