// nodemailer.js
const nodemailer = require('nodemailer');

// Create transporter with Hostinger SMTP
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT) || 587, // Changed to 587 for STARTTLS
    secure: false, // false for port 587, use STARTTLS
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false // Accept self-signed certificates
    }
});

const fromEmail = process.env.EMAIL_USER || 'no-reply@beeseek.site';

// Function to send verification email
const sendVerificationEmail = async (to, verificationCode, userName = '') => {
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`, 
            to: to,
            subject: 'Verify Your BeeSeek Account',
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Verify Your Account</h2>
                    
                    ${userName ? `<p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${userName},</p>` : ''}
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 24px 0;">
                        Use the code below to verify your email address:
                    </p>
                    
                    <div style="background-color: #f1f5f9; padding: 24px; text-align: center; margin: 0 0 24px 0; border-radius: 8px;">
                        <div style="font-size: 32px; font-weight: 900; color: #0f172a; letter-spacing: 8px;">${verificationCode}</div>
                    </div>
                    
                    <p style="color: #64748b; font-size: 14px; font-weight: 400; margin: 0 0 8px 0;">
                        This code expires in 10 minutes.
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        If you didn't request this, please ignore this email.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        // Nodemailer success
        console.log("Email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }
};

// Function to send password reset email
const sendPasswordResetEmail = async (to, resetCode, userName = '') => {
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: 'Reset Your Password',
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Reset Your Password</h2>
                    
                    ${userName ? `<p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${userName},</p>` : ''}
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 24px 0;">
                        Use the code below to reset your password:
                    </p>
                    
                    <div style="background-color: #fef2f2; padding: 24px; text-align: center; margin: 0 0 24px 0; border-radius: 8px;">
                        <div style="font-size: 32px; font-weight: 900; color: #991b1b; letter-spacing: 8px;">${resetCode}</div>
                    </div>
                    
                    <p style="color: #64748b; font-size: 14px; font-weight: 400; margin: 0 0 8px 0;">
                        This code expires in 15 minutes.
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        If you didn't request this, please ignore this email.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        // Nodemailer success
        console.log("Email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

// Function to send welcome email
const sendWelcomeEmail = async (to, userName) => {
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: 'Welcome to BeeSeek',
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Welcome to BeeSeek</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${userName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 24px 0;">
                        Your account has been successfully verified. You can now access all features.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        // Nodemailer success
        console.log("Email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        throw new Error('Failed to send welcome email');
    }
};

// Function to send notification email
const sendNotificationEmail = async (to, subject, message, userName = '') => {
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: subject,
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">${subject}</h2>
                    
                    ${userName ? `<p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${userName},</p>` : ''}
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 24px 0;">
                        ${message}
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        // Nodemailer success
        console.log("Email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending notification email:', error);
        throw new Error('Failed to send notification email');
    }
};

// Function to send agent magic link
const sendAgentMagicLink = async (to, agentId, agentName = '') => {
    try {
        const verificationToken = Buffer.from(`${agentId}-${Date.now()}`).toString('base64');
        const magicLink = `https://beeseek.site/verify-agent?token=${verificationToken}&agent_id=${agentId}`;

        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: 'Verify Your Agent Account',
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Verify Your Agent Account</h2>
                    
                    ${agentName ? `<p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${agentName},</p>` : ''}
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 24px 0;">
                        Click the button below to verify your email address and activate your agent account.
                    </p>
                    
                    <div style="text-align: center; margin: 0 0 24px 0;">
                        <a href="${magicLink}" style="display: inline-block; background-color: #549fe5; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 700;">
                            Verify Account
                        </a>
                    </div>
                    
                    <p style="color: #64748b; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0 0 16px 0;">
                        Or copy and paste this link into your browser:
                    </p>
                    
                    <p style="color: #549fe5; font-size: 13px; font-weight: 400; word-break: break-all; margin: 0 0 24px 0;">
                        ${magicLink}
                    </p>
                    
                    <p style="color: #64748b; font-size: 14px; font-weight: 400; margin: 0 0 8px 0;">
                        This link expires in 24 hours.
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        If you didn't create an agent account, please ignore this email.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        // Nodemailer success
        console.log("Email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending magic link email:', error);
        throw new Error('Failed to send magic link email');
    }
};

// Test email function
const testEmailConnection = async () => {
    try {
        if (!process.env.RESEND_API_KEY) {
            throw new Error('RESEND_API_KEY is not set');
        }

        console.log('✅ Resend API is configured');
        return { success: true, message: 'Resend API is ready' };
    } catch (error) {
        console.error('❌ Resend API check failed:', error);
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail,
    sendNotificationEmail,
    sendAgentMagicLink,
    testEmailConnection
};