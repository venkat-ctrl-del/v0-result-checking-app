'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface NotificationLog {
  id: string;
  candidate_id: string;
  exam_id: string;
  contact_id: string;
  notification_type: 'email' | 'sms' | 'whatsapp';
  result_detected_at: string;
  sent_at?: string;
  status: 'pending' | 'sent' | 'failed';
  error_message?: string;
  screenshot_url?: string;
  candidate_name?: string;
  exam_name?: string;
  contact_name?: string;
}

export async function getNotificationLogs(): Promise<NotificationLog[]> {
  const { data, error } = await supabase
    .from('notification_logs')
    .select(
      `*,
       candidates(name),
       exams(exam_name),
       contacts(name)`
    )
    .order('result_detected_at', { ascending: false });

  if (error) {
    console.error('Error fetching notification logs:', error);
    throw error;
  }

  return (data || []).map((log: any) => ({
    ...log,
    candidate_name: log.candidates?.name,
    exam_name: log.exams?.exam_name,
    contact_name: log.contacts?.name,
  }));
}

export async function addNotificationLog(log: {
  candidate_id: string;
  exam_id: string;
  contact_id: string;
  notification_type: 'email' | 'sms' | 'whatsapp';
  result_detected_at: string;
  status?: 'pending' | 'sent' | 'failed';
  screenshot_url?: string;
}): Promise<NotificationLog> {
  const { data, error } = await supabase
    .from('notification_logs')
    .insert([
      {
        ...log,
        status: log.status || 'pending',
      },
    ])
    .select(
      `*,
       candidates(name),
       exams(exam_name),
       contacts(name)`
    )
    .single();

  if (error) {
    console.error('Error adding notification log:', error);
    throw error;
  }

  return {
    ...data,
    candidate_name: data.candidates?.name,
    exam_name: data.exams?.exam_name,
    contact_name: data.contacts?.name,
  };
}

export async function updateNotificationLog(
  id: string,
  updates: {
    sent_at?: string;
    status?: 'pending' | 'sent' | 'failed';
    error_message?: string;
  }
): Promise<NotificationLog> {
  const { data, error } = await supabase
    .from('notification_logs')
    .update(updates)
    .eq('id', id)
    .select(
      `*,
       candidates(name),
       exams(exam_name),
       contacts(name)`
    )
    .single();

  if (error) {
    console.error('Error updating notification log:', error);
    throw error;
  }

  return {
    ...data,
    candidate_name: data.candidates?.name,
    exam_name: data.exams?.exam_name,
    contact_name: data.contacts?.name,
  };
}

export async function getRecentLogs(minutes: number = 1440): Promise<NotificationLog[]> {
  const since = new Date(Date.now() - minutes * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('notification_logs')
    .select(
      `*,
       candidates(name),
       exams(exam_name),
       contacts(name)`
    )
    .gte('result_detected_at', since)
    .order('result_detected_at', { ascending: false });

  if (error) {
    console.error('Error fetching recent logs:', error);
    throw error;
  }

  return (data || []).map((log: any) => ({
    ...log,
    candidate_name: log.candidates?.name,
    exam_name: log.exams?.exam_name,
    contact_name: log.contacts?.name,
  }));
}
