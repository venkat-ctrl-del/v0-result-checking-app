import { createClient } from '@supabase/supabase-js';
import { recordCheck } from '@/lib/db/automation';
import { addNotificationLog, updateNotificationLog } from '@/lib/db/notifications';
import { sendEmail, sendSMS, sendWhatsApp } from '@/lib/services/notifications';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface EnrolledCandidate {
  exam_id: string;
  candidate_id: string;
  candidate: {
    id: string;
    name: string;
    hall_ticket_number: string;
    date_of_birth: string;
  };
  exam: {
    id: string;
    exam_name: string;
    result_portal_url: string;
  };
}

export async function checkExamResults() {
  console.log('[v0] Starting exam result check at', new Date().toISOString());

  try {
    // Get all enrolled candidates with their exams
    const { data: enrollments, error: enrollError } = await supabase
      .from('exam_enrollments')
      .select(
        `exam_id,
         candidate_id,
         candidates(id, name, hall_ticket_number, date_of_birth),
         exams(id, exam_name, result_portal_url)`
      );

    if (enrollError) {
      console.error('Error fetching enrollments:', enrollError);
      return;
    }

    if (!enrollments || enrollments.length === 0) {
      console.log('[v0] No enrollments found');
      await recordCheck();
      return;
    }

    console.log('[v0] Found', enrollments.length, 'enrollments to check');

    // Get all contacts
    const { data: contacts, error: contactError } = await supabase
      .from('contacts')
      .select('*');

    if (contactError) {
      console.error('Error fetching contacts:', contactError);
      return;
    }

    // Check each enrollment
    for (const enrollment of enrollments) {
      const { exam_id, candidate_id, candidates, exams } = enrollment as any;
      const candidate = candidates?.[0];
      const exam = exams?.[0];

      if (!candidate || !exam) {
        console.warn('[v0] Invalid enrollment data');
        continue;
      }

      console.log('[v0] Checking results for', candidate.name, 'in', exam.exam_name);

      try {
        // Check if result is available (simulate checking the portal)
        const resultAvailable = await checkResultPortal(
          exam.result_portal_url,
          candidate.hall_ticket_number,
          candidate.date_of_birth
        );

        if (resultAvailable) {
          console.log('[v0] Result found for', candidate.name);

          // Capture screenshot (simulate or use Puppeteer)
          const screenshotUrl = await captureResultScreenshot(
            exam.result_portal_url,
            candidate.hall_ticket_number,
            candidate.date_of_birth
          );

          // Send notifications to all contacts
          if (contacts && contacts.length > 0) {
            for (const contact of contacts) {
              await sendNotification(
                candidate.id,
                exam.id,
                contact.id,
                contact.contact_type,
                screenshotUrl,
                candidate.name,
                exam.exam_name,
                contact
              );
            }
          }
        }
      } catch (error) {
        console.error('[v0] Error checking results for', candidate.name, ':', error);
      }
    }

    // Record that check was performed
    await recordCheck();
    console.log('[v0] Exam result check completed');
  } catch (error) {
    console.error('[v0] Error in result checker:', error);
  }
}

async function checkResultPortal(
  url: string,
  hallTicket: string,
  dob: string
): Promise<boolean> {
  try {
    // In a real implementation, this would:
    // 1. Use Puppeteer or Playwright to navigate to the portal
    // 2. Log in with credentials
    // 3. Search for the student's result using hall ticket and DOB
    // 4. Return true if result is found

    // For now, we simulate the check
    console.log('[v0] Checking portal:', url);
    
    // Simulate API call to check result
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hallTicket,
        dob,
      }),
    }).catch(() => null);

    if (!response) {
      console.log('[v0] Portal check failed (could be down or API issue)');
      return false;
    }

    // In real implementation, parse response and check if result is available
    const data = await response.json().catch(() => ({}));
    return data.resultAvailable === true;
  } catch (error) {
    console.error('[v0] Error checking portal:', error);
    return false;
  }
}

async function captureResultScreenshot(
  url: string,
  hallTicket: string,
  dob: string
): Promise<string> {
  try {
    // In a real implementation, this would:
    // 1. Use Puppeteer to load the page
    // 2. Fill in credentials
    // 3. Take a screenshot
    // 4. Upload to Vercel Blob or similar
    // 5. Return the URL

    console.log('[v0] Capturing screenshot for', url);

    // For now, return a placeholder
    return 'https://example.com/screenshot.png';
  } catch (error) {
    console.error('[v0] Error capturing screenshot:', error);
    return '';
  }
}

async function sendNotification(
  candidateId: string,
  examId: string,
  contactId: string,
  notificationType: 'email' | 'sms' | 'whatsapp',
  screenshotUrl: string,
  candidateName: string,
  examName: string,
  contact: any
): Promise<void> {
  try {
    const now = new Date().toISOString();

    // Create notification log
    const log = await addNotificationLog({
      candidate_id: candidateId,
      exam_id: examId,
      contact_id: contactId,
      notification_type: notificationType,
      result_detected_at: now,
      screenshot_url: screenshotUrl,
      status: 'pending',
    });

    console.log('[v0] Created notification log:', log.id);

    // Send notification based on type
    try {
      if (notificationType === 'email' && contact.email) {
        await sendEmail(contact.email, candidateName, examName, screenshotUrl);
      } else if (notificationType === 'sms' && contact.phone) {
        await sendSMS(contact.phone, candidateName, examName);
      } else if (notificationType === 'whatsapp' && contact.whatsapp) {
        await sendWhatsApp(contact.whatsapp, candidateName, examName, screenshotUrl);
      }

      // Update log to sent
      await updateNotificationLog(log.id, {
        sent_at: new Date().toISOString(),
        status: 'sent',
      });

      console.log('[v0] Notification sent for', candidateName);
    } catch (error: any) {
      // Update log to failed
      await updateNotificationLog(log.id, {
        status: 'failed',
        error_message: error.message || 'Unknown error',
      });

      console.error('[v0] Failed to send notification:', error);
    }
  } catch (error) {
    console.error('[v0] Error in sendNotification:', error);
  }
}
