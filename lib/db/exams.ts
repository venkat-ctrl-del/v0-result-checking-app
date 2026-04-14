'use server';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Exam {
  id: string;
  exam_name: string;
  result_portal_url: string;
  status: 'pending' | 'announced' | 'active';
  created_at: string;
}

export interface ExamEnrollment {
  exam_id: string;
  candidate_id: string;
}

export async function getExams(): Promise<Exam[]> {
  const { data, error } = await supabase
    .from('exams')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching exams:', error);
    throw error;
  }

  return data || [];
}

export async function addExam(exam: {
  exam_name: string;
  result_portal_url: string;
  status: 'pending' | 'announced' | 'active';
}): Promise<Exam> {
  const { data, error } = await supabase
    .from('exams')
    .insert([exam])
    .select()
    .single();

  if (error) {
    console.error('Error adding exam:', error);
    throw error;
  }

  return data;
}

export async function updateExam(
  id: string,
  exam: {
    exam_name: string;
    result_portal_url: string;
    status: 'pending' | 'announced' | 'active';
  }
): Promise<Exam> {
  const { data, error } = await supabase
    .from('exams')
    .update(exam)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating exam:', error);
    throw error;
  }

  return data;
}

export async function deleteExam(id: string): Promise<void> {
  const { error } = await supabase.from('exams').delete().eq('id', id);

  if (error) {
    console.error('Error deleting exam:', error);
    throw error;
  }
}

export async function getEnrollments(): Promise<ExamEnrollment[]> {
  const { data, error } = await supabase
    .from('exam_enrollments')
    .select('exam_id, candidate_id');

  if (error) {
    console.error('Error fetching enrollments:', error);
    throw error;
  }

  return data || [];
}

export async function enrollCandidate(examId: string, candidateId: string): Promise<void> {
  // Check if already enrolled
  const { data: existing } = await supabase
    .from('exam_enrollments')
    .select('*')
    .eq('exam_id', examId)
    .eq('candidate_id', candidateId)
    .single();

  if (existing) {
    // Delete enrollment
    const { error } = await supabase
      .from('exam_enrollments')
      .delete()
      .eq('exam_id', examId)
      .eq('candidate_id', candidateId);

    if (error) {
      console.error('Error removing enrollment:', error);
      throw error;
    }
  } else {
    // Add enrollment
    const { error } = await supabase
      .from('exam_enrollments')
      .insert([{ exam_id: examId, candidate_id: candidateId }]);

    if (error) {
      console.error('Error enrolling candidate:', error);
      throw error;
    }
  }
}
