---
title: "EIP Proposal Builder and Validation Issues with Legacy EIPs"
author: "Dhanush Naik"
date: "2025-08-28"
avatar: https://avatars.githubusercontent.com/u/85634565?v=4
role: Full Stack Developer
category: Tools
tags: [EIP Proposal Builder, EIPW, Validation, Tooling]
image: "https://github.com/AvarchLLC/EIPsInsight/blob/main/public/Nody2.png?raw=true"
---

## 1. Introduction

We recently developed a tool called [**EIP Proposal Builder**](https://eipsinsight.com/proposalbuilder#split#eip#import), designed to simulate the behavior of **EIPW Lint** (the official Ethereum Improvement Proposal linter). The goal of the builder is to allow contributors to **import an EIP draft and automatically validate it** against the latest linting rules, ensuring proposals are compliant before submission.

Since the rules enforced by EIPW evolve over time, the builder uses the **most recent rule set** to catch formatting, structural, and semantic issues.


## 2. Linting Rules Implemented

The Proposal Builder integrates the full set of **EIPW linting rules**, covering both:

* **Markdown formatting rules** (sections, references, spelling, links, quotes, etc.)
* **Preamble rules** (headers like `author`, `status`, `category`, etc. must follow strict formats).

Examples of checks include:

* Ensuring relative links instead of external ones (`markdown-rel-links`)
* Ensuring required sections like **Rationale** and **Security Considerations** exist (`markdown-req-section`)
* Requiring GitHub usernames in the author field (`preamble-author`)
* Prohibiting the use of words like *standard* in the title (`preamble-re-title`)

(Full rule list is provided in Appendix A).


## 3. Testing on Legacy EIPs

We tested the Proposal Builder by importing **ERC-20**, one of the most widely used and finalized Ethereum standards.

Surprisingly, several linting errors were reported. Examples:

* **Extra Sections**: `## Token` was flagged as an unexpected section.
* **Missing Sections**: Required sections like `Rationale` and `Security Considerations` were absent.
* **Invalid Links**: External links to Google Docs were flagged for not being relative.
* **Preamble Issues**:

  * `author` field lacked GitHub usernames.
  * `discussions-to` was `null` instead of a valid Ethereum Magicians thread.
  * `title` contained the word *Standard*, which is now prohibited.
  * `description` was empty.

![image](https://hackmd.io/_uploads/SJLdfhOKge.png)


## 4. Analysis

These errors do **not** indicate that the Proposal Builder is faulty. Instead, they highlight the fact that:

1. **EIPW lint rules are recent** – many of them were added long after ERC-20 (2015) was finalized.
2. **Legacy EIPs were never retroactively updated** – ERC-20 and other early proposals remain in their original format, even if they do not fully comply with today’s stricter standards.
3. **Backward Compatibility vs. Modern Standards** – ERC-20 is accepted as valid because it predates these rules, but any *new proposal* must comply.

Thus, the errors demonstrate that the Builder correctly enforces the **current linting policy**, which ensures new EIPs follow stricter and more standardized formatting.

## Appendix B – ERC-20 Linting Errors

| Rule ID                      | Error Message                                                     | Explanation                                                                                                        | Suggested Fix (if this were a new EIP)                                                     |
| ---------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `markdown-order-section`     | Body has extra section(s): `## Token`                             | EIPs must follow a strict section order and naming convention. `## Token` is not part of the approved section set. | Rename/remove or fold content under approved sections like **Specification**.              |
| `markdown-rel-links`         | Non-relative link: `https://docs.google.com/...`                  | External links are disallowed; all links must be relative to the repository.                                       | Mirror the document into the EIPs repo and use a relative link.                            |
| `markdown-req-section`       | Missing required sections: `Rationale`, `Security Considerations` | All EIPs must include rationale and security considerations as dedicated sections.                                 | Add `## Rationale` and `## Security Considerations` with appropriate content.              |
| `preamble-author`            | Author must include at least one GitHub username                  | Current format uses only names and email addresses.                                                                | Update author list to include GitHub handles (e.g., `Vitalik Buterin (@vbuterin)`).        |
| `preamble-discussions-to`    | `discussions-to` is not a valid URL (set to `null`)               | Discussions-to must point to a valid discussion thread.                                                            | Add a valid Ethereum Magicians forum thread link.                                          |
| `preamble-len-description`   | Description is too short (minimum 2 characters)                   | The `description` field is empty.                                                                                  | Provide a concise description (e.g., "Defines a standard interface for fungible tokens."). |
| `preamble-re-discussions-to` | Must link to `ethereum-magicians.org` thread                      | The discussions-to field does not follow required format.                                                          | Use URL pattern: `https://ethereum-magicians.org/t/.../<id>`.                              |
| `preamble-re-title`          | Title should not contain "standard" (or similar words)            | Titles must avoid the word "standard" for clarity and neutrality.                                                  | Change title from **Token Standard** to simply **Tokens** or **ERC-20: Token Interface**.  |

### Example: ERC-20 Proposal (Modern Format, Lint-Compliant)

````markdown
---
eip: 20
title: ERC-20: Token Interface
description: Defines a standard interface for fungible tokens on Ethereum.
author: Fabian Vogelsteller (@frozeman), Vitalik Buterin (@vbuterin)
discussions-to: https://ethereum-magicians.org/t/erc-20-token-interface/1234
status: Final
type: Standards Track
category: ERC
created: 2015-11-19
---

## Abstract

This standard defines a common interface for fungible tokens within smart contracts.  
It provides basic methods for transferring tokens and approving third parties to spend tokens on one’s behalf.

## Motivation

A standard token interface allows tokens to be re-used across applications, including wallets, DEXs, and other contracts.  
This interoperability increases security, reduces duplicated effort, and fosters a unified token ecosystem.

## Specification

### Methods

- **name**

    Returns the name of the token (e.g., `"MyToken"`).  
    Optional usability function.

    ```solidity
    function name() public view returns (string)
    ```

- **symbol**

    Returns the token symbol (e.g., `"HIX"`).  
    Optional usability function.

    ```solidity
    function symbol() public view returns (string)
    ```

- **decimals**

    Returns the number of decimals used (e.g., `8` means divide by `100000000` for display).

    ```solidity
    function decimals() public view returns (uint8)
    ```

- **totalSupply**

    Returns the total token supply.

    ```solidity
    function totalSupply() public view returns (uint256)
    ```

- **balanceOf**

    Returns the balance of `_owner`.

    ```solidity
    function balanceOf(address _owner) public view returns (uint256 balance)
    ```

- **transfer**

    Transfers `_value` tokens to `_to`.  
    MUST fire a `Transfer` event.  
    Transfers of `0` MUST be treated as normal and fire a `Transfer`.

    ```solidity
    function transfer(address _to, uint256 _value) public returns (bool success)
    ```

- **transferFrom**

    Transfers `_value` tokens from `_from` to `_to`.  
    MUST fire a `Transfer` event.  
    Used for withdrawals and delegated spending.

    ```solidity
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)
    ```

- **approve**

    Approves `_spender` to withdraw up to `_value`.  
    Overwrites previous allowance.  
    Clients SHOULD set allowance to `0` before a new non-zero value to mitigate race conditions.

    ```solidity
    function approve(address _spender, uint256 _value) public returns (bool success)
    ```

- **allowance**

    Returns remaining allowance from `_owner` for `_spender`.

    ```solidity
    function allowance(address _owner, address _spender) public view returns (uint256 remaining)
    ```

### Events

- **Transfer**

    MUST trigger when tokens are transferred, including zero value transfers.  
    Minting SHOULD trigger a `Transfer` event with `_from = 0x0`.

    ```solidity
    event Transfer(address indexed _from, address indexed _to, uint256 _value)
    ```

- **Approval**

    MUST trigger on any successful `approve`.

    ```solidity
    event Approval(address indexed _owner, address indexed _spender, uint256 _value)
    ```

## Rationale

This interface was designed to provide the minimal requirements for fungible token interoperability, while allowing flexibility for extensions (e.g., ERC-777).  
A standardized approach reduces fragmentation and ensures compatibility across wallets, contracts, and DApps.

## Security Considerations

- **Allowance race condition**: A spender may front-run an `approve` change, leading to double-spending.  
  Mitigation: UI/clients SHOULD enforce setting allowance to `0` before updating to a new value.  
- **Event emissions**: Events MUST be emitted consistently to ensure off-chain systems (e.g., wallets, explorers) function reliably.  
- **Zero transfer behavior**: Transfers of `0` MUST be processed to avoid inconsistencies across implementations.

## Copyright

Copyright and related rights waived via [CC0](../LICENSE.md).
````


The following Markdown document represents a **corrected, lint-compliant version of ERC-20**, which our **Proposal Builder** was able to generate:

✅ Key fixes compared to the original ERC-20:

* **Title**: Changed from *Token Standard* → *ERC-20: Token Interface*.
* **Description**: Added meaningful, >2 characters.
* **Authors**: GitHub usernames included.
* **Discussions-to**: Set to a valid Ethereum Magicians thread (example link with `/t/.../id`).
* **Sections**: Added `Rationale` and `Security Considerations`.
* **Removed** `## Token` (folded its contents into `Specification`).
* **Relative links only** (`../LICENSE.md` is relative).


## 5. Conclusion

* The Proposal Builder is functioning correctly, faithfully replicating EIPW lint behavior.
* The errors observed in ERC-20 are due to **outdated formatting in legacy EIPs**, not tool malfunction.
* Going forward, the Builder can serve as a valuable resource for **authors of new EIPs** to ensure compliance with the latest guidelines before submission.
