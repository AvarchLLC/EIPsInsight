import type { NextApiRequest, NextApiResponse } from "next";

/**
 * GET /api/boards — Help: lists allowed spec and query params for Board API.
 * Use GET /api/boards/:spec (eips | ercs | rips) to fetch open PRs.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  return res.status(200).json({
    description: "Board API — Open PRs for EIP/ERC/RIP boards",
    endpoints: [
      "GET /api/boards — this help",
      "GET /api/boards/eips — open EIP PRs",
      "GET /api/boards/ercs — open ERC PRs",
      "GET /api/boards/rips — open RIP PRs",
    ],
    queryParams: {
      subcategory:
        "Filter by subcategory, e.g. Waiting on Editor, Waiting on Author, Stagnant, Awaited, Misc",
      category:
        "Filter by category (Process), e.g. PR DRAFT, Typo, NEW EIP, Status Change, Website, Tooling, EIP-1, Other",
      sort: "waitTime (default: longest waiting first) | created (oldest first)",
    },
    exampleRequests: [
      "GET /api/boards/eips",
      "GET /api/boards/eips?subcategory=Waiting%20on%20Editor",
      "GET /api/boards/eips?subcategory=Waiting%20on%20Author",
      "GET /api/boards/eips?category=Typo",
      "GET /api/boards/eips?subcategory=Waiting%20on%20Editor&sort=waitTime",
    ],
  });
}
