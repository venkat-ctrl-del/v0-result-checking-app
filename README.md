# Exam Results Monitor 📚

**Automatic exam result checking and instant notifications**

A minimalistic, fast, and efficient web app that automatically monitors exam result portals and sends instant notifications via Email, SMS, and WhatsApp when results are announced.

## 🌟 Features

✅ **Automatic Result Checking** - Periodically monitors result portals
✅ **Smart Notifications** - Email, SMS, and WhatsApp alerts
✅ **Screenshot Capture** - Automatically saves result screenshots
✅ **Customizable Intervals** - Check results 1 to 1440 minutes apart
✅ **Multi-Candidate Support** - Monitor multiple candidates simultaneously
✅ **Contact Management** - Add multiple contact channels
✅ **Result Tracking** - Complete history and status of all notifications
✅ **Minimalist UI** - Clean, fast, and easy to use interface

## 🚀 Quick Start

### 1. Clone or Download
Click the three dots (⋯) in v0 → Download ZIP to get the code

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
```

### 3. Set Up Supabase
- Create account at [supabase.com](https://supabase.com)
- Create a new project
- Copy your project credentials:
  ```
  NEXT_PUBLIC_SUPABASE_URL=your_url
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
  ```
- Add to `.env.local`

### 4. Add Notification Services (Optional)

**Email (Resend):**
```
RESEND_API_KEY=your_resend_key
```

**SMS & WhatsApp (Twilio):**
```
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890
```

### 5. Run Local Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## 📋 How to Use

### Setup (5 minutes)

1. **Add Candidates**
   - Go to "Candidates" tab
   - Enter name, hall ticket number, and DOB
   - Click "Add Candidate"

2. **Add Exams**
   - Go to "Exams" tab
   - Enter exam name and result portal URL
   - Expand exam and select candidates to enroll

3. **Add Contacts**
   - Go to "Contacts" tab
   - Select notification type (Email/SMS/WhatsApp)
   - Enter contact details

4. **Configure Automation**
   - Go to "Automation" tab
   - Set check interval (or use quick presets)
   - Click "Start Automation"

5. **Monitor Results**
   - Go to "Results" tab
   - View all notifications and screenshots
   - Download or preview results

### Daily Usage

The app runs automatically. Just check the Results tab periodically to see:
- ✅ Detected results
- 📧 Notifications sent
- ❌ Any failed notifications
- 📸 Result screenshots

## 🏗️ Project Structure

```
exam-results-monitor/
├── app/
│   ├── api/
│   │   ├── cron/check-results/     # Automation trigger
│   │   └── notifications/          # Email, SMS, WhatsApp endpoints
│   ├── page.tsx                    # Main dashboard
│   └── layout.tsx
├── components/
│   └── tabs/                       # 5 main tabs
│       ├── CandidatesTab.tsx
│       ├── ExamsTab.tsx
│       ├── ContactsTab.tsx
│       ├── AutomationTab.tsx
│       └── ResultsTab.tsx
├── lib/
│   ├── db/                         # Database operations
│   ├── services/                   # Notification services
│   └── automation/                 # Result checking engine
└── scripts/
    └── 01-init-schema.sql          # Database setup
```

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Notifications**: Resend (Email), Twilio (SMS/WhatsApp)
- **Automation**: Vercel Cron Jobs
- **UI Components**: shadcn/ui

## 📱 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/cron/check-results` | GET | Triggers result checking |
| `/api/notifications/email` | POST | Send email notification |
| `/api/notifications/sms` | POST | Send SMS notification |
| `/api/notifications/whatsapp` | POST | Send WhatsApp message |

## 🎯 How It Works

```
1. You set up candidates, exams, and contacts
2. You start automation with desired check interval
3. Every 15 minutes, Vercel cron job triggers check
4. System visits result portal URLs
5. If results detected:
   - Screenshot captured
   - Result logged in database
   - Notifications sent to all contacts
   - Status updated in Results tab
```

## 💡 Key Features

### 1. **Customizable Check Intervals**
- 1 to 1440 minutes
- Quick presets: 15 min, 30 min, 1 hour, 2 hours, 4 hours
- Adjust anytime without stopping automation

### 2. **Multi-Channel Notifications**
- **Email**: Via Resend (free tier available)
- **SMS**: Via Twilio (includes free trial credit)
- **WhatsApp**: Via Twilio

### 3. **Smart Enrollment**
- Enroll/unenroll candidates from exams
- Only enrolled candidates' results are monitored
- Easy management from Exams tab

### 4. **Complete Tracking**
- View all notifications sent
- See status: Sent, Pending, Failed
- Download result screenshots
- Filter by status

## 🔐 Security

- All data stored securely in Supabase
- API keys stored as environment variables
- No sensitive data exposed in frontend
- Server-side operations via Next.js Server Actions

## 📊 Cost Estimate

| Service | Free Tier | Cost |
|---------|-----------|------|
| Supabase | 500MB DB | Free |
| Vercel | 5000 invocations | Free |
| Resend | 1,000 emails/day | Free |
| Twilio | $15 trial credit | ~$0.007/SMS |

**Typical Monthly Cost**: $0-5 (for most users)

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. In v0, click **Publish** button
2. Follow prompts to authorize
3. Your app goes live in 2-3 minutes
4. Get a public URL

### Deploy Anywhere

```bash
npm run build
npm run start
```

Set environment variables in your hosting platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `RESEND_API_KEY`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

## 🐛 Troubleshooting

**Issue**: Results not being checked
- Solution: Verify automation is started and interval is set

**Issue**: Notifications not sending
- Solution: Check API keys are added in environment variables

**Issue**: Database connection error
- Solution: Verify Supabase credentials are correct

**Issue**: Phone number validation error
- Solution: Use international format `+[code][number]`

## 📝 License

MIT - Feel free to use for personal or commercial projects

## 💬 Support

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup
- Review the automation logs in Results tab
- Check browser console for error messages

## 🎉 Ready to Deploy?

1. ✅ Set up Supabase integration
2. ✅ Add environment variables
3. ✅ Click "Publish" to go live
4. ✅ Start adding candidates and exams

Your automated exam result system is ready! 🚀
