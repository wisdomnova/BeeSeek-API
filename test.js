// test.js
const path = require('path');
const fs = require('fs');

// Load .env or .env.local
if (fs.existsSync(path.join(__dirname, '.env'))) {
    require('dotenv').config({ path: '.env' });
} else if (fs.existsSync(path.join(__dirname, '.env.local'))) {
    require('dotenv').config({ path: '.env.local' });
}

const { sendVerificationEmail } = require('./nodemailer');

async function testEmail() {
    console.log('🧪 Testing Resend Email...\n');
    
    const result = await sendVerificationEmail(
        'wisdomdivine3d@gmail.com',
        '123456',
        'Test User'
    );
    
    console.log('\nResult:', result);
}

testEmail();