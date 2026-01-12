import nodemailer from 'nodemailer';
import type { ChangeEvent } from './trackChanges';

interface EmailPayload {
  email: string;
  subject: string;
  html: string;
  text?: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildChangeEmail(params: {
  type: 'eips' | 'ercs' | 'rips';
  id: string | number;
  events: ChangeEvent[];
}) {
  const { type, id, events } = params;
  const title = `${type.toUpperCase()}-${id} Updates`;
  const baseLink =
    type === 'rips'
      ? `https://github.com/ethereum-cat-herders/RIPs/blob/master/RIPS/rip-${id}.md`
      : type === 'ercs'
      ? `https://eips.ethereum.org/ERCS/erc-${id}`
      : `https://eips.ethereum.org/EIPS/eip-${id}`;

  const rows = events
    .map(
      (e) => {
        const escapedSummary = escapeHtml(e.summary);
        const escapedStatusFrom = e.statusFrom ? escapeHtml(e.statusFrom) : '';
        const escapedStatusTo = e.statusTo ? escapeHtml(e.statusTo) : '';
        const escapedMessage = escapeHtml(e.message);
        return `
      <tr>
        <td style="padding:8px 12px;font-size:14px;">
          <strong>${e.kind === 'status' ? 'Status' : 'Content'}</strong>
        </td>
        <td style="padding:8px 12px;font-size:14px;">
          ${e.kind === 'status' && e.statusFrom && e.statusTo
            ? `<span style="background:#eef;padding:2px 6px;border-radius:4px;">${escapedStatusFrom}</span>
               &rarr;
               <span style="background:#e6ffe6;padding:2px 6px;border-radius:4px;">${escapedStatusTo}</span>`
            : escapedSummary}
          <div style="color:#6b7280;margin-top:6px;font-size:13px;">${escapedMessage}</div>
          <div style="color:#555;margin-top:4px;">
            <a href="${e.url}" style="color:#2563eb;text-decoration:none;">Commit</a>
            ${e.author ? ` • ${e.author}` : ''} • ${new Date(e.date).toLocaleString()}
          </div>
        </td>
      </tr>
    `
      }
    )
    .join('');

  const html = `
  <div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;max-width:640px;margin:auto;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
    <div style="background:#1e3a8a;padding:18px 24px;">
      <h1 style="margin:0;font-size:20px;color:#fff;">${title}</h1>
      <p style="margin:4px 0 0;font-size:13px;color:#bfdbfe;">Real-time status & content change summary</p>
    </div>
    <div style="padding:20px 24px;">
      <p style="margin-top:0;font-size:15px;line-height:1.5;">
        The following updates were detected for <a href="${baseLink}" style="color:#2563eb;text-decoration:none;">${type.toUpperCase()}-${id}</a>.
      </p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <thead>
          <tr>
            <th align="left" style="padding:8px 12px;background:#f1f5f9;font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:#475569;">Type</th>
            <th align="left" style="padding:8px 12px;background:#f1f5f9;font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:#475569;">Details</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      <p style="font-size:12px;color:#64748b;margin-top:24px;">
        You received this because you subscribed to ${type.toUpperCase()}-${id} updates.
        To change preferences or unsubscribe (coming soon), reply to this email.
      </p>
    </div>
  </div>
  `;

  const text = [
    `${title}`,
    '',
    ...events.map((e) => {
      const escapedSummary = escapeHtml(e.summary);
      const escapedStatusFrom = e.statusFrom ? escapeHtml(e.statusFrom) : '';
      const escapedStatusTo = e.statusTo ? escapeHtml(e.statusTo) : '';
      const escapedMessage = escapeHtml(e.message);
      return e.kind === 'status' && e.statusFrom && e.statusTo
        ? `STATUS: ${escapedStatusFrom} -> ${escapedStatusTo} | ${escapedMessage} (${e.url})`
        : `CONTENT: ${escapedSummary} | ${escapedMessage} (${e.url})`;
    }),
    '',
    `More: ${baseLink}`
  ].join('\n');

  return { html, text, subject: title };
}

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

export async function sendEmailNotification({ email, subject, html, text }: EmailPayload) {
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    html,
    text
  });
  console.log('📧 Email sent:', info.messageId);
}
