import { getChangeLog } from './trackChanges';

export async function getFeedDataFor(type: string, id: string, filter = 'all') {
  const changes = await getChangeLog(type, id);
  const filtered = filter === 'status' ? changes.filter((c: { kind: string; }) => c.kind === 'status') : changes;

  return {
    title: `${type.toUpperCase()}-${id} (${filter}) Updates`,
    items: filtered.map((change: { kind: string; summary: any; description: any; date: string | number | Date; }) => ({
      title: `${change.kind.toUpperCase()} changed: ${change.summary}`,
      link: `https://eips.ethereum.org/${type}/${type}-${id}`,
      description: change.description,
      date: new Date(change.date)
    }))
  };
}