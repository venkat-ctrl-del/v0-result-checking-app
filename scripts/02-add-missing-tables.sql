-- Add automation_settings table
CREATE TABLE IF NOT EXISTS automation_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  check_interval_minutes INTEGER NOT NULL DEFAULT 60,
  is_active BOOLEAN DEFAULT TRUE,
  last_check_time TIMESTAMP WITH TIME ZONE,
  next_check_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(exam_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_automation_settings_exam_id ON automation_settings(exam_id);
CREATE INDEX IF NOT EXISTS idx_automation_settings_next_check ON automation_settings(next_check_time);

-- Update notification_logs to include exam and candidate details through enrollment
ALTER TABLE notification_logs ADD COLUMN IF NOT EXISTS exam_name TEXT;
ALTER TABLE notification_logs ADD COLUMN IF NOT EXISTS candidate_name TEXT;
ALTER TABLE notification_logs ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE notification_logs ADD COLUMN IF NOT EXISTS result_detected_at TIMESTAMP WITH TIME ZONE;
