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

// Function to send auto-approval warning email (20 hours before)
const sendAutoApprovalWarningEmail = async (to, userName, activityType, activityTitle, hoursRemaining) => {
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: `Payment Release Reminder - ${activityTitle}`,
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Payment Release Reminder</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${userName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        Your ${activityType} <strong>"${activityTitle}"</strong> will be automatically approved in approximately <strong>${hoursRemaining} hours</strong>.
                    </p>
                    
                    <div style="background-color: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #92400e; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0;">
                            If you're satisfied with the work, you can approve it now. If there are any concerns, please contact support at support@beeseek.site before the auto-approval.
                        </p>
                    </div>
                    
                    <p style="color: #64748b; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0 0 8px 0;">
                        Payment will be automatically released to the agent if no action is taken.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("Warning email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending auto-approval warning email:', error);
        throw new Error('Failed to send auto-approval warning email');
    }
};

// Function to send auto-approval notification to user (after auto-approval)
const sendAutoApprovalUserEmail = async (to, userName, activityType, activityTitle, amount) => {
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: `Payment Released - ${activityTitle}`,
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Payment Automatically Released</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${userName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        Your ${activityType} <strong>"${activityTitle}"</strong> has been automatically approved after 24 hours.
                    </p>
                    
                    <div style="background-color: #dbeafe; padding: 20px; border-left: 4px solid #3b82f6; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #1e3a8a; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">
                            Payment Released: ₦${amount}
                        </p>
                        <p style="color: #1e40af; font-size: 13px; font-weight: 400; margin: 0;">
                            The payment has been released to your agent's wallet.
                        </p>
                    </div>
                    
                    <p style="color: #64748b; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0 0 16px 0;">
                        You can still rate the agent and provide feedback in the app.
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        If you have any concerns about this ${activityType}, please contact support at support@beeseek.site.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("User auto-approval email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending user auto-approval email:', error);
        throw new Error('Failed to send user auto-approval email');
    }
};

// Function to send auto-approval notification to agent (after auto-approval)
const sendAutoApprovalAgentEmail = async (to, agentName, activityType, activityTitle, amount) => {
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: `Payment Released - ${activityTitle}`,
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">🎉 Payment Released!</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${agentName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        Great news! Your ${activityType} <strong>"${activityTitle}"</strong> has been automatically approved.
                    </p>
                    
                    <div style="background-color: #d1fae5; padding: 20px; border-left: 4px solid #10b981; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #065f46; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">
                            Payment Added: ₦${amount}
                        </p>
                        <p style="color: #047857; font-size: 13px; font-weight: 400; margin: 0;">
                            The payment has been added to your wallet and is now available.
                        </p>
                    </div>
                    
                    <p style="color: #64748b; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0;">
                        Keep up the excellent work! You can view your wallet balance in the app.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("Agent auto-approval email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending agent auto-approval email:', error);
        throw new Error('Failed to send agent auto-approval email');
    }
};

// Function to send first booking celebration email (for clients and agents)
const sendFirstBookingCelebrationEmail = async (to, name, userType, activityType, bookingDate, bookingTime, serviceName, referenceNumber) => {
    // userType: 'client' or 'agent'
    // activityType: 'task' or 'inspection'
    
    const isClient = userType === 'client';
    const title = isClient ? 'Your First Booking!' : 'Your First Job!';
    const message = isClient 
        ? `Congratulations on booking your first ${activityType} with BeeSeek!`
        : `Congratulations on landing your first ${activityType} with BeeSeek!`;
    const details = isClient
        ? `This is an exciting milestone. Our verified agent will provide excellent service for your ${activityType}.`
        : `This is the start of your journey. Deliver excellent service to build your reputation and earn great reviews.`;

    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: title,
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <!-- Confetti effect using CSS - Gmail safe -->
                    <div style="position: relative; overflow: hidden; padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; margin: 0 0 24px 0;">
                        <!-- Static confetti decorations -->
                        <div style="position: absolute; top: 10px; left: 10%; width: 10px; height: 10px; background: #fbbf24; border-radius: 50%; opacity: 0.8;"></div>
                        <div style="position: absolute; top: 20px; right: 15%; width: 8px; height: 8px; background: #10b981; border-radius: 50%; opacity: 0.8;"></div>
                        <div style="position: absolute; top: 40px; left: 25%; width: 6px; height: 6px; background: #ef4444; border-radius: 50%; opacity: 0.8;"></div>
                        <div style="position: absolute; bottom: 30px; right: 20%; width: 10px; height: 10px; background: #3b82f6; border-radius: 50%; opacity: 0.8;"></div>
                        <div style="position: absolute; bottom: 15px; left: 30%; width: 8px; height: 8px; background: #ec4899; border-radius: 50%; opacity: 0.8;"></div>
                        <div style="position: absolute; top: 15px; right: 30%; width: 12px; height: 3px; background: #fbbf24; transform: rotate(45deg); opacity: 0.7;"></div>
                        <div style="position: absolute; bottom: 25px; left: 15%; width: 10px; height: 3px; background: #10b981; transform: rotate(-30deg); opacity: 0.7;"></div>
                        <div style="position: absolute; top: 35px; left: 40%; width: 8px; height: 3px; background: #3b82f6; transform: rotate(60deg); opacity: 0.7;"></div>
                        
                        <h2 style="color: white; font-size: 28px; font-weight: 700; margin: 0; text-align: center; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            🎉 ${title}
                        </h2>
                    </div>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${name},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        ${message}
                    </p>
                    
                    <div style="background-color: #dbeafe; padding: 20px; border-left: 4px solid #3b82f6; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #1e40af; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0;">
                            ${details}
                        </p>
                    </div>
                    
                    <div style="background-color: #f1f5f9; padding: 16px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e293b; font-size: 14px; font-weight: 700; margin: 0 0 12px 0;">
                            Booking Details:
                        </p>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600; color: #64748b; font-size: 13px;">Date:</td>
                                <td style="padding: 6px 0; color: #1e293b; font-size: 13px;">${bookingDate}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600; color: #64748b; font-size: 13px;">Time:</td>
                                <td style="padding: 6px 0; color: #1e293b; font-size: 13px;">${bookingTime}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600; color: #64748b; font-size: 13px;">Service:</td>
                                <td style="padding: 6px 0; color: #1e293b; font-size: 13px;">${serviceName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; font-weight: 600; color: #64748b; font-size: 13px;">Reference:</td>
                                <td style="padding: 6px 0; color: #1e293b; font-size: 13px;">${referenceNumber}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        ${isClient 
                            ? 'Track your booking progress in the app and feel free to reach out if you need assistance.'
                            : 'Check your app for full details. Deliver on time and maintain great communication with the client.'
                        }
                    </p>
                    
                    <div style="background-color: #f1f5f9; padding: 16px; margin: 0 0 24px 0; border-radius: 8px; text-align: center;">
                        <p style="color: #1e293b; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">
                            ${isClient ? 'Ready for More?' : 'Keep It Up!'}
                        </p>
                        <p style="color: #64748b; font-size: 13px; font-weight: 400; margin: 0;">
                            ${isClient 
                                ? 'Browse more services and book trusted agents anytime.'
                                : 'Build your reputation with quality work and earn more opportunities.'
                            }
                        </p>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        Questions? Contact support at support@beeseek.site.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("First booking celebration email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending first booking celebration email:', error);
        throw new Error('Failed to send first booking celebration email');
    } 
};

// Function to send agent late notification email
const sendAgentLateNotificationEmail = async (to, agentName, taskTitle, userContactInfo = '') => {
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`, 
            to: to,
            subject: `Action Required - Running Late for Task`,
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #dc2626; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">You're Running Late</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${agentName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        You're running late for your task <strong>"${taskTitle}"</strong>. The client is waiting.
                    </p>
                    
                    <div style="background-color: #fee2e2; padding: 20px; border-left: 4px solid #dc2626; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #7f1d1d; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">
                            Immediate Action Required
                        </p>
                        <p style="color: #991b1b; font-size: 13px; font-weight: 400; margin: 0;">
                            Please contact the client immediately to inform them of your delay and provide an updated arrival time.
                        </p>
                    </div>
                    
                    ${userContactInfo ? `
                    <div style="background-color: #f1f5f9; padding: 16px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e293b; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">Client Contact:</p>
                        <p style="color: #64748b; font-size: 13px; font-weight: 400; margin: 0;">
                            ${userContactInfo}
                        </p>
                    </div>
                    ` : ''}
                    
                    <p style="color: #64748b; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0 0 16px 0;">
                        Punctuality is essential for maintaining client trust and your professional reputation on BeeSeek.
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        For assistance, contact support at support@beeseek.site.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("Agent late notification email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending agent late notification email:', error);
        throw new Error('Failed to send agent late notification email');
    }
};

// Function to send task cancellation apology email to user
const sendTaskCancellationEmail = async (to, userName, taskTitle, cancellationReason = '') => {
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: `Task Cancelled - ${taskTitle}`,
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Task Cancelled</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${userName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        We're sorry to inform you that your task <strong>"${taskTitle}"</strong> has been cancelled${cancellationReason ? `: ${cancellationReason}` : '.'}.
                    </p>
                    
                    <div style="background-color: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #92400e; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0;">
                            We sincerely apologize for any inconvenience this may have caused. Any payment made has been refunded to your wallet.
                        </p>
                    </div>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        Your feedback helps us improve our service. Please take a moment to share your experience with us.
                    </p>
                    
                    <div style="text-align: center; margin: 0 0 24px 0;">
                        <a href="https://www.beeseek.site/feedbacks" style="display: inline-block; background-color: #549fe5; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-size: 16px; font-weight: 700;">
                            Share Feedback
                        </a>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        If you have any questions or concerns, please contact support at support@beeseek.site.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("Task cancellation email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending task cancellation email:', error);
        throw new Error('Failed to send task cancellation email');
    }
};

// Function to send task starting soon reminder (1 hour before)
const sendTaskStartingSoonEmail = async (to, userName, userType, activityType, activityTitle, startTime, address = '') => {
    // userType: 'client' or 'agent'
    // activityType: 'task' or 'inspection'
    
    const isAgent = userType === 'agent';
    const subject = isAgent ? `Reminder: ${activityType} starts in 1 hour` : `Your ${activityType} starts in 1 hour`;
    const heading = isAgent ? `${activityType} Starting Soon` : `Your ${activityType} Starts Soon`;
    const message = isAgent 
        ? `Your ${activityType} <strong>"${activityTitle}"</strong> is scheduled to start in approximately 1 hour.`
        : `Your ${activityType} <strong>"${activityTitle}"</strong> is scheduled to start in approximately 1 hour.`;
    const actionMessage = isAgent
        ? 'Please ensure you arrive on time and have all necessary tools and materials ready.'
        : 'Please be available at the scheduled location. The agent will arrive shortly.';
    
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: subject,
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #3b82f6; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">${heading}</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${userName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        ${message}
                    </p>
                    
                    <div style="background-color: #dbeafe; padding: 20px; border-left: 4px solid #3b82f6; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #1e40af; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">
                            Start Time: ${startTime}
                        </p>
                        ${address ? `
                        <p style="color: #1e40af; font-size: 13px; font-weight: 400; margin: 0;">
                            Location: ${address}
                        </p>
                        ` : ''}
                    </div>
                    
                    <div style="background-color: #f1f5f9; padding: 16px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #64748b; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0;">
                            ${actionMessage}
                        </p>
                    </div>
                    
                    ${isAgent ? `
                    <div style="background-color: #fef3c7; padding: 16px; border-left: 4px solid #f59e0b; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #92400e; font-size: 13px; font-weight: 400; margin: 0;">
                            <strong>Reminder:</strong> Punctuality is essential. If you're running late, please contact the client immediately.
                        </p>
                    </div>
                    ` : `
                    <p style="color: #64748b; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0 0 16px 0;">
                        If you need to reschedule or have any questions, please contact support at support@beeseek.site.
                    </p>
                    `}
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        Questions? Contact support at support@beeseek.site.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("Task starting soon email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending task starting soon email:', error);
        throw new Error('Failed to send task starting soon email');
    }
};

// Function to send booking confirmation receipt email
const sendBookingConfirmationEmail = async (to, userName, userType, bookingData) => {
    // userType: 'client' or 'agent'
    // bookingData: { activityType, activityTitle, bookingId, bookingDate, bookingTime, address, serviceFee, transportFee, platformFee, totalFee, agentName, clientName }
    
    const {
        activityType,
        activityTitle,
        bookingId,
        bookingDate,
        bookingTime,
        address,
        serviceFee,
        transportFee,
        platformFee,
        totalFee,
        agentName,
        clientName
    } = bookingData;

    const isAgent = userType === 'agent';
    const subject = `Booking Confirmed - ${activityTitle}`;
    const heading = 'Booking Confirmed';
    const message = isAgent 
        ? `You have a new ${activityType} booking from ${clientName}.`
        : `Your ${activityType} has been successfully booked with ${agentName}.`;
    
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: subject,
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #10b981; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">${heading}</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${userName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        ${message}
                    </p>
                    
                    <div style="background-color: #d1fae5; padding: 20px; border-left: 4px solid #10b981; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #065f46; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">
                            Booking Reference: ${bookingId}
                        </p>
                        <p style="color: #047857; font-size: 13px; font-weight: 400; margin: 0;">
                            ${isAgent ? 'Please review the details and prepare for the booking.' : 'Payment has been secured. The agent will contact you shortly.'}
                        </p>
                    </div>
                    
                    <div style="background-color: #f1f5f9; padding: 24px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0 0 16px 0;">Booking Details</p>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Service:</td>
                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">${activityTitle}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">${isAgent ? 'Client' : 'Agent'}:</td>
                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">${isAgent ? clientName : agentName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Date:</td>
                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">${bookingDate}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px;">Time:</td>
                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">${bookingTime}</td>
                            </tr>
                            ${address ? `
                            <tr>
                                <td style="padding: 8px 0; font-weight: 600; color: #64748b; font-size: 14px; vertical-align: top;">Location:</td>
                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${address}</td>
                            </tr>
                            ` : ''}
                        </table>
                    </div>
                    
                    <div style="background-color: #f8fafc; padding: 24px; margin: 0 0 24px 0; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <p style="color: #1e293b; font-size: 16px; font-weight: 700; margin: 0 0 16px 0;">Payment Summary</p>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">${activityType === 'inspection' ? 'Inspection Fee' : 'Service Fee'}:</td>
                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">₦${serviceFee}</td>
                            </tr>
                            ${transportFee ? `
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Transport Fee:</td>
                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">₦${transportFee}</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Platform Fee:</td>
                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; text-align: right;">₦${platformFee}</td>
                            </tr>
                            <tr style="border-top: 2px solid #e2e8f0;">
                                <td style="padding: 12px 0 0 0; color: #1e293b; font-size: 16px; font-weight: 700;">Total ${isAgent ? 'Earning' : 'Amount'}:</td>
                                <td style="padding: 12px 0 0 0; color: #10b981; font-size: 18px; font-weight: 700; text-align: right;">₦${totalFee}</td>
                            </tr>
                        </table>
                    </div>
                    
                    ${isAgent ? `
                    <div style="background-color: #dbeafe; padding: 16px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e40af; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">Next Steps:</p>
                        <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 13px; line-height: 22px;">
                            <li>Review the booking details carefully</li>
                            <li>Prepare all necessary tools and materials</li>
                            <li>Arrive on time at the scheduled location</li>
                            <li>Contact the client if you have any questions</li>
                        </ul>
                    </div>
                    ` : `
                    <div style="background-color: #dbeafe; padding: 16px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e40af; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0;">
                            Your payment is secured with BeeSeek. It will be released to the agent once you confirm the work is completed.
                        </p>
                    </div>
                    `}
                    
                    <p style="color: #64748b; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0 0 16px 0;">
                        ${isAgent 
                            ? 'You can view all booking details and contact the client through the BeeSeek app.' 
                            : 'Track your booking progress in the BeeSeek app. The agent will contact you if needed.'}
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        Questions? Contact support at support@beeseek.site.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("Booking confirmation email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending booking confirmation email:', error);
        throw new Error('Failed to send booking confirmation email');
    }
};

// Function to send home safety reminder email to agent
const sendHomeSafetyReminderEmail = async (to, agentName, activityType, activityTitle) => {
    // activityType: 'task' or 'inspection'
    
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: 'Did You Get Home Safe?',
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Are You Home Safe?</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${agentName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        We noticed you completed <strong>"${activityTitle}"</strong>. Your safety is important to us.
                    </p>
                    
                    <div style="background-color: #dbeafe; padding: 20px; border-left: 4px solid #3b82f6; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #1e40af; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0;">
                            Please confirm that you've arrived home safely by marking 'I'm Home Safe' in the app.
                        </p>
                    </div>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        This helps us ensure all our agents return home safely after completing their ${activityType}s.
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        If you need assistance, contact support at support@beeseek.site.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("Home safety reminder email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending home safety reminder email:', error);
        throw new Error('Failed to send home safety reminder email');
    }
};

// Function to send bee creation confirmation email to agent
const sendBeeCreationEmail = async (to, agentName, beeTitle, beeCategory) => {
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: 'Bee Created Successfully',
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Bee Created Successfully</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${agentName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        Your bee <strong>"${beeTitle}"</strong> has been successfully created and is now live on BeeSeek!
                    </p>
                    
                    <div style="background-color: #d1fae5; padding: 20px; border-left: 4px solid #10b981; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #065f46; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">
                            Your Bee is Live!
                        </p>
                        <p style="color: #047857; font-size: 13px; font-weight: 400; margin: 0;">
                            Clients can now discover and book your service. Make sure your profile is complete to attract more bookings.
                        </p>
                    </div>
                    
                    <div style="background-color: #dbeafe; padding: 16px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e40af; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">Tips to Get More Bookings:</p>
                        <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 13px; line-height: 22px;">
                            <li>Add clear photos of your previous work</li>
                            <li>Keep your availability updated</li>
                            <li>Respond quickly to booking requests</li>
                            <li>Deliver quality service to earn 5-star reviews</li>
                        </ul>
                    </div>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        You can manage your bee anytime in the app. Update pricing, availability, or service details as needed.
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        Questions? Contact support at support@beeseek.site.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("Bee creation email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending bee creation email:', error);
        throw new Error('Failed to send bee creation email');
    }
};

// Function to send agent welcome email with KYC prompt
const sendAgentWelcomeKYCEmail = async (to, agentName) => {
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: 'Welcome to BeeSeek - Verify Your Identity',
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Welcome to BeeSeek!</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${agentName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        Welcome to the BeeSeek agent community! We're excited to have you on board.
                    </p>
                    
                    <div style="background-color: #d1fae5; padding: 20px; border-left: 4px solid #10b981; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #065f46; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">
                            You're Almost Ready!
                        </p>
                        <p style="color: #047857; font-size: 13px; font-weight: 400; margin: 0;">
                            To start accepting bookings and earning, you need to complete your identity verification (KYC) in the app.
                        </p>
                    </div>
                    
                    <div style="background-color: #dbeafe; padding: 16px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e40af; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">Why Verify Your Identity?</p>
                        <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 13px; line-height: 22px;">
                            <li>Build trust with clients</li>
                            <li>Access all agent features</li>
                            <li>Start receiving bookings</li>
                            <li>Withdraw your earnings securely</li>
                        </ul>
                    </div>
                    
                    <div style="background-color: #f1f5f9; padding: 20px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e293b; font-size: 14px; font-weight: 700; margin: 0 0 12px 0;">What You'll Need:</p>
                        <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 13px; line-height: 22px;">
                            <li>Valid government-issued ID</li>
                            <li>Clear photo of yourself</li>
                        </ul>
                    </div>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        Open the BeeSeek app and complete your verification to unlock your full potential as an agent.
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        Need help? Contact support at support@beeseek.site.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("Agent welcome KYC email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending agent welcome KYC email:', error);
        throw new Error('Failed to send agent welcome KYC email');
    }
};

// Function to send bee takedown notification email to agent
const sendBeeTakedownEmail = async (to, agentName, beeTitle, takedownReason) => {
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: 'Bee Removed from Platform',
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #dc2626; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Bee Removed</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${agentName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        Your bee <strong>"${beeTitle}"</strong> has been removed from the BeeSeek platform by our team.
                    </p>
                    
                    <div style="background-color: #fee2e2; padding: 20px; border-left: 4px solid #dc2626; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #7f1d1d; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">Reason for Removal:</p>
                        <p style="color: #991b1b; font-size: 13px; font-weight: 400; margin: 0;">
                            ${takedownReason}
                        </p>
                    </div>
                    
                    <div style="background-color: #f1f5f9; padding: 20px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e293b; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">What This Means:</p>
                        <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 13px; line-height: 22px;">
                            <li>This bee is no longer visible to clients</li>
                            <li>You cannot receive bookings for this service</li>
                            <li>The bee has been removed from your profile</li>
                        </ul>
                    </div>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        Please review our service guidelines before creating new bees. If you believe this removal was made in error, contact our support team.
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        Contact support: support@beeseek.site
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("Bee takedown email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending bee takedown email:', error);
        throw new Error('Failed to send bee takedown email');
    }
};

// Function to send issue report acknowledgment email
const sendIssueReportEmail = async (to, userName, issueId, issueDescription) => {
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: 'Issue Report Received',
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Issue Report Received</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${userName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        Thank you for reporting an issue. We've received your report and our team is looking into it.
                    </p>
                    
                    <div style="background-color: #f1f5f9; padding: 20px; margin: 0 0 24px 0; border-radius: 8px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: 700; color: #64748b; width: 140px;">Report ID:</td>
                                <td style="padding: 8px 0; color: #1e293b;">${issueId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: 700; color: #64748b; vertical-align: top;">Issue:</td>
                                <td style="padding: 8px 0; color: #1e293b;">${issueDescription}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background-color: #dbeafe; padding: 20px; border-left: 4px solid #3b82f6; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #1e40af; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0;">
                            Our support team will review your report and get back to you within 24-48 hours. We appreciate your patience.
                        </p>
                    </div>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        You can track the status of your report in the app or reply to this email for additional information.
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        Need urgent assistance? Contact support at support@beeseek.site.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("Issue report email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending issue report email:', error);
        throw new Error('Failed to send issue report email');
    }
};

// Function to send account suspension notification email
const sendAccountSuspensionEmail = async (to, userName, userType, violationReason, suspensionDuration = '') => {
    // userType: 'client' or 'agent'
    // suspensionDuration: e.g., '7 days', '30 days', 'permanently', or empty for indefinite
    
    const durationText = suspensionDuration 
        ? suspensionDuration === 'permanently' 
            ? 'permanently suspended'
            : `suspended for ${suspensionDuration}`
        : 'suspended';

    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: 'Account Suspended',
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #dc2626; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Account Suspended</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${userName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        Your BeeSeek account has been ${durationText} by our team due to a violation of our terms of service.
                    </p>
                    
                    <div style="background-color: #fee2e2; padding: 20px; border-left: 4px solid #dc2626; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #7f1d1d; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">Reason for Suspension:</p>
                        <p style="color: #991b1b; font-size: 13px; font-weight: 400; margin: 0;">
                            ${violationReason}
                        </p>
                    </div>
                    
                    <div style="background-color: #f1f5f9; padding: 20px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e293b; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">What This Means:</p>
                        <ul style="margin: 0; padding-left: 20px; color: #64748b; font-size: 13px; line-height: 22px;">
                            <li>You cannot access your account during the suspension period</li>
                            <li>${userType === 'agent' ? 'You cannot accept or complete jobs' : 'You cannot book or access services'}</li>
                            <li>Your profile is temporarily hidden from the platform</li>
                        </ul>
                    </div>
                    
                    ${suspensionDuration && suspensionDuration !== 'permanently' ? `
                    <div style="background-color: #dbeafe; padding: 16px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e40af; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0;">
                            Your account will be automatically reactivated after ${suspensionDuration}. Please review our terms of service to avoid future violations.
                        </p>
                    </div>
                    ` : ''}
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        If you believe this suspension was made in error or have questions, please contact our support team.
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        Contact support: support@beeseek.site
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("Account suspension email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending account suspension email:', error);
        throw new Error('Failed to send account suspension email');
    }
};

// Function to send account deletion confirmation email
const sendAccountDeletionEmail = async (to, userName, userType) => {
    // userType: 'client' or 'agent'
    
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: 'Account Deleted - We\'ll Miss You',
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #1e293b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Account Deleted</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${userName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        Your BeeSeek account has been successfully deleted. We're sad to see you go.
                    </p>
                    
                    <div style="background-color: #f1f5f9; padding: 20px; border-left: 4px solid #64748b; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #475569; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0;">
                            Your account data has been removed from our system. If you created this account by mistake or have any concerns, please contact us within 30 days.
                        </p>
                    </div>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        Thank you for being part of the BeeSeek community. We hope to see you again in the future.
                    </p>
                    
                    <div style="background-color: #dbeafe; padding: 16px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e40af; font-size: 14px; font-weight: 400; line-height: 22px; margin: 0;">
                            Changed your mind? You can create a new account anytime and join the BeeSeek community again.
                        </p>
                    </div>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        Have feedback? We'd love to hear from you at support@beeseek.site.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Team
                    </p>
                </div>
            `
        });

        console.log("Account deletion email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending account deletion email:', error);
        throw new Error('Failed to send account deletion email');
    }
};

// Function to send SOS alert email to admins
const sendSOSAlertEmail = async (to, alertData) => {
    const {
        alertId,
        alertType,
        personName,
        latitude,
        longitude,
        address,
        taskId,
        emergencyContacts,
        timestamp
    } = alertData;

    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
    const hasEmergencyContacts = emergencyContacts && emergencyContacts.length > 0;

    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: `Safety Alert - ${personName}`,
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #dc2626; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Safety Alert</h2>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 24px 0;">
                        A BeeSeek ${alertType === 'user' ? 'user' : 'agent'} has activated their safety alert and requested assistance.
                    </p>
                    
                    <div style="background-color: #f1f5f9; padding: 20px; margin: 0 0 24px 0; border-radius: 8px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: 700; color: #64748b; width: 140px;">Alert ID:</td>
                                <td style="padding: 8px 0; color: #1e293b;">${alertId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: 700; color: #64748b;">Person:</td>
                                <td style="padding: 8px 0; color: #1e293b;">${personName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: 700; color: #64748b;">Location:</td>
                                <td style="padding: 8px 0; color: #1e293b;">${address || 'Unknown'}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: 700; color: #64748b;">Coordinates:</td>
                                <td style="padding: 8px 0; color: #1e293b;">${latitude}, ${longitude}</td>
                            </tr>
                            ${taskId ? `
                            <tr>
                                <td style="padding: 8px 0; font-weight: 700; color: #64748b;">Task ID:</td>
                                <td style="padding: 8px 0; color: #1e293b;">${taskId}</td>
                            </tr>
                            ` : ''}
                            <tr>
                                <td style="padding: 8px 0; font-weight: 700; color: #64748b;">Time:</td>
                                <td style="padding: 8px 0; color: #1e293b;">${timestamp}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="margin: 0 0 24px 0;">
                        <a href="${mapsLink}" style="display: inline-block; background-color: #dc2626; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 15px; font-weight: 700; margin-right: 12px;">
                            View Location
                        </a>
                        <a href="https://beeseek-admin.vercel.app/sos-alerts" style="display: inline-block; background-color: #549fe5; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 15px; font-weight: 700;">
                            Admin Dashboard
                        </a>
                    </div>
                    
                    ${!hasEmergencyContacts ? `
                    <div style="background-color: #fee2e2; padding: 16px; border-left: 4px solid #dc2626; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #991b1b; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">No Emergency Contacts</p>
                        <p style="color: #7f1d1d; font-size: 13px; font-weight: 400; margin: 0;">
                            This user has not configured emergency contacts. Only admins have been notified.
                        </p>
                    </div>
                    ` : `
                    <div style="background-color: #f1f5f9; padding: 16px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e293b; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">Emergency Contacts Notified:</p>
                        <ul style="list-style: none; padding: 0; margin: 0;">
                            ${emergencyContacts.map(contact => `
                                <li style="padding: 4px 0; color: #64748b; font-size: 13px;">
                                    ${contact.name} - ${contact.phone}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    `}
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Safety Team
                    </p>
                </div>
            `
        });

        console.log("SOS alert email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending SOS alert email:', error);
        throw new Error('Failed to send SOS alert email');
    }
};

// Function to send court session notification email
const sendCourtSessionEmail = async (to, userName, userType, taskTitle, courtSessionDate, courtSessionTime, reportId, disputeReason) => {
    // userType: 'client' or 'agent'
    
    try {
        const info = await transporter.sendMail({
            from: `"BeeSeek" <${fromEmail}>`,
            to: to,
            subject: 'Court Session Scheduled - Action Required',
            html: `
                <div style="font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                    <h2 style="color: #f59e0b; font-size: 24px; font-weight: 700; margin: 0 0 24px 0;">Court Session Scheduled</h2>
                    
                    <p style="color: #334155; font-size: 16px; font-weight: 400; margin: 0 0 16px 0;">Hello ${userName},</p>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        A court session has been scheduled to review the report filed regarding the task <strong>"${taskTitle}"</strong>.
                    </p>
                    
                    <div style="background-color: #fef3c7; padding: 20px; border-left: 4px solid #f59e0b; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #92400e; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">Mandatory Attendance</p>
                        <p style="color: #92400e; font-size: 13px; font-weight: 400; margin: 0;">
                            Your presence is required for this court session. Please ensure you're available at the scheduled time.
                        </p>
                    </div>
                    
                    <div style="background-color: #f1f5f9; padding: 20px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e293b; font-size: 14px; font-weight: 700; margin: 0 0 12px 0;">Court Session Details:</p>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: 700; color: #64748b; width: 140px;">Report ID:</td>
                                <td style="padding: 8px 0; color: #1e293b;">${reportId}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: 700; color: #64748b;">Task:</td>
                                <td style="padding: 8px 0; color: #1e293b;">${taskTitle}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: 700; color: #64748b;">Date:</td>
                                <td style="padding: 8px 0; color: #1e293b;">${courtSessionDate}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: 700; color: #64748b;">Time:</td>
                                <td style="padding: 8px 0; color: #1e293b;">${courtSessionTime}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: 700; color: #64748b; vertical-align: top;">Dispute:</td>
                                <td style="padding: 8px 0; color: #1e293b;">${disputeReason}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="background-color: #dbeafe; padding: 16px; margin: 0 0 24px 0; border-radius: 8px;">
                        <p style="color: #1e40af; font-size: 14px; font-weight: 700; margin: 0 0 8px 0;">What to Expect:</p>
                        <ul style="margin: 0; padding-left: 20px; color: #1e40af; font-size: 13px; line-height: 22px;">
                            <li>Both parties will present their case</li>
                            <li>Evidence and documentation will be reviewed</li>
                            <li>A BeeSeek moderator will facilitate the session</li>
                            <li>A fair resolution will be determined</li>
                        </ul>
                    </div>
                    
                    <div style="background-color: #fee2e2; padding: 16px; border-left: 4px solid #dc2626; margin: 0 0 24px 0; border-radius: 4px;">
                        <p style="color: #7f1d1d; font-size: 14px; font-weight: 400; margin: 0;">
                            <strong>Important:</strong> Failure to attend the court session may result in an automatic ruling in favor of the other party.
                        </p>
                    </div>
                    
                    <p style="color: #64748b; font-size: 15px; font-weight: 400; line-height: 24px; margin: 0 0 16px 0;">
                        ${userType === 'agent' 
                            ? 'Prepare any evidence, photos, or documentation that supports your case. Be ready to explain your side of the dispute clearly.' 
                            : 'Gather any receipts, photos, or communication records related to this task. Be prepared to explain your concerns clearly.'}
                    </p>
                    
                    <p style="color: #94a3b8; font-size: 13px; font-weight: 400; margin: 0;">
                        Questions about the court process? Contact support at support@beeseek.site.
                    </p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
                    
                    <p style="color: #94a3b8; font-size: 12px; font-weight: 400; margin: 0;">
                        BeeSeek Dispute Resolution Team
                    </p>
                </div>
            `
        });

        console.log("Court session email sent:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending court session email:', error);
        throw new Error('Failed to send court session email');
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail,
    sendWelcomeEmail,
    sendNotificationEmail,
    sendAgentMagicLink,
    testEmailConnection,
    sendAutoApprovalWarningEmail,
    sendAutoApprovalUserEmail,
    sendAutoApprovalAgentEmail,
    sendFirstBookingCelebrationEmail,
    sendAgentLateNotificationEmail,
    sendTaskCancellationEmail,
    sendTaskStartingSoonEmail,
    sendBookingConfirmationEmail,
    sendHomeSafetyReminderEmail,
    sendBeeCreationEmail,
    sendAgentWelcomeKYCEmail,
    sendBeeTakedownEmail,
    sendIssueReportEmail,
    sendAccountSuspensionEmail,
    sendAccountDeletionEmail,
    sendSOSAlertEmail,
    sendCourtSessionEmail
};