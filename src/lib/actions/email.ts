'use server';

export async function sendLeadNotification(
  sellerEmail: string,
  leadName: string,
  leadEmail: string,
  leadPhone: string | null,
  leadRequestType: string,
  leadMessage: string | null,
  listingTitle: string
) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.warn("⚠️ Geen RESEND_API_KEY gevonden in .env, email notificatie overgeslagen.");
    return { success: false };
  }

  try {
    const htmlBody = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
        <h2 style="color: #059669;">Nieuwe aanvraag voor ${listingTitle}</h2>
        <p>Beste verkoper,</p>
        <p>Je hebt zojuist een nieuwe <strong>${leadRequestType}</strong> aanvraag ontvangen via HuisDirect.</p>
        <div style="background: #f5f5f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0 0 10px 0;"><strong>Naam:</strong> ${leadName}</p>
          <p style="margin: 0 0 10px 0;"><strong>E-mail:</strong> <a href="mailto:${leadEmail}" style="color: #059669;">${leadEmail}</a></p>
          ${leadPhone ? `<p style="margin: 0 0 10px 0;"><strong>Telefoon:</strong> <a href="tel:${leadPhone}" style="color: #059669;">${leadPhone}</a></p>` : ''}
          ${leadMessage ? `<div style="margin-top: 15px; border-top: 1px solid #e7e5e4; padding-top: 15px;"><strong>Bericht:</strong><br/><em style="color: #57534e;">"${leadMessage}"</em></div>` : ''}
        </div>
        <p>Log in op je HuisDirect dashboard om deze lead als opgevolgd te markeren.</p>
        <p>Met vriendelijke groet,<br/><strong>Team HuisDirect</strong></p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'HuisDirect Leads <onboarding@resend.dev>',
        to: sellerEmail,
        reply_to: leadEmail,
        subject: `Nieuwe aanvraag: ${listingTitle}`,
        html: htmlBody
      })
    });

    if (!response.ok) {
      console.error("Resend API fout:", await response.text());
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    console.error("Fout bij versturen email:", err);
    return { success: false };
  }
}

