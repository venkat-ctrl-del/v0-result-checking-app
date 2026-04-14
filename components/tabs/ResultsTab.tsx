'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye } from 'lucide-react';
import { getNotificationLogs } from '@/lib/db/notifications';
import { Spinner } from '@/components/ui/spinner';

interface NotificationLog {
  id: string;
  candidate_id: string;
  exam_id: string;
  contact_id: string;
  notification_type: 'email' | 'sms' | 'whatsapp';
  result_detected_at: string;
  sent_at: string;
  status: 'pending' | 'sent' | 'failed';
  error_message?: string;
  screenshot_url?: string;
  candidate_name?: string;
  exam_name?: string;
  contact_name?: string;
}

export default function ResultsTab() {
  const [logs, setLogs] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'sent' | 'failed' | 'pending'>('all');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const data = await getNotificationLogs();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return '✉️';
      case 'sms':
        return '📱';
      case 'whatsapp':
        return '💬';
      default:
        return '📬';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'sent', 'failed', 'pending'] as const).map((status) => (
          <Button
            key={status}
            size="sm"
            variant={filter === status ? 'default' : 'outline'}
            onClick={() => setFilter(status)}
            className="capitalize"
          >
            {status}
          </Button>
        ))}
      </div>

      {/* Logs List */}
      {loading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <Spinner className="h-5 w-5" />
          </CardContent>
        </Card>
      ) : filteredLogs.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground">
                {logs.length === 0
                  ? 'No results detected yet'
                  : `No ${filter} notifications`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Results will appear here when detected and notifications are sent
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filteredLogs.map((log) => (
            <Card key={log.id} className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{getNotificationTypeIcon(log.notification_type)}</span>
                      <p className="font-medium">{log.candidate_name}</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">{log.exam_name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Sent to: {log.contact_name}
                    </p>
                  </div>
                  <Badge className={`capitalize ${getStatusColor(log.status)}`}>
                    {log.status}
                  </Badge>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground">Result Detected</p>
                    <p className="font-medium">{formatDate(log.result_detected_at)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sent At</p>
                    <p className="font-medium">
                      {log.sent_at ? formatDate(log.sent_at) : 'Pending'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{log.notification_type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Recipient</p>
                    <p className="font-medium truncate">{log.contact_name}</p>
                  </div>
                </div>

                {/* Error Message */}
                {log.error_message && (
                  <div className="p-2 bg-red-50 dark:bg-red-950 rounded text-xs text-red-600 dark:text-red-200">
                    Error: {log.error_message}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {log.screenshot_url && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewUrl(log.screenshot_url || null)}
                        className="h-7 text-xs"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Preview
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-7 text-xs"
                      >
                        <a href={log.screenshot_url} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </a>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <Card className="max-w-2xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Screenshot Preview</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPreviewUrl(null)}
                className="h-6 w-6 p-0"
              >
                ✕
              </Button>
            </CardHeader>
            <CardContent>
              <img src={previewUrl} alt="Result Screenshot" className="w-full rounded-lg" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary Stats */}
      {logs.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Results</p>
                <p className="text-2xl font-bold mt-1">{logs.length}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {logs.filter((l) => l.status === 'sent').length}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {logs.filter((l) => l.status === 'pending').length}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {logs.filter((l) => l.status === 'failed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
