'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface AutomationSettings {
  id: string;
  check_interval_minutes: number;
  is_active: boolean;
  last_checked?: string;
  next_scheduled_check?: string;
  created_at: string;
  updated_at: string;
}

export async function getAutomationSettings(): Promise<AutomationSettings | null> {
  const { data, error } = await supabase
    .from('automation_settings')
    .select('*')
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching automation settings:', error);
    throw error;
  }

  if (!data) {
    // Create default settings if none exist
    return await createDefaultSettings();
  }

  return data;
}

async function createDefaultSettings(): Promise<AutomationSettings> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('automation_settings')
    .insert([
      {
        check_interval_minutes: 60,
        is_active: false,
        last_checked: null,
        next_scheduled_check: null,
        created_at: now,
        updated_at: now,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating default settings:', error);
    throw error;
  }

  return data;
}

export async function updateAutomationSettings(updates: {
  check_interval_minutes?: number;
  is_active?: boolean;
  last_checked?: string | null;
  next_scheduled_check?: string | null;
}): Promise<AutomationSettings> {
  const current = await getAutomationSettings();
  if (!current) {
    throw new Error('Failed to get automation settings');
  }

  const { data, error } = await supabase
    .from('automation_settings')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', current.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating automation settings:', error);
    throw error;
  }

  return data;
}

export async function startAutomation(): Promise<void> {
  const settings = await getAutomationSettings();
  if (!settings) {
    throw new Error('Failed to get automation settings');
  }

  const now = new Date();
  const nextCheck = new Date(now.getTime() + settings.check_interval_minutes * 60 * 1000);

  await updateAutomationSettings({
    is_active: true,
    last_checked: null,
    next_scheduled_check: nextCheck.toISOString(),
  });
}

export async function stopAutomation(): Promise<void> {
  await updateAutomationSettings({
    is_active: false,
    next_scheduled_check: null,
  });
}

export async function recordCheck(): Promise<void> {
  const settings = await getAutomationSettings();
  if (!settings) {
    throw new Error('Failed to get automation settings');
  }

  const now = new Date();
  const nextCheck = new Date(now.getTime() + settings.check_interval_minutes * 60 * 1000);

  await updateAutomationSettings({
    last_checked: now.toISOString(),
    next_scheduled_check: nextCheck.toISOString(),
  });
}
