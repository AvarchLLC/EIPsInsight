// // interface EmailPayload {
// //   email: string;
// //   subject: string;
// //   html: string;
// // }

// // // export async function sendEmailNotification({ email, subject, html }: EmailPayload) {
// // //   await fetch('https://api.resend.com/emails', {
// // //     method: 'POST',
// // //     headers: {
// // //       'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
// // //       'Content-Type': 'application/json'
// // //     },
// // //     body: JSON.stringify({
// // //       to: email,
// // //       from: 'updates@eipsinsight.com',
// // //       subject,
// // //       html
// // //     })
// // //   });
// // // }

// // export async function sendEmailNotification({ email, subject, html }: EmailPayload) {
// //   const res = await fetch('https://api.resend.com/emails', {
// //     method: 'POST',
// //     headers: {
// //       'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
// //       'Content-Type': 'application/json',
// //     },
// //     body: JSON.stringify({
// //       to: email,
// //       from: 'updates@eipsinsight.com',
// //       subject,
// //       html,
// //     }),
// //   });

// //   if (!res.ok) {
// //     const text = await res.text();
// //     console.error(`Resend API error sending to ${email}:`, res.status, res.statusText, text);
// //     throw new Error(`Failed to send email: ${res.statusText}`);
// //   } else {
// //     console.log(`Email successfully sent to ${email}`);
// //   }
// // }


// import nodemailer from 'nodemailer';

// export async function sendEmailNotification({
//   email,
//   subject,
//   html,
// }: {
//   email: string;
//   subject: string;
//   html: string;
// }) {
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: parseInt(process.env.EMAIL_PORT || '587'),
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const info = await transporter.sendMail({
//     from: process.env.EMAIL_FROM,
//     to: email,
//     subject,
//     html,
//   });

//   console.log('📧 Email sent:', info.messageId);
// }


import nodemailer from 'nodemailer';

interface EmailPayload {
  email: string;
  subject: string;
  html: string;
}

export async function sendEmailNotification({ email, subject, html }: EmailPayload) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false, // Brevo uses TLS on port 587
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject,
      html,
    });

    console.log('📧 Email sent successfully:', info.messageId);
  } catch (err) {
    console.error('❌ Failed to send email:', err);
  }
}
