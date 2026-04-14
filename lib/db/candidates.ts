'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Candidate {
  id: string;
  name: string;
  hall_ticket_number: string;
  date_of_birth: string;
  created_at: string;
}

export async function getCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }

  return data || [];
}

export async function addCandidate(candidate: {
  name: string;
  hall_ticket_number: string;
  date_of_birth: string;
}): Promise<Candidate> {
  const { data, error } = await supabase
    .from('candidates')
    .insert([candidate])
    .select()
    .single();

  if (error) {
    console.error('Error adding candidate:', error);
    throw error;
  }

  return data;
}

export async function updateCandidate(
  id: string,
  candidate: {
    name: string;
    hall_ticket_number: string;
    date_of_birth: string;
  }
): Promise<Candidate> {
  const { data, error } = await supabase
    .from('candidates')
    .update(candidate)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating candidate:', error);
    throw error;
  }

  return data;
}

export async function deleteCandidate(id: string): Promise<void> {
  const { error } = await supabase.from('candidates').delete().eq('id', id);

  if (error) {
    console.error('Error deleting candidate:', error);
    throw error;
  }
}
