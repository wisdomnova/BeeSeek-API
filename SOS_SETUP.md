# BeeSeek API - SOS Emergency Alert System

## New Features Added

### 1. SMS Integration (Termii)
- **File**: `termii.js`
- Send SMS via Termii API
- Bulk SMS support
- Balance checking
- Nigerian phone number support

### 2. SOS Alert Endpoint
- **Endpoint**: `POST /send-sos-alert`
- Sends SMS to emergency contacts
- Sends email to admins
- Logs all actions to database

---

## Setup Instructions

### 1. Install Dependencies

```bash
cd BeeSeek-API
npm install
```

New dependencies added:
- `axios` - For Termii API calls
- `@supabase/supabase-js` - For logging to database

### 2. Configure Environment Variables

Update `.env` file with:

```env
# Get from Termii Dashboard (https://termii.com)
TERMII_API_KEY=your_termii_api_key_here
TERMII_SENDER_ID=BeeSeek

# Get from Supabase Dashboard
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 3. Get Termii API Key

1. Sign up at https://termii.com
2. Verify your account
3. Go to Dashboard → API Settings
4. Copy your API Key
5. Add to `.env` file

### 4. Test the Setup

```bash
npm start
```

Visit: `http://localhost:5000/health`

Should return:
```json
{
  "success": true,
  "email": {
    "success": true,
    "message": "Email service connected"
  },
  "sms": {
    "success": true,
    "message": "Termii connected. Balance: NGN 1000.00"
  }
}
```

---

## API Endpoints

### Health Check
```http
GET /health
```

Returns status of email and SMS services.

### Send SOS Alert
```http
POST /send-sos-alert
Content-Type: application/json

{
  "alertId": "uuid",
  "alertType": "user",
  "personName": "John Doe",
  "personId": "uuid",
  "latitude": 6.5244,
  "longitude": 3.3792,
  "address": "123 Main St, Lagos",
  "taskId": "BSK-TASK-20250126-abc123",
  "emergencyContacts": [
    {
      "name": "Jane Doe",
      "phone": "+2348012345678"
    },
    {
      "name": "Bob Smith", 
      "phone": "+2347098765432"
    }
  ],
  "adminEmails": [
    "wisdomdivine3d@gmail.com"
  ]
}
```

**Response:**
```json
{
  "success": true,
  "alertId": "uuid",
  "smsResults": [
    {
      "phone": "+2348012345678",
      "name": "Jane Doe",
      "success": true,
      "messageId": "termii_msg_id"
    }
  ],
  "emailResults": [
    {
      "email": "wisdomdivine3d@gmail.com",
      "success": true,
      "messageId": "resend_msg_id"
    }
  ]
}
```

---

## SMS Message Format

Emergency contacts receive:
```
🚨 EMERGENCY ALERT

[Person Name] needs help!

Location: [Address]

View map: https://www.google.com/maps?q=[lat],[lng]

- BeeSeek Safety Team
```

---

## Email Format

Admins receive:
- **Subject**: 🚨 EMERGENCY SOS ALERT - [Person Name]
- **Content**: 
  - Alert details (ID, type, person, location)
  - Google Maps link
  - Admin dashboard link
  - List of notified emergency contacts
  - Timestamp

---

## Cost Estimates

### SMS (Termii)
- ₦3.50 per SMS
- 3 emergency contacts = ₦10.50
- ~₦1,000-2,000/month for 100 alerts

### Email (Resend)
- FREE up to 3,000 emails/month
- $0.10 per 1,000 after that

### Total
- **~₦1,000-2,000/month** for typical usage

---

## Deployment

### Deploy to Render

1. Push changes to GitHub
2. Render will auto-deploy
3. Add environment variables in Render dashboard:
   - `TERMII_API_KEY`
   - `TERMII_SENDER_ID`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

### Test Production

```bash
curl -X POST https://beeseek-api.onrender.com/send-sos-alert \
  -H "Content-Type: application/json" \
  -d '{
    "alertId": "test-123",
    "alertType": "user",
    "personName": "Test User",
    "latitude": 6.5244,
    "longitude": 3.3792,
    "address": "Test Address, Lagos",
    "emergencyContacts": [
      {
        "name": "Test Contact",
        "phone": "+2348108394409"
      }
    ],
    "adminEmails": ["wisdomdivine3d@gmail.com"]
  }'
```

---

## Next Steps

1. ✅ Deploy updated API to Render
2. ⏳ Create mobile app SOS button flow
3. ⏳ Create admin dashboard SOS monitoring page
4. ⏳ Test end-to-end SOS system

---

## Support

For issues or questions:
- Email: support@beeseek.site
- GitHub: Create an issue in the repo
