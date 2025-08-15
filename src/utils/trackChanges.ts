import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export interface ChangeEvent {
  kind: 'status' | 'content';
  type: 'eips' | 'ercs' | 'rips';
  id: string | number;
  commitSha: string;
  previousSha?: string;
  date: string;
  author?: string;
  statusFrom?: string;
  statusTo?: string;
  summary: string;
  message: string;
  url: string;
}

interface GetChangesParams {
  type: 'eips' | 'ercs' | 'rips';
  id: string | number;
  sinceSha?: string | null;
  maxCommits?: number;
}

function resolveRepoAndPath(type: string, id: string | number) {
  // NOTE: ERCs currently live in ethereum/EIPs same folder (ERCS vs EIPS). Adjust if your data model differs.
  if (type === 'rips') {
    return {
      repoPath: 'ethereum-cat-herders/RIPs',
      filePath: `RIPS/rip-${id}.md`
    };
  }
  // eips + ercs
  const folder = type === 'ercs' ? 'ERCS' : 'EIPS';
  const prefix = type === 'ercs' ? 'erc' : 'eip';
  return {
    repoPath: 'ethereum/EIPs',
    filePath: `${folder}/${prefix}-${id}.md`
  };
}

async function fetchFileContent(repoPath: string, filePath: string, sha: string): Promise<string | null> {
  try {
    const resp = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: repoPath.split('/')[0],
      repo: repoPath.split('/')[1],
      path: filePath,
      ref: sha
    });
    // @ts-ignore
    if (resp.data?.content && resp.data.encoding === 'base64') {
      // @ts-ignore
      return Buffer.from(resp.data.content, 'base64').toString('utf8');
    }
    return null;
  } catch {
    return null;
  }
}

function extractStatus(markdown: string | null): string | undefined {
  if (!markdown) return undefined;
  // Look in front-matter or simple preamble: status: <Value>
  const m = markdown.match(/^\s*status:\s*([A-Za-z ]+)/im);
  return m ? m[1].trim() : undefined;
}

/**
 * Returns change events since (but NOT including) sinceSha (exclusive).
 * Commits are processed oldest → newest to detect status transitions.
 */
export async function getChangesSince(params: GetChangesParams): Promise<{ events: ChangeEvent[]; latestSha?: string }> {
  const { type, id, sinceSha = null, maxCommits = 30 } = params;
  const { repoPath, filePath } = resolveRepoAndPath(type, id);

  // Get commit list (newest first) limited
  const commitsResp = await octokit.request('GET /repos/{owner}/{repo}/commits', {
    owner: repoPath.split('/')[0],
    repo: repoPath.split('/')[1],
    path: filePath,
    per_page: maxCommits
  });

  const allCommits = commitsResp.data;

  // Slice until we reach sinceSha (exclusive)
  const newCommits: typeof allCommits = [];
  for (const c of allCommits) {
    if (c.sha === sinceSha) break;
    newCommits.push(c);
  }
  if (newCommits.length === 0) {
    return { events: [], latestSha: sinceSha || allCommits[0]?.sha };
  }

  // Process in chronological order (oldest first)
  const chronological = [...newCommits].reverse();

  let prevContent: string | null = null;
  let prevStatus: string | undefined;
  let prevSha: string | undefined = sinceSha || undefined;

  // If we have a baseline (sinceSha) fetch its content for diffing
  if (sinceSha) {
    prevContent = await fetchFileContent(repoPath, filePath, sinceSha);
    prevStatus = extractStatus(prevContent);
  }

  const events: ChangeEvent[] = [];

  for (const commit of chronological) {
    const sha = commit.sha;
    const content = await fetchFileContent(repoPath, filePath, sha);
    const newStatus = extractStatus(content);

    // Status change?
    if (newStatus && prevStatus && newStatus !== prevStatus) {
      events.push({
        kind: 'status',
        type,
        id,
        commitSha: sha,
        previousSha: prevSha,
        date: commit.commit.author?.date || commit.commit.committer?.date || new Date().toISOString(),
        author: commit.commit.author?.name,
        statusFrom: prevStatus,
        statusTo: newStatus,
        summary: `Status changed: ${prevStatus} → ${newStatus}`,
        message: commit.commit.message,
        url: commit.html_url
      });
    }

    // Always record a content event (you could refine to skip trivial message patterns)
    events.push({
      kind: 'content',
      type,
      id,
      commitSha: sha,
      previousSha: prevSha,
      date: commit.commit.author?.date || commit.commit.committer?.date || new Date().toISOString(),
      author: commit.commit.author?.name,
      summary: commit.commit.message.split('\n')[0],
      message: commit.commit.message,
      url: commit.html_url
    });

    prevContent = content;
    prevStatus = newStatus || prevStatus;
    prevSha = sha;
  }

  const latestSha = chronological[chronological.length - 1]?.sha;
  return { events, latestSha };
}

// BACKWARD COMPAT: legacy name expected by older modules
// Overload-style convenience plus same return shape.
export async function getChangeLog(
  type: 'eips' | 'ercs' | 'rips',
  id: string | number,
  sinceSha?: string | null,
  maxCommits = 30
): Promise<{ events: ChangeEvent[]; latestSha?: string }> {
  return getChangesSince({ type, id, sinceSha, maxCommits });
}
