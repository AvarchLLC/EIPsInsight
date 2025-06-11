// // import { getChangeLog } from './trackChanges';
// // import { getAllSubscriptions } from './subscriptions';
// // import { sendEmailNotification } from './email';

// // // export async function syncEipChanges() {
// // //   const subs = await getAllSubscriptions();
// // //   console.log('🔄 Total subscriptions:', subs.length);

// // //   for (const sub of subs) {
// // //     const changes = await getChangeLog(sub.type, sub.id);
// // //     const relevant = sub.filter === 'status'
// // //       ? changes.filter((c: { kind: string; }) => c.kind === 'status')
// // //       : changes;
// // //     console.log('📡 Checking:', sub.email, `Changes found: ${relevant.length}`);

// // //     if (relevant.length > 0) {
// // //       await sendEmailNotification({
// // //         email: sub.email,
// // //         subject: `Update: ${sub.type.toUpperCase()}-${sub.id}`,
// // //         html: `<p>${relevant.map((r: { summary: any; }) => r.summary).join('<br/>')}</p>`
// // //       });
// // //         console.log('✅ Email sent to:', sub.email);
// // //     }
// // //   }
// // // }

// // export async function syncEipChanges() {
// //   const subs = await getAllSubscriptions();
// //   console.log('📬 Subscribers loaded:', subs);

// //   for (const sub of subs) {
// //     const changes = await getChangeLog(sub.type, sub.id);
// //     const relevant = sub.filter === 'status'
// //       ? changes.filter((c: { kind: string; }) => c.kind === 'status')
// //       : changes;

// //     console.log('🔍 Found changes:', relevant);

// //     if (relevant.length > 0) {
// //       await sendEmailNotification({
// //         email: sub.email,
// //         subject: `Update: ${sub.type.toUpperCase()}-${sub.id}`,
// //         html: `<p>${relevant.map((r: { summary: any; }) => r.summary).join('<br/>')}</p>`
// //       });

// //       console.log('✅ Email would be sent to:', sub.email);
// //     } else {
// //       console.log('⚠️ No relevant changes for:', sub.email);
// //     }
// //   }
// // }


// import { getSubscribers } from './db';
// import { sendEmail } from './email';

// export async function syncEipChanges() {
//   // 1. Load subscribers
//   const subscribers = await getSubscribers();
//   console.log('📬 Subscribers loaded:', subscribers);

//   // 2. TEMPORARY: Simulate a change in EIP-721
//   const changes = [
//     {
//       id: '721',
//       type: 'eips',
//       kind: 'status', // or 'content'
//       summary: 'Status changed from Draft to Final',
//       newStatus: 'Final',
//     },
//   ];
//   console.log('🔍 Found changes:', changes);

//   // 3. Notify relevant subscribers
//   for (const subscriber of subscribers) {
//     const relevant = changes.filter((change) => {
//       return (
//         change.id === subscriber.id &&
//         change.type === subscriber.type &&
//         (subscriber.filter === 'all' || subscriber.filter === change.kind)
//       );
//     });

//     if (relevant.length === 0) {
//       console.log(`⚠️ No relevant changes for: ${subscriber.email}`);
//       continue;
//     }

//     console.log(`✅ Email would be sent to: ${subscriber.email}`);
//     await sendEmail(subscriber.email, relevant);
//   }
// }


import { getAllSubscriptions } from './subscriptions';
import { sendEmailNotification } from './email';
// import { getChangeLog } from './trackChanges'; ← we'll skip this for test

export async function syncEipChanges() {
  const subs = await getAllSubscriptions();
  console.log('📬 Subscribers loaded:', subs);

  // TEMP: Fake change
  const simulatedChange = [
    {
      kind: 'status',
      summary: 'Status changed from Draft to Final',
    },
  ];
  for (const sub of subs) {
    if (sub.id !== '721' || sub.type !== 'eips') {
      console.log(`⚠️ Skipping ${sub.email} — not subscribed to EIP-721`);
      continue;
    }

    const relevant = sub.filter === 'status'
      ? simulatedChange.filter((c) => c.kind === 'status')
      : simulatedChange;

    console.log('🔍 Found changes:', relevant);

    if (relevant.length > 0) {
      try {
        await sendEmailNotification({
          email: sub.email,
          subject: `Update: EIP-${sub.id}`,
          html: `<p>${relevant.map((r) => r.summary).join('<br/>')}</p>`,
        });
        console.log('✅ Email sent to:', sub.email);
      } catch (err) {
        console.error('❌ Failed to send email to:', sub.email, err);
      }
    } else {
      console.log('⚠️ No relevant changes for:', sub.email);
    }
  }
}