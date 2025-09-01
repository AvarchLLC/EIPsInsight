import { getAllSubscriptions, getLastProcessedSha, setLastProcessedSha } from './subscriptions';
import { getChangesSince } from './trackChanges';
import { buildChangeEmail, sendEmailNotification } from './email';
import { buildFeedItemsFromEvents, generateRSSFeed } from './rss';

interface GroupKey {
  type: 'eips' | 'ercs' | 'rips';
  id: string | number;
}

export async function syncEipChanges() {
  const subs = await getAllSubscriptions();
  if (!subs.length) {
    console.log('ℹ️ No subscriptions.');
    return;
  }

  // Group subscriptions by (type,id)
  const groups = new Map<string, { key: GroupKey; subs: any[] }>();
  for (const s of subs) {
    const k = `${s.type}:${s.id}`;
    if (!groups.has(k)) groups.set(k, { key: { type: s.type, id: s.id }, subs: [] });
    groups.get(k)!.subs.push(s);
  }

  for (const { key, subs: groupSubs } of groups.values()) {
    const lastSha = await getLastProcessedSha(key.type, key.id);
    console.log(`🔍 Checking ${key.type}-${key.id}, lastSha=${lastSha || 'NONE'}`);
    let changes;
    try {
      const { events, latestSha } = await getChangesSince({
        type: key.type,
        id: key.id,
        sinceSha: lastSha || undefined
      });
      changes = { events, latestSha };
    } catch (err) {
      console.error(`❌ Failed fetching changes for ${key.type}-${key.id}`, err);
      continue;
    }

    if (!changes.events.length) {
      console.log(`⬇️ No new commits for ${key.type}-${key.id}`);
      // still update latestSha if we never had one
      if (!lastSha && changes.latestSha) {
        await setLastProcessedSha(key.type, key.id, changes.latestSha);
      }
      continue;
    }

    // Mark latest SHA AFTER successful notifications
    const statusEvents = changes.events.filter((e) => e.kind === 'status');
    for (const sub of groupSubs) {
      const relevant =
        sub.filter === 'status' ? statusEvents : changes.events.filter((e) => sub.filter === 'all' || e.kind === 'status');

      if (!relevant.length) {
        console.log(`⚠️ No relevant events for ${sub.email} on ${key.type}-${key.id}`);
        continue;
      }

      try {
        const { html, text, subject } = buildChangeEmail({
          type: key.type,
          id: key.id,
            // De-duplicate status + content that refer to same commit if desired:
          events: dedupeEvents(relevant)
        });
        await sendEmailNotification({ email: sub.email, subject, html, text });
        console.log(`✅ Notified ${sub.email} (${relevant.length} events)`);
      } catch (err) {
        console.error(`❌ Email failed for ${sub.email}`, err);
      }
    }

    // RSS (per (type,id)) – you can persist this (DB/S3/public folder)
    try {
      const baseLink =
        key.type === 'rips'
          ? `https://github.com/ethereum-cat-herders/RIPs/blob/master/RIPS/rip-${key.id}.md`
          : key.type === 'ercs'
          ? `https://eips.ethereum.org/ERCS/erc-${key.id}`
          : `https://eips.ethereum.org/EIPS/eip-${key.id}`;

      const feedItems = buildFeedItemsFromEvents(changes.events, baseLink);
      const rssXml = generateRSSFeed({
        title: `${key.type.toUpperCase()}-${key.id} Updates`,
        id: baseLink,
        link: baseLink,
        items: feedItems
      });
      // TODO: store rssXml (e.g. in Mongo or a file) for a public endpoint.
      console.log(`📰 RSS generated for ${key.type}-${key.id} (${feedItems.length} items)`);
    } catch (err) {
      console.error('❌ RSS generation failed', err);
    }

    if (changes.latestSha) {
      await setLastProcessedSha(key.type, key.id, changes.latestSha);
    }
  }
}

function dedupeEvents(events: any[]) {
  // Optional: remove duplicate content & status events for same commit if desired
  const seen = new Set<string>();
  const out: any[] = [];
  for (const e of events) {
    const key = `${e.commitSha}:${e.kind}:${e.statusFrom || ''}:${e.statusTo || ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(e);
  }
  return out;
}