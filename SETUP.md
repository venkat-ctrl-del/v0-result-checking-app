# Exam Results Monitor - Setup Guide

A minimalistic, fast, and fully automated exam result monitoring system that checks for results and sends instant notifications via Email, SMS, and WhatsApp.

## Features

✅ **Add Candidates** - Store hall ticket numbers and dates of birth  
✅ **Monitor Exams** - Add exam result portal URLs to monitor  
✅ **Enroll Candidates** - Link candidates to exams for automatic checking  
✅ **Add Contacts** - Configure notification recipients (Email, SMS, WhatsApp)  
✅ **Automated Checking** - Periodic checks for result availability  
✅ **Instant Notifications** - Multi-channel result delivery  
✅ **Result Tracking** - View all notifications and screenshots  
✅ **Custom Intervals** - Set your own check frequency (1-1440 minutes)  

## Prerequisites

- Node.js 18+ 
- Supabase account (database)
- (Optional) API keys for notifications:
  - **Email**: Resend or SendGrid API key
  - **SMS**: Twilio Account SID & Auth Token
  - **WhatsApp**: Twilio WhatsApp number

## Installation

### 1. Clone and Setup

```bash
git clone <repository>
cd exam-results-monitor
pnpm install
```

### 2. Supabase Configuration

The database schema has already been created with these tables:

- `candidates` - Hall ticket number, DOB
- `exams` - Result portal URLs
- `contacts` - Email, SMS, WhatsApp recipients
- `exam_enrollments` - Links between candidates and exams
- `notification_logs` - History of all sent notifications
- `automation_settings` - Check frequency and status

### 3. Environment Variables

Create a `.env.local` file:

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cron Job Secret (required for automation)
CRON_SECRET=your_secret_key_here

# Email Service (optional)
RESEND_API_KEY=your_resend_api_key

# SMS/WhatsApp Service (optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
TWILIO_WHATSAPP_NUMBER=+1XXXXXXXXXX
```

### 4. Running Locally

```bash
pnpm dev
```

Visit `http://localhost:3000` to access the dashboard.

## How to Use

### Step 1: Add Candidates

1. Go to **Candidates** tab
2. Enter name, hall ticket number, and date of birth
3. Click "Add Candidate"

### Step 2: Add Exams to Monitor

1. Go to **Exams** tab
2. Enter exam name and result portal URL
3. Click "Add Exam"

### Step 3: Enroll Candidates

1. In **Exams** tab, click on an exam to expand
2. Select candidates you want to monitor for this exam
3. Click "Enroll" for each candidate

### Step 4: Add Notification Contacts

1. Go to **Contacts** tab
2. Select notification type (Email, SMS, or WhatsApp)
3. Enter contact information
4. Click "Add Contact"

### Step 5: Configure Automation

1. Go to **Automation** tab
2. Set check interval (default: 60 minutes)
3. Click "Start Automation"

### Step 6: Monitor Results

1. Go to **Results** tab to see all notifications
2. View screenshots and check delivery status
3. Download or preview result screenshots

## How It Works

### Automation Flow

1. **Cron Job** - Vercel crons trigger `/api/cron/check-results` every 15 minutes
2. **Check Interval** - If `next_scheduled_check` time has passed, the automation runs
3. **Result Checking** - System checks each result portal for enrolled candidates
4. **Result Detection** - When results are found:
   - Screenshot is captured (if available)
   - Notification is created for each contact
5. **Send Notifications** - Results are sent via configured channels
6. **Log Updates** - All activity is recorded in `notification_logs`

### Database Schema

```sql
-- Candidates
candidates (id, name, hall_ticket_number, date_of_birth, created_at)

-- Exams
exams (id, exam_name, result_portal_url, status, created_at)

-- Contacts
contacts (id, name, email, phone, whatsapp, contact_type, created_at)

-- Enrollments
exam_enrollments (exam_id, candidate_id)

-- Notifications
notification_logs (
  id, candidate_id, exam_id, contact_id,
  notification_type, result_detected_at, sent_at,
  status, error_message, screenshot_url
)

-- Settings
automation_settings (
  id, check_interval_minutes, is_active,
  last_checked, next_scheduled_check
)
```

## API Endpoints

### Check Results
- **POST** `/api/cron/check-results` - Manual trigger (requires CRON_SECRET)

### Notifications
- **POST** `/api/notifications/email` - Send email
- **POST** `/api/notifications/sms` - Send SMS
- **POST** `/api/notifications/whatsapp` - Send WhatsApp

## Integrating Notification Services

### Email (Resend)

1. Get API key from [resend.com](https://resend.com)
2. Add to `.env.local`:
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ```
3. Update `/lib/services/notifications.ts` sendEmail() function

### SMS (Twilio)

1. Create Twilio account at [twilio.com](https://twilio.com)
2. Get credentials and phone number
3. Add to `.env.local`:
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxx
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
   ```
4. Update `/lib/services/notifications.ts` sendSMS() function

### WhatsApp (Twilio)

1. Set up WhatsApp in Twilio dashboard
2. Get WhatsApp number
3. Add to `.env.local`:
   ```env
   TWILIO_WHATSAPP_NUMBER=+1XXXXXXXXXX
   ```
4. Update `/lib/services/notifications.ts` sendWhatsApp() function

## Result Portal Integration

To check results from a specific exam portal:

1. Update `/lib/automation/result-checker.ts` checkResultPortal() function
2. Implement portal-specific logic:
   - Use Puppeteer/Playwright for web scraping
   - Call official APIs if available
   - Handle authentication
   - Parse response for result availability

Example:
```typescript
async function checkResultPortal(
  url: string,
  hallTicket: string,
  dob: string
): Promise<boolean> {
  // Implement portal-specific checking logic
  // Return true if result is available
}
```

## Screenshot Capture

To capture result screenshots:

1. Install Puppeteer:
   ```bash
   pnpm add puppeteer
   ```

2. Update `/lib/automation/result-checker.ts` captureResultScreenshot()

3. Upload to Vercel Blob or other storage:
   ```typescript
   import { put } from '@vercel/blob';
   
   const { url } = await put(`screenshots/${id}.png`, buffer);
   return url;
   ```

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository in Vercel
3. Add environment variables in project settings
4. Deploy

### Enable Cron Jobs

The `vercel.json` already contains cron configuration:
```json
{
  "crons": [{
    "path": "/api/cron/check-results",
    "schedule": "*/15 * * * *"
  }]
}
```

This runs every 15 minutes. Adjust the schedule as needed.

## Troubleshooting

### Results not checking?

1. Check if automation is active (Automation tab)
2. Verify cron secret is set correctly
3. Check `/api/cron/check-results` endpoint logs
4. Ensure database has exam enrollments

### Notifications not sending?

1. Verify API keys are set in environment
2. Check notification logs for error messages (Results tab)
3. Test API endpoints with curl:
   ```bash
   curl -X POST http://localhost:3000/api/notifications/email \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","candidateName":"John","examName":"JEE"}'
   ```

### Database issues?

1. Verify Supabase credentials
2. Check table existence: `select * from candidates;`
3. Review RLS policies if using row-level security

## Performance Tips

- Set check interval to 30-60 minutes for faster results without overload
- Use SMS for critical updates (faster than email)
- Archive old notification logs periodically
- Use database indexes on frequently searched columns

## Security

- Never commit `.env.local`
- Use CRON_SECRET to protect automation endpoint
- Implement RLS on Supabase tables if needed
- Validate all user inputs
- Don't expose API keys in client-side code

## Support

For issues or questions:
1. Check logs in `/user_read_only_context/v0_debug_logs.log`
2. Review database schema in Supabase console
3. Test API endpoints individually

## License

MIT
