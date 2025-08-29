---
title: "Purr-suit of Ethereum 🐾 #3"
date: 2025-01-26
author: Pooja Ranjan
image: https://hackmd.io/_uploads/HyG8GJEO1g.png
---

#### Your Weekly Dose of Blockchain Updates and Meows!

In this edition, we bring you key highlights from the Ethereum ecosystem, including updates on the upcoming Pectra (Prague + Electra) upgrade, insights from the latest All Core Devs Consensus Call, and details on recent implementers’ and breakout meetings. For those new to this series, don’t worry—you can catch up with our [previous newsletter here](https://hackmd.io/@poojaranjan/PoE2).

Other highlights include exciting news about Ethereum Improvement Proposals (EIPs) in progress, updates on the Public Goods Funding, and upcoming events. Stay tuned for more updates as we continue our mission to empower Ethereum through education, community building, and innovation.


## [Pectra](https://www.ethcatherders.com/upgrades/pectra) (Prague+Electra) Upgrade

### [Consensus (ACDC) #149](https://github.com/ethereum/pm/issues/1258), (January 23, 2025) 

- **devnet-6** will likely launch in the week of Jan 27th
-  Proposed timing for Pectra:
    * **SEPOLIA** (Feb 12, 2025) - epoch: 219392; slot: 7020544; timestamp: 1739980128; forkId: 0xbafd09c3
    * **HOLESKY** (Feb 19, 2025) - epoch: 113152; slot: 3620864; timestamp: 1739352768; forkId: 0xf818a0d6
    * Mainnet: Mar 11, 2025 (NOT FINAL, just an ambitious goal)
- [Recording](https://www.youtube.com/live/uIjPkGezPOg)
- [Podcast (Audio) by EthCatHerders](https://open.spotify.com/episode/0jWlhb1F9yxQB5FxiPcGo5?si=sh9dPM7ySeytNBrHu8wvvg)
- [Twitter summary](https://x.com/nixorokish/status/1882473020020990169) by Nixo
- [Highlights of Ethereum's All Core Devs Meeting (ACDC) #149](https://etherworld.co/2025/01/23/highlights-of-ethereums-all-core-devs-meeting-acdc-149/) by Yash Kamal Chaturvedi
-  [Ethereum All Core Developers Consensus Call #149](https://www.galaxy.com/insights/research/ethereum-all-core-developers-consensus-call-149/) by Christine_dkim

### Pectra Interop #21 (January 20, 2025)
- Move forward with Pectra devnet 6, incorporating a new genesis file and validator set increase to 50,000–100,000.
- Mario will release updates with EIP-7702 changes and fixes.
- Client teams to review and comment on PRs as needed.
- [Notes](https://hackmd.io/@poojaranjan/InteropTestingNotes#Interop-Testing-Call-Jan-20-2025) by EthCatHerders, [Fellowship of EthMagicians](https://ethereum-magicians.org/t/client-testing-call-21-january-20-2025/22591). No recording is available.

## Breakout & Implementers’ Meeting 

### [EOF Implementers Call #65](https://github.com/ethereum/pm/issues/1243) (Jan 22nd, 2025)
- [Recording](https://www.youtube.com/watch?v=5ywv6QpS2sE), [FEM Notes](https://ethereum-magicians.org/t/eof-implementers-call-64-january-22-2025/22466/2) by Danno Ferrin

### [JSON-RPC Standardization Breakout](https://github.com/ethereum/pm/issues/1252) (Jan 20, 2024)
This is a new breakout room meeting initiated as a result of discussion to be continued from the last ACDE. 

* The discussion focused on broader goals and stakeholder involvement, emphasizing the need to refine internal processes before involving external stakeholders like wallets and RPC providers. 
* Suggestions included using the group to address consistency issues and align new feature proposals with broader stakeholder needs. 
* Key action items were identified: 
    * incorporating `eth_fillTransaction` `into the execution spec, refining and documenting new methods, ensuring RPC compatibility through rigorous testing, and improving specification documentation for better usability. 
- As next step, devs decided to continue async discussions on `eth_fillTransaction` and RPC compatibility tests on Discord. 
* Future discussions will prioritize error handling and establishing processes for integrating new features and methods.
- The next meeting will be scheduled in the next two weeks.
- [Recording](https://www.youtube.com/watch?v=S_lbb9JNXzY) & [Notes](https://www.youtube.com/watch?v=S_lbb9JNXzY) by EthCatHerders

### eth_simulate 
No meeting on Jan 20, 2024

### [EIPIP Metting #112](https://github.com/ethcatherders/EIPIP/issues/375) (January 15, 2025)

- **Stagnant Tag Discussion**: A few suggestions to address issues with the "Stagnant" tag for Core EIPs under active consideration.  Will bediscussed further in the next meeting.  
- **EIP Reviewers**: Proposal to introduce formal EIP Reviewer roles approved. Details to be finalized in the Editors' Workshop.  
- **Editors' [Workshop Announcement](https://github.com/ethcatherders/EIPIP/issues/372)**: Workshop planned for onboarding and discussions.  
- **[Proposal Builder Tool](https://eipsinsight.com/proposalbuilder)**:  
  - Get the .md file to document a proposal using this tool. Demo shared, tool deemed useful for new authors. 
  - Requested adding the tool link to [eips.ethereum.org](https://eips.ethereum.org).

### [EVM Resource Pricing Breakout #1](https://github.com/ethereum/pm/issues/1239) (January 15, 2025)

The Gas Repricing Working Group meeting is a new breakout focused on three key agenda items: benchmarking efforts, short-term pricing changes, and research for medium-term updates. 

Presentations included an overview of the [Nethermind gas-benchmarks tool](https://github.com/NethermindEth/gas-benchmarks) by Marek, showcasing its use in identifying bottlenecks, and [Jacek’s Gas Cost Estimator tool](https://github.com/imapp-pl/gas-cost-estimator), which proposed updated gas cost schedules tested across seven EL clients. 

Discussions addressed strategies for short-term adjustments, such as single and multi-block warming to improve efficiency, and medium-term considerations for hardforks like Fusaka and Amsterdam. Concerns around backward compatibility were highlighted, with suggestions to leverage EOF mechanisms for versioning and restrict gas schedule changes to EOF contracts. 

* **Benchmarking Efforts**:  
   - Tools presented for analyzing gas costs and addressing bottlenecks in existing schedules.  
   - Proposals to refine gas pricing schedules for greater efficiency.  
* **Short-Term Pricing Changes**:  
   - Adjustments to precompile gas costs due to benchmarking insights revealing they are underpriced.  
   - Ideas like single and multi-block warming were discussed, with efficiency gains estimated at 5-6% for single block and ~15% for multi-block. 
* **Medium-Term Strategy**:  
   - Addressed strategies for future hardforks like Fusaka & Amsterdam.  
   - Backward compatibility concerns raised about repricing, with suggestions to restrict changes to EOF contracts.  
   - Agreement that increasing gas prices historically caused breakages, while reducing prices carries lower risk.  
* **Backward Compatibility**:  
   - Suggested leveraging EOF mechanisms for versioning to mitigate issues.  
   - Discussions on feasibility of automating checks to detect potential contract breakages.  
* **Future Considerations**:  
   - Incentivizing fair contract usage without disadvantaging smaller contracts.  
   - Exploring zk-proof pricing adjustments (e.g., 10x keccak costs).
   - Dcrapis proposed a session on EVM memory pricing, potentially to be covered in a future call if time doesn’t permit.   

### Action Items  
- Draft EIPs for short-term pricing changes.  
- Continue benchmarking efforts to refine gas cost schedules.  
- Explore applying new gas schedules only to EOF contracts to preserve legacy compatibility.   
- Schedule EVM memory pricing presentation for the next call.  




### [FOCIL Meeting #2](https://github.com/ethereum/pm/issues/1238) (Jan 14, 2025)
- [Notes](https://github.com/ethereum/pm/issues/1238#issuecomment-2590169551) by Matthew
- **CL Implementation**: The team is actively working on implementation, though some bugs may still need addressing.  
- **FOCIL Implementation Notes**: [Terence shared detailed notes](https://hackmd.io/@ttsao/focil-implementation-notes).  
- Lighthouse has provided support for the effort.  
- The plan includes shifting focus to RETH on the EL side.  
- Launching a percentage of EL clients with a modified mempool is in progress.  
- Kurtosis is supporting the definition of mempool logic with Tx Spammer Configuration. 
- **Implementation Goals**:  
  - Implement blocks with inclusion lists.  
  - Expected to complete in the next day or two.  
- **FOCIL Intro Slides**: [Shared by Soispoke](https://docs.google.com/presentation/d/1i31wpJpI5B9hb4RE55-eDg1fI3yIoa2T8hj7pNqHQjw/edit?usp=sharing).  
- The team has started work in Privacy & Anonymity area. Interested contributors can reach out to Soispoke.  
- **Relevant Links**:  
  - [Beacon API PR](https://github.com/ensi321/beacon-APIs/pull/1)  
  - [Jacob's Update](https://notes.ethereum.org/@jacobkaufmann/HJzQ1eEDkg)  
  - [Jihoon's Talk](https://hackmd.io/@jihoonsong/Skidf4ePye)  
  - Docker and Kurtosis Config: [Repo](https://github.com/jihoonsong/local-devnet-focil/)  
  - [Setting Up Local FOCIL Devnet](https://hackmd.io/@jihoonsong/Skidf4ePye)  
- **Local Devnet**: A local devnet for FOCIL is ready to be run.  

#### Client Updates  

- **Teku**: Progress underway with active work on FOCIL implementation.  
  - [Teku FOCIL Branch](https://github.com/Consensys/teku/tree/focil).  
- **Nethermind**: Prototyping and implementation in progress ([PR](https://github.com/NethermindEth/nethermind/pull/8003)).  
- **Lodestar**: Differences addressed in this [PR](https://github.com/ChainSafe/lodestar/pull/7342).  
- **Metrics**: Katya has started working on beacon metrics, to be shared soon.  
- **Timeline**: Aiming for the FOCIL devnet by the end of January, with progress on track.  


## EIPs Update
### [EIPsInsight](https://eipsinsight.com/insight/2025/1)

The latest Ethereum Improvement Proposals (EIPs) updates reflect progress across various repositories:
- **EIPs**: 10 proposals transitioned to `Stagnant`, 4 moved to `Review` and 5 new added to `Draft`.
- **ERCs**: 4 proposals advanced to `Final`,  4 are in `Last Call`, 3 transitioned to `Review` and 3 added to `Draft`.
- **RIPs**: 3 proposals added as `Draft`.


[![Screenshot 2025-01-26 at 8.14.08 AM](https://hackmd.io/_uploads/r1s7BnX_Jx.png)](https://eipsinsight.com/insight/2025/1)

#### Proposals in the `Last Call`
* ERC-7734: Decentralized Identity Verification (DID)
* ERC-7751: Wrapping of bubbled up reverts
* ERC-7820: Access Control Registry
* ERC-7818: Expirable ERC-20

_PS: This data is collected from [EIPsInsight](https://eipsinsight.com/insight/2025/1)_

#### Other tools 
- [Editor's Leaderboard](https://eipsinsight.com/Reviewers)

### Call For Input (Open)
- [Define "Meta"](https://github.com/ethcatherders/EIPIP/issues/373)
- [Forcibly withdraw EIP-7675](https://github.com/ethcatherders/EIPIP/issues/374)
- [Allow Links to Blockchain Commons](https://github.com/ethcatherders/EIPIP/issues/376)

### EIP Editors' Workshop
- If you've missed the Workshop, watch the [replay here](https://www.youtube.com/live/rCTx-K-aArM?si=nOrRR7FGbQQtxQPf)
- If you are interested in joining as EIP Reviewer, please fill out the [Reviewing Interest Form](https://docs.google.com/forms/d/1IpyAonFEYJuSHke9t4BKzKfjDAjynOhPHxpU1G5FsnQ/viewform?edit_requested=true).

## Upcoming Protocol Calls

| Date & Time (UTC)          | Event                                                                                          |
|----------------------------|------------------------------------------------------------------------------------------------|
| Jan 27, 2025, 12:00 UTC    | [eth_simulate Implementers' Meeting](https://github.com/ethereum/pm/issues/1248)              |
| Jan 27, 2025, 14:00 UTC    | Pectra Interop Testing Call                                                                   |
| Jan 27, 2025, 15:00 UTC    | [Stateless Implementers Call #30](https://github.com/ethereum/pm/issues/1263)                 |
| Jan 27, 2025, 16:30 UTC    | [Portal Implementers Call #42](https://github.com/ethereum/pm/issues/1257)                    |
| Jan 28, 2025, 14:00 UTC    | FOCIL Breakout Room #3                                                                        |
| Jan 28, 2025, 16:00 UTC    | [EIP Editing Office Hour Meeting #50](https://github.com/ethcatherders/EIPIP/issues/377)      |
| Jan 29, 2025, 16:00 UTC    | [L2 Interop Working Group - Call #2](https://github.com/ethereum/pm/issues/1249)              |
| Jan 30, 2025, 12:00 UTC    | [EVMMAX Implementers Call #2](https://github.com/ethereum/pm/issues/1208)                     |
| Jan 30, 2025, 14:00 UTC    | [Execution Layer Meeting #204](https://github.com/ethereum/pm/issues/1253)                    |
| Jan 31, 2025, 14:00 UTC    |EIP-7732 breakout room #15       |

*PS: This table is created based on Protocol calendar and GitHub Issues.*

## Public Goods Funding

### [Octant Epoch 6](https://octant.app/projects) 

[![Screenshot 2025-01-25 at 11.13.38 AM](https://hackmd.io/_uploads/Hyc9GkVdJg.png)
](https://x.com/poojaranjan19/status/1883198652451102720)

A [heartfelt thank you](https://x.com/EthCatHerders/status/1883198121775140942) to all the donors and supporters who contributed to making this round impactful. 💖 Your generosity will fuel us, to continuously work for you all and drive meaningful change.

#### ECH Public Goods Challenge
Ethereum Cat Herders is on a mission to empower Ethereum through **E**ducation, **C**ommunity building, and **H**omesteading Ethereum initiatives. Now, we’re calling on you—our amazing community and supporters—to help us take this mission even further. Your contributions fuel the tools, resources, and connections that keep Ethereum thriving.

Stay tuned—more details on Public Goods Challenge coming soon. Let’s build a stronger Ethereum ecosystem together! 🐱

## Events

### [Consensus 2025](https://consensus-hongkong2025.coindesk.com/agenda/event/-protocol-village-52?_gl=1*1xmrllb*_up*MQ..*_gs*MQ..&gclid=Cj0KCQiA19e8BhCVARIsALpFMgH_uFDK1Cv6rmnxoIugaVrVruxZUC3R1X-QbI3-v9WYfRJ8fA7GxmMaAuNkEALw_wcB) - HK (Feb 19, 2024)

[![Screenshot 2025-01-26 at 10.33.55 AM](https://hackmd.io/_uploads/rkAWIAXOke.png)](https://consensus-hongkong2025.coindesk.com/agenda/event/-protocol-village-52?_gl=1*1xmrllb*_up*MQ..*_gs*MQ..&gclid=Cj0KCQiA19e8BhCVARIsALpFMgH_uFDK1Cv6rmnxoIugaVrVruxZUC3R1X-QbI3-v9WYfRJ8fA7GxmMaAuNkEALw_wcB)

If you’re at Consensus HK, don’t miss the session with our Ethereum devs! The Ethereum community’s participation and sharing of the latest developments at events like these are fantastic opportunities to foster engagement and strengthen connections within the ecosystem. Excited to see the Cat Herders leading the coordination for this representation. 

#### [Upcoming Events](https://ethereum.org/en/community/events/)

- [ETHDenver 2025](https://www.ethdenver.com/): February 23 - March 2, 2025
- [Staking Summit, Dubai](https://www.stakingsummit.com/): April 28 - 29, 2025
- [EthCC[8]](https://ethcc.io/): June 30 -July 3, 2025
- [Devconnect 2025](https://devconnect.org/): TBD

## Community Resources
- [Pectra Retrospective](https://ethereum-magicians.org/t/pectra-retrospective/22637?u=timbeiko) by Tim Beiko
- [Rough consensus: post-Pectra](https://mirror.xyz/nixo.eth/hT5F3Eo4iqQYNtoZCNqobogAr_Kd2QOmzqEtoizG5GA) By Nixo
- A [Tweet Thread](https://x.com/sassal0x/status/1882774548409659850) on Pectra upgrade by Sassal
- [Ethereum Acceleration](https://www.paradigm.xyz/2025/01/ethereum-acceleration-1) by Paradigm
- [Scaling Ethereum L1 and L2s in 2025 and beyond](https://vitalik.eth.limo/general/2025/01/23/l1l2future.html) by Vitalik Buterin
- [Ethereum Macroeconomics via Dynamics](https://x.com/ethresearchbot/status/1881651783031722153) by EthResearch
- EIP explainiers
  - [A high level overview of EIP-7702](https://www.youtube.com/watch?v=4G2KwbxjKi8) by letgetonchain
  - [EIP-7623 Explained + Deep dive in to the Evm code changes](https://www.youtube.com/watch?v=FTNvl6F1w6I) by letsgetonchain
  - [ERC-7779: Understanding & Redefining Wallet Interoperability](https://etherworld.co/2025/01/24/erc-7779-understanding-redefining-wallet-interoperability/) by EtherWorld
 
### Share with us
Have updates about your project or client? Share them with us at team@ethcatherders.com by Friday (end of day EST) to be added in the next issue, scheduled for release the following Monday.
## Stay Curious, Stay Connected and Keep Purring 🐾