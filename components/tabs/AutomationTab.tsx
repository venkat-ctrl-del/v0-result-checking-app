'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { getAutomationSettings, updateAutomationSettings, startAutomation, stopAutomation } from '@/lib/db/automation';
import { Spinner } from '@/components/ui/spinner';

interface AutomationSettings {
  id: string;
  check_interval_minutes: number;
  is_active: boolean;
  last_checked?: string;
  next_scheduled_check?: string;
  created_at: string;
  updated_at: string;
}

export default function AutomationTab() {
  const [settings, setSettings] = useState<AutomationSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkInterval, setCheckInterval] = useState('60');
  const [isActive, setIsActive] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSettings();
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchSettings, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getAutomationSettings();
      if (data) {
        setSettings(data);
        setCheckInterval(data.check_interval_minutes.toString());
        setIsActive(data.is_active);
      }
    } catch (error) {
      console.error('Error fetching automation settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIntervalChange = (value: string) => {
    const num = parseInt(value);
    if (num >= 1 && num <= 1440) {
      setCheckInterval(value);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSubmitting(true);
      const intervalNum = Math.max(1, Math.min(1440, parseInt(checkInterval) || 60));
      await updateAutomationSettings({
        check_interval_minutes: intervalNum,
      });
      await fetchSettings();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAutomation = async () => {
    try {
      setSubmitting(true);
      if (isActive) {
        await stopAutomation();
      } else {
        await startAutomation();
      }
      await fetchSettings();
    } catch (error) {
      console.error('Error toggling automation:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Spinner className="h-5 w-5" />
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  const getTimeUntilNextCheck = () => {
    if (!settings?.next_scheduled_check) return 'Calculating...';
    const nextCheck = new Date(settings.next_scheduled_check);
    const now = new Date();
    const diffMs = nextCheck.getTime() - now.getTime();
    const diffMins = Math.max(0, Math.round(diffMs / 60000));
    if (diffMins === 0) return 'In progress...';
    return `${diffMins} minutes`;
  };

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Automation Status</CardTitle>
              <CardDescription>Control automatic result checking</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {isActive ? (
                <Badge className="bg-green-500 text-white">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              ) : (
                <Badge variant="outline">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Inactive
                </Badge>
              )}
              <Button
                onClick={handleToggleAutomation}
                disabled={submitting}
                variant={isActive ? 'destructive' : 'default'}
              >
                {submitting && <Spinner className="mr-2 h-4 w-4" />}
                {isActive ? 'Stop' : 'Start'} Automation
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Settings Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Check Frequency</CardTitle>
          <CardDescription>
            Set how often the system checks for exam results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Check interval (minutes)</label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                max="1440"
                value={checkInterval}
                onChange={(e) => handleIntervalChange(e.target.value)}
                placeholder="60"
                className="max-w-xs"
              />
              <Button onClick={handleSaveSettings} disabled={submitting}>
                {submitting && <Spinner className="mr-2 h-4 w-4" />}
                Save
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum: 1 minute • Maximum: 24 hours (1440 minutes)
            </p>
          </div>

          {/* Quick preset buttons */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick presets</label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '15 min', value: '15' },
                { label: '30 min', value: '30' },
                { label: '1 hour', value: '60' },
                { label: '2 hours', value: '120' },
                { label: '4 hours', value: '240' },
              ].map((preset) => (
                <Button
                  key={preset.value}
                  size="sm"
                  variant={checkInterval === preset.value ? 'default' : 'outline'}
                  onClick={() => setCheckInterval(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Status */}
      {isActive && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Next Check
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Next scheduled check in</p>
              <p className="text-2xl font-bold text-primary mt-1">{getTimeUntilNextCheck()}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Last checked</p>
                <p className="font-medium text-xs mt-1">{formatDate(settings?.last_checked)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Next check at</p>
                <p className="font-medium text-xs mt-1">{formatDate(settings?.next_scheduled_check)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-sm">How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            ✓ The system periodically checks the result portal URLs you provided
          </p>
          <p>
            ✓ When results are detected, screenshots are captured automatically
          </p>
          <p>
            ✓ Results are instantly sent to all configured contacts via Email, SMS, and WhatsApp
          </p>
          <p>
            ✓ You can monitor all notifications in the Results tab
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
