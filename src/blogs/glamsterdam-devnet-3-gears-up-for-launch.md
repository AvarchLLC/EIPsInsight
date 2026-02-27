---
title: "Glamsterdam Devnet 3 Gears Up for Launch"
slug: "glamsterdam-devnet-3-gears-up-for-launch"
date: 2026-02-27
author: "Yash Kamal Chaturvedi"
category: "Ethereum Upgrades"
tags: ["Glamsterdam", "Devnet 3", "BAL Devnet", "EIP-7954", "EIP-8037", "Testing"]
readTime: 5
featured: false
excerpt: "ACDE #231 confirmed that Glamsterdam’s execution layer work is entering a focused testing phase, with Devnet 3 scoped tightly around stability, client coordination, and realistic performance validation."
image: "https://raw.githubusercontent.com/AvarchLLC/EIPsInsight/refs/heads/main/public/blogs/glamsterdam-devnet-3.png"
authorAvatar: "https://etherworld.co/content/images/size/w300/2022/05/IMG.jpg"
authorBio: "Blockchain Content & Ops Specialist, Avarch LLC"
authorTwitter: "https://x.com/YashKamalChatu1"
authorLinkedin: "https://etherworld.co/author/yash-kamal-chaturvedi/"
authorGithub: "https://github.com/yashkamalchaturvedi"
summaryPoints:
  - "Glamsterdam discussions at ACDE #231 emphasized stabilization over new feature additions."
  - "BAL Devnet 3 is being scoped more tightly to ship on time without overloading client teams."
  - "EIP-7954, networking updates, and a simplified EIP-8037 configuration anchor the next devnet."
  - "Test infrastructure constraints are quietly shaping which designs are viable in this cycle."
---

While the broader roadmap continues to evolve, [Glamsterdam](https://etherworld.co/tag/glamsterdam/) discussions at ACDE #231 show the execution layer moving into a more focused testing phase. With multiple devnets running in parallel and scope being refined, client teams are prioritizing stability and coordination over feature expansion as Devnet 3 gears up for launch.

- [Devnet Stability Becomes the Immediate Priority](#devnet-stability-becomes-the-immediate-priority)  
- [BAL DevNet3 Scope Narrows for Timely Launch](#bal-devnet3-scope-narrows-for-timely-launch)  
- [Testing Constraints Shape Design Decisions](#testing-constraints-shape-design-decisions)  

## Devnet Stability Becomes the Immediate Priority

Several [Glamsterdam](https://etherworld.co/glamsterdam-devnet-2-advances-as-devs-finalizes-cfi-scope/) devnets are currently active, each surfacing practical execution layer challenges.

Blob Devnet 0 continues testing partial file handling. Lighthouse and Prysm are onboarded, but some execution clients are still struggling to sync to head. These issues are under investigation. At this stage, the focus is less on new features and more on making sure different clients behave consistently under real network conditions.

BAL Devnet 2 is testing local level access list functionality. Itrax synced successfully after onboarding, while Erigon ran into sync issues that are still being debugged. This kind of divergence is exactly what devnets are meant to uncover. Specs can look clean on paper, but real client implementations often expose edge cases.

Perf Devnet 3 had to be relaunched after the chain halted and could not be recovered. Rather than patching around the issue, the team chose to reset. Devnets are test environments, and restarting can sometimes be the fastest way to move forward when stability breaks.

## BAL DevNet3 Scope Narrows for Timely Launch

BAL Devnet3 is expected to launch soon, but with a tighter scope than originally planned.

The devnet is set to include [EIP-7954](https://eipsinsight.com/eips/eip-7954), which increases maximum contract size, selected networking updates, and [EIP-8037](https://eipsinsight.com/eips/eip-8037) addressing state creation gas costs. Earlier discussions explored a dynamic adjustment model for [EIP-8037](https://eipsinsight.com/eips/eip-8037), but the complexity of testing that approach proved heavier than expected.

Instead, teams agreed to move forward with a static hardcoded value tied to a 100 million block gas assumption. The decision reflects a practical tradeoff. More complex mechanisms can be revisited later. For now, the goal is to get a stable version running and tested.

Teams indicated that a test release should be ready soon, assuming no last minute issues arise.

## Testing Constraints Shape Design Decisions

Part of the slowdown around [EIP-8037](https://eipsinsight.com/eips/eip-8037) came from test infrastructure limitations. Many legacy tests written in YAML could not easily support the required logic changes. This pushed teams to migrate test cases into Python.

The migration adds short term overhead, but it strengthens long term test maintainability. It also highlights an often overlooked reality. Protocol design is closely tied to tooling maturity. What can be implemented and shipped safely depends not just on specs, but on the testing frameworks behind them.

Overall, [Glamsterdam](https://etherworld.co/glamsterdam-at-crossroads-whats-in-whats-out-whats-still-uncertain/) is shaping up to be a disciplined upgrade cycle. Progress is steady, even if not dramatic. The emphasis right now is on sync reliability, interoperability, and controlled scope. That groundwork is what ultimately determines whether changes make it to mainnet smoothly.

---

Published Feb 27, 2026
