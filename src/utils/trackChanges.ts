import { Octokit } from 'octokit';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function getChangeLog(type: string, id: any) {
  const repoPath = type === 'eips' ? 'ethereum/EIPs' : type === 'ercs' ? 'ethereum/EIPs' : 'ethereum-cat-herders/RIPs';
  const filePath = type === 'rips' ? `RIPS/rip-${id}.md` : `EIPS/eip-${id}.md`;

  const commits = await octokit.request(`GET /repos/${repoPath}/commits`, {
    path: filePath,
    per_page: 5
  });

  return commits.data.map((commit: { commit: { message: string; author: { date: any; }; }; }) => ({
    kind: commit.commit.message.toLowerCase().includes('status') ? 'status' : 'content',
    summary: commit.commit.message,
    description: commit.commit.message,
    date: commit.commit.author.date
  }));
}
