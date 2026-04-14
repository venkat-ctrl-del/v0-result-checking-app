import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, candidateName, examName } = await request.json();

    if (!phoneNumber || !candidateName || !examName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Integration with Twilio or other SMS service
    // For now, just log and simulate success
    console.log('[v0] SMS notification:', {
      phoneNumber,
      candidateName,
      examName,
    });

    // TODO: Integrate with real SMS service (Twilio, AWS SNS, etc.)
    // Example with Twilio:
    // const client = require('twilio')(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN
    // );
    // await client.messages.create({
    //   body: `${candidateName}, your ${examName} results are out!`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber,
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return NextResponse.json({ error: 'Failed to send SMS' }, { status: 500 });
  }
}
