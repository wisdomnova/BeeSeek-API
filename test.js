// test.js
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