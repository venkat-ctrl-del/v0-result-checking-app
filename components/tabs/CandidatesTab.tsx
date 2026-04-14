'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Edit2 } from 'lucide-react';
import { addCandidate, getCandidates, deleteCandidate, updateCandidate } from '@/lib/db/candidates';
import { Spinner } from '@/components/ui/spinner';

interface Candidate {
  id: string;
  name: string;
  hall_ticket_number: string;
  date_of_birth: string;
  created_at: string;
}

export default function CandidatesTab() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    hall_ticket_number: '',
    date_of_birth: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const data = await getCandidates();
      setCandidates(data);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.hall_ticket_number || !formData.date_of_birth) {
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await updateCandidate(editingId, formData);
      } else {
        await addCandidate(formData);
      }
      setFormData({ name: '', hall_ticket_number: '', date_of_birth: '' });
      setEditingId(null);
      await fetchCandidates();
    } catch (error) {
      console.error('Error saving candidate:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (candidate: Candidate) => {
    setFormData({
      name: candidate.name,
      hall_ticket_number: candidate.hall_ticket_number,
      date_of_birth: candidate.date_of_birth,
    });
    setEditingId(candidate.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCandidate(id);
      await fetchCandidates();
    } catch (error) {
      console.error('Error deleting candidate:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', hall_ticket_number: '', date_of_birth: '' });
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {editingId ? 'Edit Candidate' : 'Add New Candidate'}
          </CardTitle>
          <CardDescription>
            Enter hall ticket number and date of birth for automatic result checking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <Input
                placeholder="Hall Ticket Number"
                value={formData.hall_ticket_number}
                onChange={(e) =>
                  setFormData({ ...formData, hall_ticket_number: e.target.value })
                }
              />
              <Input
                type="date"
                value={formData.date_of_birth}
                onChange={(e) =>
                  setFormData({ ...formData, date_of_birth: e.target.value })
                }
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting && <Spinner className="mr-2 h-4 w-4" />}
                {editingId ? 'Update' : 'Add'} Candidate
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

      {/* Candidates List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Your Candidates ({candidates.length})</h3>
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Spinner className="h-5 w-5" />
            </CardContent>
          </Card>
        ) : candidates.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground">No candidates added yet</p>
                <p className="text-xs text-muted-foreground mt-1">Add your first candidate above</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-2">
            {candidates.map((candidate) => (
              <Card key={candidate.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {candidate.hall_ticket_number} • {new Date(candidate.date_of_birth).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(candidate)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(candidate.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
