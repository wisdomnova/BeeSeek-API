// server.js
const path = require('path');
const fs = require('fs');

// Load .env or .env.local
if (fs.existsSync(path.join(__dirname, '.env'))) {
    require('dotenv').config({ path: '.env' });
} else if (fs.existsSync(path.join(__dirname, '.env.local'))) {
    require('dotenv').config({ path: '.env.local' });
}
const express = require('express');
const cors = require('cors');
const {
  sendVerificationEmail,
  sendPasswordResetEmail, 
  sendWelcomeEmail,
  sendNotificationEmail,
  sendAgentMagicLink,
  testEmailConnection
} = require('./nodemailer');

const {
  sendSMS,
  sendBulkSMS,
  checkBalance,
  testTermiiConnection
} = require('./termii');

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares 
app.use(cors());
app.use(express.json());

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: err.message 
  });
});

// Routes

// Health check or SMTP verification
app.get('/health', async (req, res) => {
  try {
    const emailTest = await testEmailConnection();
    const smsTest = await testTermiiConnection();
    
    res.status((emailTest.success && smsTest.success) ? 200 : 500).json({
      success: (emailTest.success && smsTest.success),
      email: emailTest,
      sms: smsTest
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Health check failed',
      message: error.message 
    });
  }
});

// Send verification email
app.post('/send-verification', async (req, res) => {
  try {
    const { email, code, name } = req.body;
    
    console.log('📧 Received verification request:', { email, code, name });
    
    if (!email || !code) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and code are required' 
      });
    }

    const result = await sendVerificationEmail(email, code, name);
    
    console.log('📬 Email send result:', result);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send verification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send verification email',
      message: error.message 
    });
  }
});

// Send password reset email
app.post('/send-reset', async (req, res) => {
  try {
    const { email, code, name } = req.body;
    if (!email || !code) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and code are required' 
      });
    }

    const result = await sendPasswordResetEmail(email, code, name);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('Send reset error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send reset email',
      message: error.message 
    });
  }
});

// Send welcome email
app.post('/send-welcome', async (req, res) => {
  try {
    const { email, name } = req.body;
    if (!email || !name) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and name are required' 
      });
    }

    const result = await sendWelcomeEmail(email, name);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('Send welcome error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send welcome email',
      message: error.message 
    });
  }
});

// Send notification email
app.post('/send-notification', async (req, res) => {
  try {
    const { email, subject, message, name } = req.body;
    if (!email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email, subject, and message are required' 
      });
    }

    const result = await sendNotificationEmail(email, subject, message, name);
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send notification email',
      message: error.message 
    });
  }
});

// ✅ Send agent magic link verification email
app.post('/send-agent-magic-link', async (req, res) => {
  try {
    const { email, agentId, name } = req.body;
    
    console.log('🔗 Received magic link request:', { email, agentId, name });
    
    if (!email || !agentId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and agent ID are required' 
      });
    }

    const result = await sendAgentMagicLink(email, agentId, name);
    
    console.log('✨ Magic link result:', result);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send magic link error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send magic link',
      message: error.message 
    });
  }
});

// ✅ NEW: Send SOS Emergency Alert (SMS + Email)
app.post('/send-sos-alert', async (req, res) => {
  try {
    const {
      alertId,
      alertType, // 'user' or 'agent'
      personName,
      personId,
      latitude,
      longitude,
      address,
      taskId,
      emergencyContacts, // [{name, phone}]
      adminEmails
    } = req.body;

    console.log('🚨 Received SOS alert:', { alertId, alertType, personName });

    // Validate required fields
    if (!alertId || !alertType || !personName || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: alertId, alertType, personName, latitude, longitude'
      });
    }

    // Client already checked rate limit - proceed with sending notifications
    console.log('✅ Proceeding with alert - client verified rate limit');

    const results = {
      alertId,
      smsResults: [],
      emailResults: [],
      errors: []
    };

    // Generate Google Maps link
    const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // 1. Send SMS to Emergency Contacts - DISABLED FOR TESTING
    if (emergencyContacts && emergencyContacts.length > 0) {
      console.log(`📱 [TEST MODE] Would send SMS to ${emergencyContacts.length} emergency contacts (DISABLED)...`);

      const smsMessage = `🚨 SAFETY ALERT\n\n${personName} has requested emergency assistance via BeeSeek.\n\nLocation: ${address || 'See map'}\n\nView map: ${mapsLink}\n\nIf you can reach them, please check on their wellbeing.\n\n- BeeSeek Safety Team`;

      // DISABLED: Uncomment to enable SMS sending
      // const smsResults = await sendBulkSMS(emergencyContacts, smsMessage);
      // results.smsResults = smsResults;

      // Mock SMS results for testing
      const smsResults = emergencyContacts.map(contact => ({
        phone: contact.phone,
        name: contact.name,
        success: true,
        messageId: 'test-mock-id',
        note: 'SMS DISABLED - Test mode'
      }));
      results.smsResults = smsResults;

      console.log('⚠️ SMS NOT SENT - Test mode active');

      // Log each SMS result to database (marked as test)
      for (const smsResult of smsResults) {
        try {
          await supabase.from('SOS Alert Actions').insert({
            sos_id: alertId,
            action_type: 'sms_sent',
            action_status: 'success',
            target_type: 'emergency_contact',
            target_identifier: smsResult.phone,
            target_name: smsResult.name,
            error_message: null,
            response_data: { messageId: smsResult.messageId, test_mode: true },
            performed_by: 'system',
            notes: 'TEST MODE - SMS not actually sent'
          });
        } catch (dbError) {
          console.error('Failed to log SMS action:', dbError);
        }
      }
    } else if (!emergencyContacts || emergencyContacts.length === 0) {
      // No emergency contacts - still process alert but log this
      console.log('⚠️ No emergency contacts provided - only admins will be notified');
      
      // Log that no emergency contacts were available
      try {
        await supabase.from('SOS Alert Actions').insert({
          sos_id: alertId,
          action_type: 'sms_sent',
          action_status: 'skipped',
          target_type: 'emergency_contact',
          target_identifier: null,
          target_name: null,
          error_message: null,
          response_data: { reason: 'No emergency contacts configured' },
          performed_by: 'system',
          notes: 'User has no emergency contacts - alert sent to admins only'
        });
      } catch (dbError) {
        console.error('Failed to log no-contacts action:', dbError);
      }
    }

    // 2. Send Email to Admin
    if (adminEmails && adminEmails.length > 0) {
      console.log(`📧 Sending email to ${adminEmails.length} admins...`);

      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);

      const emailHtml = `
        <div style="font-family: 'Lato', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #dc2626; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🚨 Safety Alert - Assistance Requested</h1>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border: 2px solid #dc2626; border-top: none; border-radius: 0 0 8px 8px;">
            <p style="color: #1e293b; font-size: 15px; margin-top: 0; margin-bottom: 20px;">A BeeSeek user has activated their safety alert. This notification has been sent to their emergency contacts and our safety team for monitoring.</p>
            <h2 style="color: #1e293b; margin-top: 0;">Alert Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Alert ID:</td>
                <td style="padding: 8px 0; color: #1e293b;">${alertId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Type:</td>
                <td style="padding: 8px 0; color: #1e293b;">${alertType === 'user' ? 'User Emergency' : 'Agent Emergency'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Person:</td>
                <td style="padding: 8px 0; color: #1e293b;">${personName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Location:</td>
                <td style="padding: 8px 0; color: #1e293b;">${address || 'Unknown'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Coordinates:</td>
                <td style="padding: 8px 0; color: #1e293b;">${latitude}, ${longitude}</td>
              </tr>
              ${taskId ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Task ID:</td>
                <td style="padding: 8px 0; color: #1e293b;">${taskId}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold; color: #64748b;">Time:</td>
                <td style="padding: 8px 0; color: #1e293b;">${new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })}</td>
              </tr>
            </table>

            <div style="margin: 20px 0;">
              <a href="${mapsLink}" style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">📍 View Location on Map</a>
            </div>

            <div style="margin: 20px 0;">
              <a href="https://beeseek-admin.vercel.app/sos-alerts" style="display: inline-block; background-color: #549fe5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">🚨 View in Admin Dashboard</a>
            </div>

            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px; margin: 20px 0;">
              <p style="margin: 0; color: #78350f; font-size: 14px;">
                <strong>⚠️ Action Required:</strong> A user has requested assistance. Please review the details and respond appropriately. ${emergencyContacts && emergencyContacts.length > 0 ? 'Their emergency contacts have been notified.' : '<strong>Note: User has no emergency contacts configured.</strong>'}
              </p>
            </div>

            ${emergencyContacts && emergencyContacts.length > 0 ? `
            <div style="margin: 20px 0;">
              <h3 style="color: #1e293b; font-size: 16px; margin-bottom: 8px;">Emergency Contacts Notified:</h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${emergencyContacts.map(contact => `
                  <li style="padding: 4px 0; color: #64748b;">
                    ✓ ${contact.name} - ${contact.phone}
                  </li>
                `).join('')}
              </ul>
            </div>
            ` : `
            <div style="margin: 20px 0; background-color: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px;">
              <h3 style="color: #991b1b; font-size: 16px; margin: 0 0 8px 0;">⚠️ No Emergency Contacts</h3>
              <p style="color: #7f1d1d; font-size: 14px; margin: 0;">
                This user has not configured any emergency contacts. Only BeeSeek admins have been notified of this alert.
              </p>
            </div>
            `}
          </div>

          <div style="text-align: center; margin-top: 20px; color: #94a3b8; font-size: 12px;">
            <p>BeeSeek Emergency Response System</p>
            <p>This is an automated alert. Do not reply to this email.</p>
          </div>
        </div>
      `;

      for (const adminEmail of adminEmails) {
        try {
          const { data, error } = await resend.emails.send({
            from: `BeeSeek Safety <${process.env.FROM_EMAIL}>`,
            to: adminEmail,
            subject: `🚨 Safety Alert: ${personName} - Assistance Requested`,
            html: emailHtml
          });

          const emailResult = {
            email: adminEmail,
            success: !error,
            messageId: data?.id,
            error: error?.message
          };

          results.emailResults.push(emailResult);

          // Log email action to database
          try {
            await supabase.from('SOS Alert Actions').insert({
              sos_id: alertId,
              action_type: 'email_sent',
              action_status: emailResult.success ? 'success' : 'failed',
              target_type: 'admin',
              target_identifier: adminEmail,
              error_message: emailResult.error || null,
              response_data: { messageId: emailResult.messageId },
              performed_by: 'system'
            });
          } catch (dbError) {
            console.error('Failed to log email action:', dbError);
          }

        } catch (emailError) {
          console.error(`Failed to send email to ${adminEmail}:`, emailError);
          results.emailResults.push({
            email: adminEmail,
            success: false,
            error: emailError.message
          });
        }
      }
    }

    // 3. Check if any notifications succeeded
    const smsSuccess = results.smsResults.some(r => r.success);
    const emailSuccess = results.emailResults.some(r => r.success);
    const overallSuccess = smsSuccess || emailSuccess;

    console.log('✅ SOS alert processed:', {
      smsSuccess,
      emailSuccess,
      overallSuccess
    });

    res.status(overallSuccess ? 200 : 500).json({
      success: overallSuccess,
      ...results,
      message: overallSuccess 
        ? 'SOS alert sent successfully' 
        : 'Failed to send SOS alert'
    });

  } catch (error) {
    console.error('❌ SOS alert error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process SOS alert',
      message: error.message
    });
  }
});

// Catch-all route for 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Route not found' 
  });
});

app.listen(PORT, () => {
  console.log(`📨 BeeSeek Email API is running on port ${PORT}`);
});