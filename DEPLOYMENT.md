# Exam Results Monitor - Complete Deployment & Setup Guide

## 🚀 Quick Start (5 Minutes)

### 1. **Connect Supabase Integration**
The app requires Supabase for database operations.

- Click **Settings** (⚙️) in the top right corner
- Go to **Integrations** tab
- Find **Supabase** and click **Connect**
- Follow the prompts to authorize your Supabase account
- The database tables will be automatically created

### 2. **Set Up Notification Services**

To enable result notifications, you'll need API keys for:

#### **Email Notifications (Resend)**
1. Visit [resend.com](https://resend.com)
2. Create a free account
3. Get your API key from the dashboard
4. In v0 Settings → Vars, add:
   - Key: `RESEND_API_KEY`
   - Value: Your Resend API key

#### **SMS & WhatsApp (Twilio)**
1. Visit [twilio.com](https://twilio.com)
2. Create a free account (includes free trial credit)
3. Get your Account SID and Auth Token from the console
4. Get a Twilio phone number
5. In v0 Settings → Vars, add:
   - `TWILIO_ACCOUNT_SID`: Your account SID
   - `TWILIO_AUTH_TOKEN`: Your auth token
   - `TWILIO_PHONE_NUMBER`: Your Twilio phone number

**Note:** You can start using the app with just Supabase connected. Notification services are optional but recommended.

---

## 📋 Setup Instructions (Step-by-Step)

### Step 1: Deploy to Vercel
The easiest way to get this app live:

1. Click **Publish** button in top-right corner
2. Follow the prompts to connect to GitHub (or deploy without GitHub)
3. Your app will be live in 2-3 minutes
4. You'll get a public URL (e.g., `yourapp.vercel.app`)

### Step 2: Configure Integrations

#### A. **Supabase Setup** (Required)
```
Settings → Integrations → Supabase → Connect
```
The system will:
- Create all necessary tables automatically
- Set up the database schema
- Configure environment variables

#### B. **Environment Variables**

Click **Settings** → **Vars** and add:

```
# Supabase (Auto-added by integration)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend (for email notifications)
RESEND_API_KEY=your_resend_api_key

# Twilio (for SMS & WhatsApp)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
```

---

## 🎯 How to Use the App

### 1. **Add Candidates**
Go to **Candidates** tab:
- Enter full name
- Enter hall ticket number
- Enter date of birth
- Click **Add Candidate**

### 2. **Add Exams**
Go to **Exams** tab:
- Enter exam name (e.g., "JEE Main 2025")
- Enter result portal URL
- Click **Add Exam**
- Click the arrow next to the exam to enroll candidates

### 3. **Add Contacts**
Go to **Contacts** tab:
- Enter contact name
- Select notification type (Email, SMS, WhatsApp)
- Enter contact details
- Click **Add Contact**

**Supported formats:**
- Email: `example@gmail.com`
- SMS: `+91XXXXXXXXXX` (with country code)
- WhatsApp: `+91XXXXXXXXXX` (with country code)

### 4. **Configure Automation**
Go to **Automation** tab:
- Set check interval (1-1440 minutes)
- Or use quick presets (15 min, 30 min, 1 hour, etc.)
- Click **Start Automation**

The system will now:
- Check for results at your specified interval
- Capture screenshots when results are available
- Send notifications to all configured contacts

### 5. **Monitor Results**
Go to **Results** tab to see:
- All detected results and notifications
- Status of each notification (sent/failed/pending)
- Screenshot previews
- Download results
- Filter by status

---

## 🔧 Technical Architecture

### Database Schema

**Tables:**
- `candidates` - Student information
- `exams` - Exam details with portal URLs
- `contacts` - Notification contacts
- `exam_enrollments` - Which candidates are taking which exams
- `automation_settings` - Automation configuration
- `notification_logs` - Records of all sent notifications

### API Endpoints

- `POST /api/notifications/email` - Send email notifications
- `POST /api/notifications/sms` - Send SMS notifications
- `POST /api/notifications/whatsapp` - Send WhatsApp messages
- `GET /api/cron/check-results` - Cron job that checks results

### Automation Flow

```
Vercel Cron Job (every 15 min)
    ↓
Check exam portals for results
    ↓
If results found:
    - Capture screenshot
    - Log result
    ↓
Send notifications to all contacts:
    - Email via Resend
    - SMS via Twilio
    - WhatsApp via Twilio
```

---

## 📱 Cost Breakdown

**Free/Included:**
- Supabase: 500MB free database
- Vercel: Free deployment
- Twilio: Free trial with $15 credit (~30 SMS/WhatsApp)
- Resend: Free tier (1,000 emails/day)

**Estimated Monthly Cost (with moderate use):**
- ~$5-10 if using SMS/WhatsApp beyond free credits
- Email notifications are essentially free

---

## 🐛 Troubleshooting

### **"Supabase not connected" error**
- Go to Settings → Integrations
- Make sure Supabase is connected
- Click "Connect" if needed
- Refresh the page after connecting

### **Notifications not sending**
- Verify API keys are added in Settings → Vars
- Check notification service (Resend/Twilio) is working
- Check Results tab for error messages

### **Results not being checked**
- Make sure automation is started in Automation tab
- Verify result portal URL is correct
- Check that candidates are enrolled in the exam

### **"Invalid phone number" for SMS/WhatsApp**
- Use international format: `+[country code][number]`
- Example: `+91 98765 43210` → `+919876543210`
- Remove spaces and special characters

---

## 🚀 Advanced Configuration

### Custom Check Intervals
You can set any interval from 1 to 1440 minutes (24 hours).

**Recommendations:**
- **15-30 minutes**: High priority, frequent checks needed
- **1-2 hours**: Balanced approach (default 60 min)
- **4-6 hours**: Low priority, less urgent exams

### Result Portal URL Format
The result portal URL should be a direct link to:
- The result checking page
- A page containing the result status
- Example: `https://example.com/results?roll=123456`

### Batch Notifications
When results are detected:
1. System takes a screenshot
2. Logs the result in database
3. Sends to ALL enrolled candidates
4. Sends to ALL configured contacts
5. Retry failed notifications

---

## 📞 Support & Resources

**Common Issues:**
- Database not syncing → Refresh browser and clear cache
- Notifications delayed → Check automation status
- UI not updating → Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

**To Edit or Deploy:**
1. Make changes in v0
2. Click "Publish" to deploy to Vercel
3. Changes go live in 2-3 minutes

**To Download Code:**
1. Click three dots (⋯) in top-right
2. Click "Download ZIP"
3. Install locally with: `npx shadcn-cli@latest init`

---

## ✅ Checklist Before Going Live

- [ ] Supabase connected
- [ ] At least one candidate added
- [ ] At least one exam added (with portal URL)
- [ ] At least one contact added
- [ ] Notification service credentials added (email/SMS/WhatsApp)
- [ ] Automation interval set
- [ ] Automation started
- [ ] Test by checking Results tab after a few minutes

---

## 🎉 You're All Set!

Your exam result automation system is ready to use. The app will now:
- ✅ Automatically check for exam results
- ✅ Capture screenshots when results are available
- ✅ Send instant notifications to your contacts
- ✅ Track all notifications in the results dashboard

**Happy monitoring!** 🚀
