---
title: "Why Ethereum Core Developers Removed FOCIL from the Glamsterdam Upgrade"
slug: "why-ethereum-core-devs-removed-focil-from-glamsterdam-upgrade"
date: 2025-12-25
author: "Yash Kamal Chaturvedi"
category: "Ethereum Upgrades"
tags: ["Ethereum", "Glamsterdam", "FOCIL", "Censorship Resistance", "Governance", "Core Devs", "Protocol Upgrades", "HEKA"]
readTime: 6
featured: true
excerpt: "Ethereum core developers confirmed that FOCIL will not ship in the Glamsterdam upgrade, not due to technical failure but because of Ethereum’s evolving governance model, prioritizing process discipline and predictable upgrade cycles."
image: "https://private-user-images.githubusercontent.com/69413160/528232247-f3aa23af-39c5-48d5-aa42-df84b70d0437.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjY2ODU5MjUsIm5iZiI6MTc2NjY4NTYyNSwicGF0aCI6Ii82OTQxMzE2MC81MjgyMzIyNDctZjNhYTIzYWYtMzljNS00OGQ1LWFhNDItZGY4NGI3MGQwNDM3LnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTEyMjUlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUxMjI1VDE4MDAyNVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTU3NzNmMDU2OTgxNzdlMDBiYTNhOWZkN2ZlZTM4MmRjM2I1Yzg1OTAyNGVkNDViYjYwNzY1ZDYwZDY1ZGFkMWMmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.kWSWP2i7qq0bF1FKXJwSBWytW-b2vRS9kuev6AJKRMc"
authorAvatar: "https://etherworld.co/content/images/size/w300/2022/05/IMG.jpg"
authorBio: "Blockchain Content & Ops Specialist, Avarch LLC"
authorTwitter: "https://x.com/YashKamalChatu1"
authorLinkedin: "https://etherworld.co/author/yash-kamal-chaturvedi/"
authorGithub: "https://github.com/yashkamalchaturvedi"
summaryPoints:
  - "FOCIL will not ship in Glamsterdam, despite strong ecosystem support."
  - "Decision driven by governance discipline, not lack of technical confidence."
  - "Community backing created pressure, but not final consensus."
  - "FOCIL remains a strong candidate for the upcoming HEKA upgrade."
---

# Why Ethereum Core Developers Removed FOCIL from the Glamsterdam Upgrade

Ethereum core developers have confirmed that FOCIL (Fork-Choice enforced Inclusion Lists) will not ship in the upcoming Glamsterdam upgrade, despite strong technical support from Layer-2 teams, censorship-resistance researchers, & intent-based protocol designers. The decision, finalized during [ACDC #171](https://etherworld.co/highlights-from-the-all-core-developers-consensus-acdc-call-171/), was not driven by a newly discovered security flaw or a loss of confidence in FOCIL’s goals. 

Instead, it reflects a process-first governance choice as Ethereum transitions to a more structured & predictable upgrade pipeline.

- [FOCIL’s Value Was Not in Question](#focils-value-was-not-in-question)
- [The Core Tension Was Governance, Not Engineering](#the-core-tension-was-governance-not-engineering)
- [Community Support Created Pressure, Not Consensus](#community-support-created-pressure-not-consensus)
- [Why Glamsterdam Moved Forward Without It](#why-glamsterdam-moved-forward-without-it)

## FOCIL’s Value Was Not in Question

[FOCIL](https://etherworld.co/2025/08/10/focil-eip-7805-cfid-with-strong-developer-community-backing/) is designed to strengthen Ethereum’s censorship-resistance by enforcing transaction inclusion guarantees at the fork-choice level. Research discussed during the call indicated that FOCIL can improve censorship-resistance economics by nearly an order of magnitude in certain attack models, dramatically increasing the cost for attackers attempting sustained censorship while keeping user costs relatively low.

The feature has particular importance for protocols that rely on time-sensitive transaction inclusion, including:
- Optimistic rollups  
- Intent settlement layers  
- Prediction markets  
- Exit windows in staking & bridging protocols  
- Any system with fraud-proofs or challenge-period timers  

As a result, many ecosystem participants viewed [FOCIL](https://etherworld.co/2025/02/28/how-solo-stakers-focil-strengthen-censorhip-resistance-on-ethereum/) as a natural fit for Glamsterdam.

## The Core Tension Was Governance, Not Engineering

The longest & most contentious discussion of ACDC #171 focused on how [FOCIL](https://eipsinsight.com/eips/eip-7805) was being advanced, not whether it should exist. Ethereum has recently adopted a headliner-first upgrade process, explicitly designed to reduce scope creep, last-minute surprises, & repeated delays that plagued earlier forks.

Under this new process, major protocol changes are expected to compete transparently for inclusion during defined scoping windows. Several developers argued that pre-declaring FOCIL’s inclusion risked bypassing these shared rules, even if the feature itself was valuable.

One recurring theme during the debate was that credible commitments to ship a feature must not override the governance framework itself. In other words, Ethereum’s long-term scalability depends not only on technical correctness, but also on predictable & trusted decision-making.

## Community Support Created Pressure, Not Consensus

FOCIL enjoys unusually broad support across advanced protocol designers, especially those building censorship-sensitive systems. That support, however, also created pressure to accelerate inclusion without fully resolving disagreements about scope, timelines, & architectural implications.

Core developers acknowledged that community fatigue had set in after extended debates across multiple calls. Ironically, that fatigue reinforced the case for sticking to the new governance process rather than bending it under pressure.

Rather than rejecting FOCIL outright, the call converged on a compromise that preserves momentum without destabilizing Glamsterdam:
- **FOCIL is DFI (Deferred for Inclusion) for [Glamsterdam](https://etherworld.co/tag/glamsterdam/)**, meaning it will not ship in this fork  
- **FOCIL is CFI (Considered for Inclusion) for [HEKA](https://eipsinsight.com/eips/eip-8081)**, the following upgrade  

This outcome ensures FOCIL receives dedicated analysis, structured debate, & proper headliner consideration, rather than being rushed into a fork whose scope was already nearing lock-in.

## Why Glamsterdam Moved Forward Without It

By the end of ACDC #171, Glamsterdam’s scope was effectively finalized. With Trustless Payments confirmed to remain in the fork, & several other ePBS-related components already consuming review bandwidth, developers agreed that adding FOCIL would re-open scoping risks at exactly the wrong moment.

FOCIL is now positioned as a serious HEKA candidate, not an abandoned proposal. Its deferral signals that Ethereum’s core developers are prioritizing process legitimacy & upgrade stability, even when that means postponing widely supported features.