'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import CandidatesTab from '@/components/tabs/CandidatesTab';
import ExamsTab from '@/components/tabs/ExamsTab';
import ContactsTab from '@/components/tabs/ContactsTab';
import AutomationTab from '@/components/tabs/AutomationTab';
import ResultsTab from '@/components/tabs/ResultsTab';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('candidates');
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Exam Results Monitor</h1>
              <p className="text-muted-foreground mt-2">
                Automated result checking and instant notifications
              </p>
            </div>
            <Badge className="h-fit" variant="outline">
              Active
            </Badge>
          </div>
        </div>

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="candidates">Candidates</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="automation">Automation</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <div className="mt-6">
            <TabsContent value="candidates">
              <CandidatesTab />
            </TabsContent>

            <TabsContent value="exams">
              <ExamsTab />
            </TabsContent>

            <TabsContent value="contacts">
              <ContactsTab />
            </TabsContent>

            <TabsContent value="automation">
              <AutomationTab />
            </TabsContent>

            <TabsContent value="results">
              <ResultsTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
