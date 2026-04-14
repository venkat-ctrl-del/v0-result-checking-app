// Email, SMS, and WhatsApp notification services
// These are placeholder implementations that can be integrated with real services

export async function sendEmail(
  email: string,
  candidateName: string,
  examName: string,
  screenshotUrl: string
): Promise<void> {
  try {
    console.log('[v0] Sending email to', email);

    // In production, integrate with Resend or similar
    // Example with Resend:
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
    //     html: `
    //       <h2>${candidateName}, your ${examName} results are out!</h2>
    //       <img src="${screenshotUrl}" alt="Result Screenshot" style="max-width: 100%; height: auto;" />
    //       <p><a href="${screenshotUrl}" download>Download Result</a></p>
    //     `,
    //   }),
    // });

    // Simulate API call
    const response = await fetch('/api/notifications/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        candidateName,
        examName,
        screenshotUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`Email send failed: ${response.statusText}`);
    }

    console.log('[v0] Email sent successfully to', email);
  } catch (error) {
    console.error('[v0] Error sending email:', error);
    throw error;
  }
}

export async function sendSMS(
  phoneNumber: string,
  candidateName: string,
  examName: string
): Promise<void> {
  try {
    console.log('[v0] Sending SMS to', phoneNumber);

    // In production, integrate with Twilio or similar
    // Example with Twilio:
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: `${candidateName}, your ${examName} results are out! Login to your account to view details.`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber,
    // });

    // Simulate API call
    const response = await fetch('/api/notifications/sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phoneNumber,
        candidateName,
        examName,
      }),
    });

    if (!response.ok) {
      throw new Error(`SMS send failed: ${response.statusText}`);
    }

    console.log('[v0] SMS sent successfully to', phoneNumber);
  } catch (error) {
    console.error('[v0] Error sending SMS:', error);
    throw error;
  }
}

export async function sendWhatsApp(
  whatsappNumber: string,
  candidateName: string,
  examName: string,
  screenshotUrl: string
): Promise<void> {
  try {
    console.log('[v0] Sending WhatsApp to', whatsappNumber);

    // In production, integrate with Twilio WhatsApp or similar
    // Example with Twilio WhatsApp:
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: `🎓 ${candidateName}, your ${examName} results are out!\n\nLogin to your account to view your score.`,
    //   from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
    //   to: `whatsapp:${whatsappNumber}`,
    //   mediaUrl: [screenshotUrl],
    // });

    // Simulate API call
    const response = await fetch('/api/notifications/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        whatsappNumber,
        candidateName,
        examName,
        screenshotUrl,
      }),
    });

    if (!response.ok) {
      throw new Error(`WhatsApp send failed: ${response.statusText}`);
    }

    console.log('[v0] WhatsApp sent successfully to', whatsappNumber);
  } catch (error) {
    console.error('[v0] Error sending WhatsApp:', error);
    throw error;
  }
}
