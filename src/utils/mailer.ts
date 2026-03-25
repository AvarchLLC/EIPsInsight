import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // Brevo uses STARTTLS, not SSL
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendSubscriptionEmail(
  email: string,
  subscription: { type: string; id: string; unsubscribeUrl?: string }
) {
  const subscriptionLabel = `${subscription.type.toUpperCase()}-${subscription.id}`;
  const mailOptions = {
    from: `"EIPs Insight" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `You're now subscribed to ${subscriptionLabel}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <h2 style="color: #4a90e2;">✅ Subscription Confirmed</h2>
        <p>Hey there 👋,</p>
        <p>You’ve successfully subscribed to updates on <strong>${subscriptionLabel}</strong>.</p>
        <p>We’ll notify you when there are changes or new discussions related to this ${subscription.type.toUpperCase()}.</p>
        ${subscription.unsubscribeUrl ? `<p><a href="${subscription.unsubscribeUrl}">Unsubscribe from these updates</a></p>` : ""}
        <p style="margin-top: 20px;">Stay curious,<br/>The EIPs Insight Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
