import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, candidateName, examName, screenshotUrl } = await request.json();

    if (!email || !candidateName || !examName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Integration with Resend or other email service
    // For now, just log and simulate success
    console.log('[v0] Email notification:', {
      email,
      candidateName,
      examName,
      screenshotUrl,
    });

    // TODO: Integrate with real email service (Resend, SendGrid, etc.)
    // Example:
    // const response = await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'results@exammonitor.com',
    //     to: email,
    //     subject: `${examName} Results - ${candidateName}`,
    //     html: `...`,
    //   }),
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
