-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hall_ticket_number TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  candidate_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exams table
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_name TEXT NOT NULL,
  result_url TEXT NOT NULL,
  check_interval_minutes INTEGER NOT NULL DEFAULT 60,
  last_checked_at TIMESTAMP WITH TIME ZONE,
  result_announced BOOLEAN DEFAULT FALSE,
  result_announced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  whatsapp_number TEXT,
  platform TEXT NOT NULL CHECK (platform IN ('email', 'sms', 'whatsapp')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exam enrollments (linking candidates to exams)
CREATE TABLE IF NOT EXISTS exam_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  notification_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(candidate_id, exam_id)
);

-- Notification logs table
CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_enrollment_id UUID NOT NULL REFERENCES exam_enrollments(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('email', 'sms', 'whatsapp')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
  result_screenshot_url TEXT,
  error_message TEXT,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_exam_enrollments_candidate_id ON exam_enrollments(candidate_id);
CREATE INDEX IF NOT EXISTS idx_exam_enrollments_exam_id ON exam_enrollments(exam_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_exam_enrollment_id ON notification_logs(exam_enrollment_id);
CREATE INDEX IF NOT EXISTS idx_notification_logs_status ON notification_logs(status);
CREATE INDEX IF NOT EXISTS idx_exams_last_checked ON exams(last_checked_at);
CREATE INDEX IF NOT EXISTS idx_exams_result_announced ON exams(result_announced);
