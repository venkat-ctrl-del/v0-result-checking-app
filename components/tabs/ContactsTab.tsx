'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit2 } from 'lucide-react';
import { addContact, getContacts, deleteContact, updateContact } from '@/lib/db/contacts';
import { Spinner } from '@/components/ui/spinner';

interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  contact_type: 'email' | 'sms' | 'whatsapp';
  created_at: string;
}

export default function ContactsTab() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    contact_type: 'email' as const,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await getContacts();
      setContacts(data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    // Validate based on contact type
    const hasValidContact =
      (formData.contact_type === 'email' && formData.email) ||
      (formData.contact_type === 'sms' && formData.phone) ||
      (formData.contact_type === 'whatsapp' && formData.whatsapp);

    if (!hasValidContact) return;

    try {
      setSubmitting(true);
      const submitData = {
        name: formData.name,
        email: formData.contact_type === 'email' ? formData.email : undefined,
        phone: formData.contact_type === 'sms' ? formData.phone : undefined,
        whatsapp: formData.contact_type === 'whatsapp' ? formData.whatsapp : undefined,
        contact_type: formData.contact_type,
      };

      if (editingId) {
        await updateContact(editingId, submitData);
      } else {
        await addContact(submitData);
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        whatsapp: '',
        contact_type: 'email',
      });
      setEditingId(null);
      await fetchContacts();
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (contact: Contact) => {
    setFormData({
      name: contact.name,
      email: contact.email || '',
      phone: contact.phone || '',
      whatsapp: contact.whatsapp || '',
      contact_type: contact.contact_type,
    });
    setEditingId(contact.id);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContact(id);
      await fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      whatsapp: '',
      contact_type: 'email',
    });
    setEditingId(null);
  };

  const getContactDisplay = (contact: Contact) => {
    if (contact.contact_type === 'email') return contact.email;
    if (contact.contact_type === 'sms') return contact.phone;
    if (contact.contact_type === 'whatsapp') return contact.whatsapp;
    return '';
  };

  return (
    <div className="space-y-4">
      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {editingId ? 'Edit Contact' : 'Add New Contact'}
          </CardTitle>
          <CardDescription>
            Add contacts for result notifications via Email, SMS, or WhatsApp
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Contact Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <select
                value={formData.contact_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contact_type: e.target.value as 'email' | 'sms' | 'whatsapp',
                  })
                }
                className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
              >
                <option value="email">Email</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
              </select>
            </div>

            {/* Conditional Input Based on Type */}
            {formData.contact_type === 'email' && (
              <Input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            )}

            {formData.contact_type === 'sms' && (
              <Input
                type="tel"
                placeholder="Phone Number (with country code, e.g., +91XXXXXXXXXX)"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            )}

            {formData.contact_type === 'whatsapp' && (
              <Input
                type="tel"
                placeholder="WhatsApp Number (with country code, e.g., +91XXXXXXXXXX)"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            )}

            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting && <Spinner className="mr-2 h-4 w-4" />}
                {editingId ? 'Update' : 'Add'} Contact
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

      {/* Contacts List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Your Contacts ({contacts.length})</h3>
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-8">
              <Spinner className="h-5 w-5" />
            </CardContent>
          </Card>
        ) : contacts.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground">No contacts added yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Add contacts to receive result notifications
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-2">
            {contacts.map((contact) => (
              <Card key={contact.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{contact.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="capitalize text-xs">
                        {contact.contact_type}
                      </Badge>
                      <p className="text-xs text-muted-foreground truncate">
                        {getContactDisplay(contact)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(contact)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(contact.id)}
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
