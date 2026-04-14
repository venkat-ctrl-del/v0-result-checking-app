'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  contact_type: 'email' | 'sms' | 'whatsapp';
  created_at: string;
}

export async function getContacts(): Promise<Contact[]> {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }

  return data || [];
}

export async function addContact(contact: {
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  contact_type: 'email' | 'sms' | 'whatsapp';
}): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select()
    .single();

  if (error) {
    console.error('Error adding contact:', error);
    throw error;
  }

  return data;
}

export async function updateContact(
  id: string,
  contact: {
    name: string;
    email?: string;
    phone?: string;
    whatsapp?: string;
    contact_type: 'email' | 'sms' | 'whatsapp';
  }
): Promise<Contact> {
  const { data, error } = await supabase
    .from('contacts')
    .update(contact)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating contact:', error);
    throw error;
  }

  return data;
}

export async function deleteContact(id: string): Promise<void> {
  const { error } = await supabase.from('contacts').delete().eq('id', id);

  if (error) {
    console.error('Error deleting contact:', error);
    throw error;
  }
}
