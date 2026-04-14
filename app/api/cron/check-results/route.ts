import { NextRequest, NextResponse } from 'next/server';
import { checkExamResults } from '@/lib/automation/result-checker';
import { getAutomationSettings } from '@/lib/db/automation';

/**
 * This endpoint is triggered by a cron job (e.g., every 15 minutes)
 * It checks if automation is active and triggers the result checking process
 * 
 * To set up the cron job, add this to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/check-results",
 *     "schedule": "*/15 * * * *"
 *   }]
 * }
 */

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel's cron service
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      console.warn('[v0] Unauthorized cron request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[v0] Cron job triggered at', new Date().toISOString());

    // Get automation settings
    const settings = await getAutomationSettings();

    if (!settings || !settings.is_active) {
      console.log('[v0] Automation is not active');
      return NextResponse.json({ message: 'Automation is inactive' });
    }

    // Check if it's time to run the check
    if (settings.next_scheduled_check) {
      const nextCheck = new Date(settings.next_scheduled_check);
      const now = new Date();

      if (now < nextCheck) {
        const minutesUntilCheck = Math.round(
          (nextCheck.getTime() - now.getTime()) / 60000
        );
        console.log(
          '[v0] Not yet time to check. Next check in',
          minutesUntilCheck,
          'minutes'
        );
        return NextResponse.json({
          message: `Not yet time to check. Next check in ${minutesUntilCheck} minutes`,
        });
      }
    }

    // Trigger the result checking process
    await checkExamResults();

    return NextResponse.json({
      success: true,
      message: 'Result check completed',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Error in cron job:', error);
    return NextResponse.json(
      { error: 'Failed to check results', details: String(error) },
      { status: 500 }
    );
  }
}

// Allow manual triggering for testing
export async function POST(request: NextRequest) {
  try {
    console.log('[v0] Manual check triggered at', new Date().toISOString());

    const settings = await getAutomationSettings();

    if (!settings || !settings.is_active) {
      return NextResponse.json(
        { error: 'Automation is not active' },
        { status: 400 }
      );
    }

    await checkExamResults();

    return NextResponse.json({
      success: true,
      message: 'Result check completed',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[v0] Error in manual check:', error);
    return NextResponse.json(
      { error: 'Failed to check results', details: String(error) },
      { status: 500 }
    );
  }
}
