---
title: "Purr-suit of Ethereum 🐾 #3"
date: "2025-01-26"
author: "Pooja Ranjan"
image: "https://hackmd.io/_uploads/HyG8GJEO1g.png"
authorAvatar: "https://avatars.githubusercontent.com/u/29681685?v=4"
authorBio: "EthCatHerders.com | WiEP | EtherWorld.co | EIPsInsight.com"
authorTwitter: "https://x.com/poojaranjan19?lang=en"
authorLinkedin: "https://www.linkedin.com/in/pooja-r-072899114/"
authorGithub: "https://github.com/poojaranjan"
summaryPoints:
  - "Ethereum Pectra upgrade timelines and devnet-6 details"
  - "Key takeaways from All Core Devs Consensus & Implementers calls"
  - "EIPs, ERCs, and RIPs status update: Latest transitions and drafts"
  - "ECH Public Goods Challenge and Octant Epoch 6 roundup"
  - "Upcoming protocol calls and community events for builders"
---

#### Your Weekly Dose of Blockchain Updates and Meows!

In this edition, we bring you key highlights from the Ethereum ecosystem, covering the Pectra upgrade (Prague + Electra), insights from recent All Core Devs Consensus calls, breakout/implementers’ meetings, EIPs update, community challenges, upcoming events, and featured resources. Stay tuned for more as we empower Ethereum through openness and innovation!

---

## 🏗️ Pectra (Prague+Electra) Upgrade

### Consensus (ACDC) #149 (January 23, 2025)
- **devnet-6** will likely launch the week of Jan 27th
- Proposed Pectra timing:
  - **SEPOLIA**: Feb 12, 2025 — epoch: 219392, slot: 7020544, timestamp: 1739980128, forkId: 0xbafd09c3
  - **HOLESKY**: Feb 19, 2025 — epoch: 113152, slot: 3620864, timestamp: 1739352768, forkId: 0xf818a0d6
  - **Mainnet**: Mar 11, 2025 (NOT FINAL; ambitious goal)
- [ACDC Recording](https://www.youtube.com/live/uIjPkGezPOg) · [Podcast](https://open.spotify.com/episode/0jWlhb1F9yxQB5FxiPcGo5?si=sh9dPM7ySeytNBrHu8wvvg) · [Twitter Summary](https://x.com/nixorokish/status/1882473020020990169)
- [Call Highlights by Yash Kamal Chaturvedi](https://etherworld.co/2025/01/23/highlights-of-ethereums-all-core-devs-meeting-acdc-149/)
- [Galaxy Research](https://www.galaxy.com/insights/research/ethereum-all-core-developers-consensus-call-149/)

### Pectra Interop #21 (Jan 20, 2025)
- Devnet 6 moving forward with new genesis file, validator set increase (50,000–100,000)
- Mario to release EIP-7702 changes/fixes
- Teams reviewing PRs as needed
- [EthCatHerders Notes](https://hackmd.io/@poojaranjan/InteropTestingNotes#Interop-Testing-Call-Jan-20-2025)
- [Fellowship of EthMagicians](https://ethereum-magicians.org/t/client-testing-call-21-january-20-2025/22591)

---

## 🧩 Breakout & Implementers’ Meeting 

### EOF Implementers Call #65 (Jan 22, 2025)
- [Recording](https://www.youtube.com/watch?v=5ywv6QpS2sE), [FEM Notes](https://ethereum-magicians.org/t/eof-implementers-call-64-january-22-2025/22466/2)

### JSON-RPC Standardization Breakout (Jan 20, 2024)
- Broad goals: stakeholder involvement, refining specs, error handling
- Key action: async discussions on `eth_fillTransaction` and compatibility tests on Discord
- [Recording & Notes](https://www.youtube.com/watch?v=S_lbb9JNXzY)

### eth_simulate
- No meeting held on Jan 20, 2024

### EIPIP Meeting #112 (Jan 15, 2025)
- **Stagnant Tag:** Issue discussions ongoing
- **EIP Reviewers:** Formal reviewer roles approved
- [Editors' Workshop Announcement](https://github.com/ethcatherders/EIPIP/issues/372)
- [Proposal Builder Tool](https://eipsinsight.com/proposalbuilder) demo shared, requested tool link on [eips.ethereum.org](https://eips.ethereum.org)

### EVM Resource Pricing Breakout #1 (Jan 15, 2025)
- Showcased Nethermind gas-benchmarks, Jacek’s estimator tool
- Proposed: short-term repricing, single/multi-block warming (5-6%, ~15% efficiency gains)
- Medium-term: Fusaka & Amsterdam upgrades, restrict changes to EOF contracts
- Concerns on backward compatibility, auto-detect contract breakages
- Future: contract usage incentives, zk-proof pricing, pending EVM memory pricing session

**Action Items:**
- Draft EIPs for short-term pricing
- Continue benchmarks and cost schedule refinement
- Apply schedules only to EOF contracts, schedule EVM memory pricing presentation

### FOCIL Meeting #2 (Jan 14, 2025)
- CL implementers active, bugs remain
- [Terence’s notes](https://hackmd.io/@ttsao/focil-implementation-notes), support from Lighthouse/Kurtosis
- Focus: inclusion lists, RETH on EL side, local devnet ready
- [FOCIL Intro Slides](https://docs.google.com/presentation/d/1i31wpJpI5B9hb4RE55-eDg1fI3yIoa2T8hj7pNqHQjw/edit?usp=sharing)
- Contributors welcome in Privacy/Anonymity area

#### Client Updates
- **Teku:** [FOCIL Branch](https://github.com/Consensys/teku/tree/focil)
- **Nethermind:** [PR #8003](https://github.com/NethermindEth/nethermind/pull/8003)
- **Lodestar:** [PR #7342](https://github.com/ChainSafe/lodestar/pull/7342)
- Metrics work in progress, FOCIL devnet planned by end of January

---

## 📑 EIPs Update

### [EIPsInsight](https://eipsinsight.com/insight/2025/1)
- **EIPs:** 10 → Stagnant, 4 → Review, 5 new → Draft
- **ERCs:** 4 → Final, 4 → Last Call, 3 → Review, 3 new → Draft
- **RIPs:** 3 new → Draft

#### Proposals in `Last Call`
- ERC-7734: Decentralized Identity Verification (DID)
- ERC-7751: Wrapping bubbled up reverts
- ERC-7820: Access Control Registry
- ERC-7818: Expirable ERC-20

_PS: Data from [EIPsInsight](https://eipsinsight.com/insight/2025/1)_

Other tools: [Editor's Leaderboard](https://eipsinsight.com/Reviewers)

### Call For Input (Open)
- [Define "Meta"](https://github.com/ethcatherders/EIPIP/issues/373)
- [Forcibly withdraw EIP-7675](https://github.com/ethcatherders/EIPIP/issues/374)
- [Allow Links to Blockchain Commons](https://github.com/ethcatherders/EIPIP/issues/376)

### EIP Editors' Workshop
- Replay: [YouTube](https://www.youtube.com/live/rCTx-K-aArM?si=nOrRR7FGbQQtxQPf)
- Reviewer interest: [Form](https://docs.google.com/forms/d/1IpyAonFEYJuSHke9t4BKzKfjDAjynOhPHxpU1G5FsnQ/viewform?edit_requested=true)

---

## 📅 Upcoming Protocol Calls

| Date & Time (UTC)         | Event                                                                                         |
|---------------------------|-----------------------------------------------------------------------------------------------|
| Jan 27, 2025, 12:00 UTC   | [eth_simulate Implementers' Meeting](https://github.com/ethereum/pm/issues/1248)             |
| Jan 27, 2025, 14:00 UTC   | Pectra Interop Testing Call                                                                  |
| Jan 27, 2025, 15:00 UTC   | [Stateless Implementers Call #30](https://github.com/ethereum/pm/issues/1263)                |
| Jan 27, 2025, 16:30 UTC   | [Portal Implementers Call #42](https://github.com/ethereum/pm/issues/1257)                   |
| Jan 28, 2025, 14:00 UTC   | FOCIL Breakout Room #3                                                                       |
| Jan 28, 2025, 16:00 UTC   | [EIP Editing Office Hour Meeting #50](https://github.com/ethcatherders/EIPIP/issues/377)     |
| Jan 29, 2025, 16:00 UTC   | [L2 Interop Working Group - Call #2](https://github.com/ethereum/pm/issues/1249)             |
| Jan 30, 2025, 12:00 UTC   | [EVMMAX Implementers Call #2](https://github.com/ethereum/pm/issues/1208)                    |
| Jan 30, 2025, 14:00 UTC   | [Execution Layer Meeting #204](https://github.com/ethereum/pm/issues/1253)                   |
| Jan 31, 2025, 14:00 UTC   | EIP-7732 breakout room #15                                                                   |

_PS: Based on Protocol calendar and GitHub Issues._

---

## 🛠️ Public Goods Funding

### [Octant Epoch 6](https://octant.app/projects)
A heartfelt thank you to all donors and supporters for making this round impactful. 💖

#### ECH Public Goods Challenge
Ethereum Cat Herders invite the community to empower Ethereum via Education, Community building, and Homesteading. Details coming soon!

---

## 🎉 Events

### [Consensus 2025 – Hong Kong (Feb 19, 2024)](https://consensus-hongkong2025.coindesk.com/agenda/event/-protocol-village-52?_gl=1*1xmrllb*_up*MQ..*_gs*MQ..)
Don’t miss the Ethereum dev sessions for engagement and ecosystem strengthening!

#### Upcoming Events
- [ETHDenver 2025](https://www.ethdenver.com/): Feb 23 - Mar 2, 2025
- [Staking Summit, Dubai](https://www.stakingsummit.com/): Apr 28–29, 2025
- [EthCC[8]](https://ethcc.io/): June 30–July 3, 2025
- [Devconnect 2025](https://devconnect.org/): TBD

---

## 🔗 Community Resources

- [Pectra Retrospective](https://ethereum-magicians.org/t/pectra-retrospective/22637?u=timbeiko) by Tim Beiko
- [Rough consensus: post-Pectra](https://mirror.xyz/nixo.eth/hT5F3Eo4iqQYNtoZCNqobogAr_Kd2QOmzqEtoizG5GA) by Nixo
- [Pectra Upgrade Tweet Thread](https://x.com/sassal0x/status/1882774548409659850) by Sassal
- [Ethereum Acceleration](https://www.paradigm.xyz/2025/01/ethereum-acceleration-1) by Paradigm
- [Scaling Ethereum L1 and L2s in 2025 and beyond](https://vitalik.eth.limo/general/2025/01/23/l1l2future.html) by Vitalik Buterin
- [Ethereum Macroeconomics via Dynamics](https://x.com/ethresearchbot/status/1881651783031722153) by EthResearch
- EIP explainers:
  - [EIP-7702 overview](https://www.youtube.com/watch?v=4G2KwbxjKi8) by letsgetonchain
  - [EIP-7623 deep dive](https://www.youtube.com/watch?v=FTNvl6F1w6I) by letsgetonchain
  - [ERC-7779 interoperability](https://etherworld.co/2025/01/24/erc-7779-understanding-redefining-wallet-interoperability/) by EtherWorld

---

### Share with us!
Updates about your project or client? Email [team@ethcatherders.com](mailto:team@ethcatherders.com) by Friday (EOD EST) to be included in next week's issue.

---

## 🐾 Stay Curious, Stay Connected, and Keep Purring
