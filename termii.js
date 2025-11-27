// termii.js
require('dotenv').config();
const axios = require('axios');

const TERMII_API_KEY = process.env.TERMII_API_KEY;
const TERMII_BASE_URL = process.env.TERMII_BASE_URL || 'https://v3.api.termii.com';
const TERMII_SENDER_ID = process.env.TERMII_SENDER_ID || 'BeeSeek'; // Max 11 characters

/**
 * Send SMS via Termii
 * @param {string} to - Phone number (e.g., '+2348012345678')
 * @param {string} message - SMS message content
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
const sendSMS = async (to, message) => {
    try {
        // Validate phone number format
        if (!to || !to.startsWith('+234')) {
            return { 
                success: false, 
                error: 'Invalid phone number. Must start with +234' 
            };
        }

        // Validate message
        if (!message || message.trim().length === 0) {
            return { 
                success: false, 
                error: 'Message content is required' 
            };
        }

        // Check message length (160 chars = 1 SMS, 306 chars = 2 SMS)
        if (message.length > 612) {
            return { 
                success: false, 
                error: 'Message too long. Maximum 612 characters (4 SMS)' 
            };
        }

        console.log(`📱 Sending SMS to ${to}...`);

        const response = await axios.post(
            `${TERMII_BASE_URL}/sms/send`,
            {
                to: to,
                from: TERMII_SENDER_ID,
                sms: message,
                type: 'plain',
                channel: 'generic',
                api_key: TERMII_API_KEY
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            }
        );

        if (response.data && response.data.message_id) {
            console.log(`✅ SMS sent successfully. Message ID: ${response.data.message_id}`);
            return {
                success: true,
                messageId: response.data.message_id,
                balance: response.data.balance
            };
        } else {
            console.error('❌ Termii API unexpected response:', response.data);
            return {
                success: false,
                error: response.data?.message || 'Failed to send SMS'
            };
        }

    } catch (error) {
        console.error('❌ Termii SMS error:', error.response?.data || error.message);
        
        if (error.response?.status === 401) {
            return { 
                success: false, 
                error: 'Invalid Termii API key' 
            };
        } else if (error.response?.status === 400) {
            return { 
                success: false, 
                error: error.response?.data?.message || 'Invalid request parameters' 
            };
        } else if (error.code === 'ECONNABORTED') {
            return { 
                success: false, 
                error: 'Request timeout. Please try again.' 
            };
        } else {
            return { 
                success: false, 
                error: 'Network error. Please try again.' 
            };
        }
    }
};

/**
 * Send SMS to multiple recipients
 * @param {Array<{phone: string, name: string}>} recipients - Array of recipients
 * @param {string} message - SMS message content
 * @returns {Promise<Array<{phone: string, name: string, success: boolean, messageId?: string, error?: string}>>}
 */
const sendBulkSMS = async (recipients, message) => {
    try {
        console.log(`📱 Sending bulk SMS to ${recipients.length} recipients...`);

        const results = await Promise.allSettled(
            recipients.map(async (recipient) => {
                const result = await sendSMS(recipient.phone, message);
                return {
                    phone: recipient.phone,
                    name: recipient.name,
                    ...result
                };
            })
        );

        return results.map(result => 
            result.status === 'fulfilled' 
                ? result.value 
                : { 
                    phone: 'unknown', 
                    name: 'unknown', 
                    success: false, 
                    error: result.reason?.message || 'Unknown error' 
                }
        );

    } catch (error) {
        console.error('❌ Bulk SMS error:', error);
        throw error;
    }
};

/**
 * Check Termii account balance
 * @returns {Promise<{success: boolean, balance?: number, currency?: string, error?: string}>}
 */
const checkBalance = async () => {
    try {
        const response = await axios.get(
            `${TERMII_BASE_URL}/get-balance?api_key=${TERMII_API_KEY}`,
            { timeout: 10000 }
        );

        if (response.data) {
            return {
                success: true,
                balance: response.data.balance,
                currency: response.data.currency || 'NGN'
            };
        } else {
            return {
                success: false,
                error: 'Unable to fetch balance'
            };
        }

    } catch (error) {
        console.error('❌ Check balance error:', error.response?.data || error.message);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Test Termii connection
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
const testTermiiConnection = async () => {
    try {
        if (!TERMII_API_KEY) {
            return {
                success: false,
                error: 'TERMII_API_KEY not configured'
            };
        }

        const balanceCheck = await checkBalance();
        
        if (balanceCheck.success) {
            return {
                success: true,
                message: `Termii connected. Balance: ${balanceCheck.currency} ${balanceCheck.balance}`
            };
        } else {
            return {
                success: false,
                error: balanceCheck.error || 'Unable to connect to Termii'
            };
        }

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    sendSMS,
    sendBulkSMS,
    checkBalance,
    testTermiiConnection
};
