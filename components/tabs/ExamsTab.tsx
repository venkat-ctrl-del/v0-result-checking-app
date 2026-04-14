'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2 } from 'lucide-react';
import { addExam, getExams, deleteExam, updateExam, enrollCandidate, getEnrollments } from '@/lib/db/exams';
import { getCandidates } from '@/lib/db/candidates';
import { Spinner } from '@/components/ui/spinner';

interface Exam {
  id: string;
  exam_name: string;
  result_portal_url: string;
  status: 'pending' | 'announced' | 'active';
  created_at: string;
}

interface Candidate {
  id: string;
  name: string;
  hall_ticket_number: string;
}

interface Enrollment {
  exam_id: string;
  candidate_id: string;
}

export default function ExamsTab() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [formData, setFormData] = useState({
    exam_name: '',
    result_portal_url: '',
    status: 'pending' as const,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [expandedExamId, setExpandedExamId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [examsData, candidatesData, enrollmentsData] = await Promise.all([
        getExams(),
        getCandidates(),
        getEnrollments(),
      ]);
      setExams(examsData);
      setCandidates(candidatesData);
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.exam_name || !formData.result_portal_url) {
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await updateExam(editingId, formData);
      } else {
        await addExam(formData);
      }
      setFormData({ exam_name: '', result_portal_url: '', status: 'pending' });
      setEditingId(null);
      await fetchData();
    } catch (error) {
      console.error('Error saving exam:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (exam: Exam) => {
    setFormData({
      exam_name: exam.exam_name,
      result_portal_url: exam.result_portal_url,
      status: exam.status,
    });
    setEditingId(exam.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExam(id);
      await fetchData();
    } catch (error) {
      console.error('Error deleting exam:', error);
    }
  };

  const handleEnrollCandidate = async (examId: string, candidateId: string) => {
    try {
      await enrollCandidate(examId, candidateId);
      await fetchData();
    } catch (error) {
      console.error('Error enrolling candidate:', error);
    }
  };

  const isEnrolled = (examId: string, candidateId: string) => {
    return enrollments.some(e => e.exam_id === examId && e.candidate_id === candidateId);
  };

  const getEnrolledCount = (examId: string) => {
    return enrollments.filter(e => e.exam_id === examId).length;
  };

  const handleCancel = () => {
    setFormData({ exam_name: '', result_portal_url: '', status: 'pending' });
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {editingId ? 'Edit Exam' : 'Add New Exam'}
          </CardTitle>
          <CardDescription>
            Enter exam name and result portal URL for monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Exam Name (e.g., JEE Main 2025)"
                value={formData.exam_name}
                onChange={(e) => setFormData({ ...formData, exam_name: e.target.value })}
              />
              <Input
                placeholder="Result Portal URL"
                type="url"
                value={formData.result_portal_url}
                onChange={(e) => setFormData({ ...formData, result_portal_url: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting && <Spinner className="mr-2 h-4 w-4" />}
                {editingId ? 'Update' : 'Add'} Exam
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Exams List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Active Exams ({exams.length})</h3>
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Spinner className="h-5 w-5" />
            </CardContent>
          </Card>
        ) : exams.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground">No exams added yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add your first exam above</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-2">
            {exams.map((exam) => (
              <Card key={exam.id} className="p-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{exam.exam_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{exam.result_portal_url}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Badge
                        variant="outline"
                        className="capitalize"
                      >
                        {exam.status}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(exam)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(exam.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Candidate Enrollment Section */}
                  <div className="border-t pt-3">
                    <button
                      onClick={() => setExpandedExamId(expandedExamId === exam.id ? null : exam.id)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Candidates ({getEnrolledCount(exam.id)}) {expandedExamId === exam.id ? '▼' : '▶'}
                    </button>

                    {expandedExamId === exam.id && (
                      <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                        {candidates.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No candidates available</p>
                        ) : (
                          candidates.map((candidate) => (
                            <div
                              key={candidate.id}
                              className="flex items-center justify-between text-xs p-2 rounded bg-muted/50"
                            >
                              <span>{candidate.name}</span>
                              <Button
                                size="sm"
                                variant={isEnrolled(exam.id, candidate.id) ? 'default' : 'outline'}
                                onClick={() => handleEnrollCandidate(exam.id, candidate.id)}
                                className="h-6 px-2 text-xs"
                              >
                                {isEnrolled(exam.id, candidate.id) ? 'Enrolled' : 'Enroll'}
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
