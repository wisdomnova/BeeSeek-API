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
  testEmailConnection,
  sendAutoApprovalWarningEmail,
  sendAutoApprovalUserEmail,
  sendAutoApprovalAgentEmail,
  sendSOSAlertEmail,
  sendTaskStartingSoonEmail,
  sendAgentLateNotificationEmail,
  sendFirstBookingCelebrationEmail,
  sendHomeSafetyReminderEmail,
  sendTaskCancellationEmail,
  sendBookingConfirmationEmail,
  sendIssueReportEmail,
  sendBeeCreationEmail,
  sendBeeTakedownEmail,
  sendAgentWelcomeKYCEmail,
  sendAccountSuspensionEmail,
  sendAccountDeletionEmail
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

      // Format phone numbers to include + prefix (required by Termii)
      const formattedContacts = emergencyContacts.map(contact => ({
        ...contact,
        phone: contact.phone.startsWith('+') ? contact.phone : `+${contact.phone}`
      }));

      // DISABLED: Uncomment to enable SMS sending
      // const smsResults = await sendBulkSMS(formattedContacts, smsMessage);
      // results.smsResults = smsResults;

      // Mock SMS results for testing
      const smsResults = formattedContacts.map(contact => ({
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

      const alertData = {
        alertId,
        alertType,
        personName,
        latitude,
        longitude,
        address,
        taskId,
        emergencyContacts,
        timestamp: new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos' })
      };

      for (const adminEmail of adminEmails) {
        try {
          const emailResult = await sendSOSAlertEmail(adminEmail, alertData);

          results.emailResults.push({
            email: adminEmail,
            success: emailResult.success,
            messageId: emailResult.messageId,
            error: emailResult.error
          });

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
            error: emailError.error || emailError.message
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

// Send auto-approval notification emails
app.post('/send-auto-approval-emails', async (req, res) => {
  try {
    const { 
      userEmail, 
      userName, 
      agentEmail, 
      agentName, 
      activityType, 
      activityTitle, 
      amount, 
      emailType 
    } = req.body;
    
    console.log('📧 Received auto-approval email request:', { 
      userEmail, 
      userName, 
      agentEmail, 
      agentName, 
      activityType, 
      activityTitle, 
      amount,
      emailType 
    });
    
    if (!activityType || !activityTitle || !amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Activity type, title, and amount are required' 
      });
    }

    const results = {
      userEmailSent: false,
      agentEmailSent: false
    };

    // Send user email (warning at 20 hours, or confirmation after auto-approval)
    if (userEmail && userName) {
      try {
        if (emailType === 'warning') {
          await sendAutoApprovalWarningEmail(userEmail, userName, activityType, activityTitle, 4);
        } else {
          await sendAutoApprovalUserEmail(userEmail, userName, activityType, activityTitle, amount);
        }
        results.userEmailSent = true;
        console.log('✅ User email sent successfully');
      } catch (error) {
        console.error('❌ Failed to send user email:', error);
      }
    }

    // Send agent email (only after auto-approval)
    if (agentEmail && agentName && emailType !== 'warning') {
      try {
        await sendAutoApprovalAgentEmail(agentEmail, agentName, activityType, activityTitle, amount);
        results.agentEmailSent = true;
        console.log('✅ Agent email sent successfully');
      } catch (error) {
        console.error('❌ Failed to send agent email:', error);
      }
    }

    const overallSuccess = results.userEmailSent || results.agentEmailSent;
    
    res.status(overallSuccess ? 200 : 500).json({
      success: overallSuccess,
      ...results,
      message: overallSuccess 
        ? 'Auto-approval emails sent successfully' 
        : 'Failed to send auto-approval emails'
    });
  } catch (error) {
    console.error('❌ Send auto-approval emails error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send auto-approval emails',
      message: error.message 
    });
  }
});

// Send task starting soon email
app.post('/send-task-starting-soon', async (req, res) => {
  try {
    const { to, userName, userType, activityType, activityTitle, startTime, address } = req.body;
    
    console.log('📧 Received task starting soon email request:', { to, userName, userType, activityType });
    
    if (!to || !userName || !activityType || !activityTitle) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: to, userName, activityType, activityTitle' 
      });
    }

    const result = await sendTaskStartingSoonEmail(to, userName, userType, activityType, activityTitle, startTime, address);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send task starting soon email error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send task starting soon email',
      message: error.message 
    });
  }
});

// Send agent late notification email
app.post('/send-agent-late-notification', async (req, res) => {
  try {
    const { to, agentName, taskTitle, userContactInfo } = req.body;
    
    console.log('📧 Received agent late notification request:', { to, agentName, taskTitle });
    
    if (!to || !agentName || !taskTitle) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: to, agentName, taskTitle' 
      });
    }

    const result = await sendAgentLateNotificationEmail(to, agentName, taskTitle, userContactInfo);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send agent late notification error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send agent late notification',
      message: error.message 
    });
  }
});

// Send first booking celebration email
app.post('/send-first-booking-celebration', async (req, res) => {
  try {
    const { to, name, userType, activityType, bookingDate, bookingTime, serviceName, referenceNumber } = req.body;
    
    console.log('📧 Received first booking celebration request:', { to, name, userType, activityType });
    
    if (!to || !name || !userType || !activityType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: to, name, userType, activityType' 
      });
    }

    const result = await sendFirstBookingCelebrationEmail(to, name, userType, activityType, bookingDate, bookingTime, serviceName, referenceNumber);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send first booking celebration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send first booking celebration',
      message: error.message 
    });
  }
});

// Send home safety reminder email
app.post('/send-home-safety-reminder', async (req, res) => {
  try {
    const { to, agentName, activityType, activityTitle } = req.body;
    
    console.log('📧 Received home safety reminder request:', { to, agentName, activityType, activityTitle });
    
    if (!to || !agentName || !activityType || !activityTitle) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: to, agentName, activityType, activityTitle' 
      });
    }

    const result = await sendHomeSafetyReminderEmail(to, agentName, activityType, activityTitle);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send home safety reminder error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send home safety reminder',
      message: error.message 
    });
  }
});

// Send task cancellation email
app.post('/send-task-cancellation', async (req, res) => {
  try {
    const { to, userName, taskTitle, cancellationReason } = req.body;
    
    console.log('📧 Received task cancellation email request:', { to, userName, taskTitle });
    
    if (!to || !userName || !taskTitle) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: to, userName, taskTitle' 
      });
    }

    const result = await sendTaskCancellationEmail(to, userName, taskTitle, cancellationReason);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send task cancellation email error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send task cancellation email',
      message: error.message 
    });
  }
});

// Send booking confirmation email
app.post('/send-booking-confirmation', async (req, res) => {
  try {
    const { to, userName, userType, bookingData } = req.body;
    
    console.log('📧 Received booking confirmation request:', { to, userName, userType });
    
    if (!to || !userName || !userType || !bookingData) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: to, userName, userType, bookingData' 
      });
    }

    const result = await sendBookingConfirmationEmail(to, userName, userType, bookingData);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send booking confirmation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send booking confirmation',
      message: error.message 
    });
  }
});

app.post('/send-issue-report', async (req, res) => {
  try {
    const { to, userName, issueId, issueDescription } = req.body;
    
    console.log('📧 Received issue report email request:', { to, userName, issueId });
    
    if (!to || !userName || !issueId || !issueDescription) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: to, userName, issueId, issueDescription' 
      });
    }

    const result = await sendIssueReportEmail(to, userName, issueId, issueDescription);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send issue report email error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send issue report email',
      message: error.message 
    });
  }
});

app.post('/send-bee-creation', async (req, res) => {
  try {
    const { to, agentName, beeTitle, beeCategory } = req.body;
    
    console.log('📧 Received bee creation email request:', { to, agentName, beeTitle });
    
    if (!to || !agentName || !beeTitle || !beeCategory) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: to, agentName, beeTitle, beeCategory' 
      });
    }

    const result = await sendBeeCreationEmail(to, agentName, beeTitle, beeCategory);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send bee creation email error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send bee creation email',
      message: error.message 
    });
  }
});

app.post('/send-bee-takedown', async (req, res) => {
  try {
    const { to, agentName, beeTitle, takedownReason } = req.body;
    
    console.log('📧 Received bee takedown email request:', { to, agentName, beeTitle });
    
    if (!to || !agentName || !beeTitle || !takedownReason) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: to, agentName, beeTitle, takedownReason' 
      });
    }

    const result = await sendBeeTakedownEmail(to, agentName, beeTitle, takedownReason);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send bee takedown email error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send bee takedown email',
      message: error.message 
    });
  }
});

app.post('/send-agent-welcome-kyc', async (req, res) => {
  try {
    const { to, agentName } = req.body;
    
    console.log('📧 Received agent welcome KYC email request:', { to, agentName });
    
    if (!to || !agentName) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: to, agentName' 
      });
    }

    const result = await sendAgentWelcomeKYCEmail(to, agentName);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send agent welcome KYC email error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send agent welcome KYC email',
      message: error.message 
    });
  }
});

app.post('/send-account-suspension', async (req, res) => {
  try {
    const { to, userName, userType, violationReason, suspensionDuration } = req.body;
    
    console.log('📧 Received account suspension email request:', { to, userName, userType });
    
    if (!to || !userName || !userType || !violationReason) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: to, userName, userType, violationReason' 
      });
    }

    const result = await sendAccountSuspensionEmail(to, userName, userType, violationReason, suspensionDuration || '');
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send account suspension email error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send account suspension email',
      message: error.message 
    });
  }
});

app.post('/send-account-deletion', async (req, res) => {
  try {
    const { to, userName, userType } = req.body;
    
    console.log('📧 Received account deletion email request:', { to, userName, userType });
    
    if (!to || !userName || !userType) {
      return res.status(400).json({ 
        success: false, 
        error: 'Required fields: to, userName, userType' 
      });
    }

    const result = await sendAccountDeletionEmail(to, userName, userType);
    
    res.status(result.success ? 200 : 500).json(result);
  } catch (error) {
    console.error('❌ Send account deletion email error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send account deletion email',
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