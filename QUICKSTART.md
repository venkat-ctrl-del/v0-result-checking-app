# Quick Start Guide - 10 Minutes to Live ⚡

## 🎯 The Fastest Way to Get Your App Running

### Minute 1-2: Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with email
4. Create a new project:
   - Name: `exam-monitor`
   - Password: Choose strong password
   - Region: Pick closest to you
5. Click "Create new project"
6. **WAIT** - project is creating (2-3 mins)

### Minute 3-4: Get Your Supabase Keys

1. Once Supabase dashboard loads, go to **Settings** → **API**
2. Copy these two values:
   ```
   NEXT_PUBLIC_SUPABASE_URL = [Project URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [anon public]
   ```
3. Save them somewhere safe (you'll need them soon)

### Minute 5-6: Create Database Tables

1. In Supabase, go to **SQL Editor**
2. Create new query
3. Copy-paste this SQL:

```sql
-- Create candidates table
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  hall_ticket_number TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Create exams table
CREATE TABLE exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_name TEXT NOT NULL,
  result_portal_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

-- Create contacts table
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  contact_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Create exam_enrollments table
CREATE TABLE exam_enrollments (
  exam_id UUID REFERENCES exams(id),
  candidate_id UUID REFERENCES candidates(id),
  PRIMARY KEY (exam_id, candidate_id)
);

-- Create automation_settings table
CREATE TABLE automation_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_interval_minutes INT DEFAULT 60,
  is_active BOOLEAN DEFAULT false,
  last_checked TIMESTAMP,
  next_scheduled_check TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create notification_logs table
CREATE TABLE notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES candidates(id),
  exam_id UUID REFERENCES exams(id),
  contact_id UUID REFERENCES contacts(id),
  notification_type TEXT NOT NULL,
  result_detected_at TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,
  status TEXT DEFAULT 'pending',
  error_message TEXT,
  screenshot_url TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

4. Click **Run**
5. Tables are now created ✅

### Minute 7-8: Publish to Vercel

1. In v0, click **Publish** button (top-right)
2. Choose "Deploy with GitHub" or "Deploy without GitHub"
3. Authorize Vercel
4. Give your project a name
5. Click **Create & Deploy**
6. **WAIT** - app deploying (2-3 mins)
7. You'll get a URL like: `https://exam-monitor.vercel.app`

### Minute 9: Add Environment Variables

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click your project
3. Go to **Settings** → **Environment Variables**
4. Add these:
   ```
   NEXT_PUBLIC_SUPABASE_URL = [copy from step 4]
   NEXT_PUBLIC_SUPABASE_ANON_KEY = [copy from step 4]
   ```
5. Click **Save**

### Minute 10: Redeploy with Variables

1. Go to **Deployments** tab
2. Click latest deployment
3. Click "Redeploy"
4. Wait 1 minute...
5. **YOU'RE LIVE!** 🎉

---

## 🎮 First 2 Minutes Using the App

### Add Your First Candidate
1. Click **Candidates** tab
2. Fill in:
   - Name: `John Doe`
   - Hall Ticket: `12345678`
   - DOB: `2002-01-15`
3. Click **Add Candidate**
4. ✅ Candidate appears in list!

### Add Your First Exam
1. Click **Exams** tab
2. Fill in:
   - Exam Name: `JEE Main 2025`
   - Portal URL: `https://example.com/results`
3. Click **Add Exam**
4. Click the dropdown arrow next to exam
5. Click "Enroll" next to your candidate
6. ✅ Candidate enrolled!

### Add Your First Contact
1. Click **Contacts** tab
2. Fill in:
   - Name: `My Email`
   - Type: `Email`
   - Email: `your.email@gmail.com`
3. Click **Add Contact**
4. ✅ Contact added!

### Start Automation
1. Click **Automation** tab
2. Click "1 hour" preset button
3. Click **Start Automation**
4. ✅ Monitoring started!

### Watch Results
1. Click **Results** tab
2. Should see "No results detected yet"
3. When results are detected, you'll see them here!

---

## 📧 Optional: Add Email Notifications

To actually receive notifications, add Resend:

1. Visit [resend.com](https://resend.com)
2. Sign up with email
3. Go to **API Keys**
4. Create API key
5. Copy the key
6. In Vercel dashboard, add environment variable:
   ```
   RESEND_API_KEY = [your key]
   ```
7. Redeploy

Now when results are detected, you'll get email notifications! ✉️

---

## ✅ You're All Set!

Your exam results monitor is now:
- ✅ Live on the internet
- ✅ Monitoring exam results
- ✅ Ready to notify you

### What happens next:
1. App checks your exam portal every hour
2. When results are released, it detects them
3. Notifications sent to your contacts
4. You can see everything in the Results tab

---

## 🔗 Useful Links

- **Your App**: `https://exam-monitor.vercel.app` (replace with your actual URL)
- **Supabase Dashboard**: [supabase.com/dashboard](https://supabase.com/dashboard)
- **Vercel Dashboard**: [vercel.com/dashboard](https://vercel.com/dashboard)

---

## 🚨 Common Issues

| Issue | Fix |
|-------|-----|
| App shows blank page | Refresh page, check browser console |
| Can't add candidate | Check Supabase tables created correctly |
| Database error | Check SUPABASE_URL and KEY are correct |
| Results not checking | Make sure automation is started |

---

## 📚 Next Steps

Read these guides for more info:
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Full setup guide
- [PUBLISH.md](./PUBLISH.md) - Detailed publish instructions
- [README.md](./README.md) - Complete documentation

---

## 🎉 Congrats!

You've set up a production-ready exam monitoring system in under 10 minutes!

**Share your app URL with friends:**
`https://exam-monitor.vercel.app`

Enjoy! 🚀
