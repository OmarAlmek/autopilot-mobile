# AutoPilot Mobile & Venture OS — Master Project Context & Roadmap

> **Instructions for Copilot / AI Assistant:**
> Read this entire document before generating code or suggestions. This document contains the local developer environment configuration, recent environment fixes, stakeholder roadmap (Dr. Moustafa Awad), full Venture OS product specifications, and current front-end technical requirements.

---

## 1. Local Development Environment & Proxy Setup (Resolved Configuration)

* **Repository Location:** `C:\Users\Omar\Desktop\AutoPilot\autopilot-mobile`
* **Custom AI Proxy Service:** Running locally via Node.js on `http://127.0.0.1:3011` / `http://localhost:3011`.
* **VS Code Chat Configuration:** Pointed via `%APPDATA%\Code\User\chatLanguageModels.json` to port `3011` (`http://127.0.0.1:3011/v1/chat/completions`).

### Mandatory Terminal Rules for Local Dev:
To prevent `net::ERR_CONNECTION_REFUSED` errors, local development requires **TWO separate, concurrent terminal tabs**:
1. **Terminal 1 (Proxy Terminal - MUST STAY OPEN):**
   ```bash
   cd C:\Users\Omar\Desktop\AutoPilot\autopilot-mobile
   node proxy.js
   # Success Output: 🚀 Universal Conversion Proxy Active on http://localhost:3011
    ```

---

## 6. Founder Profile & Core Ecosystem Background

### Lead Instructor & Founder: Dr. Moustafa Awad

* **Role:** Founder of AutoPilot AI & VentureOS | Adjunct Professor at AUC Executive Education | Regional Technology Manager at an IBM Gold Partner.
* **Credentials:** 13+ Years in Tech & Business | MSc in Engineering (AUC) | INSEAD AI Venture Program | 5 IEEE Publications | CCIE Certified | 2x Cisco Sales Champion.
* **Industry Leadership:** Drives business automation and agentic AI for banking, telecom, and enterprise operations across the Middle East and Africa (MEA).
* **Enterprise Background:** Ex-Cisco, Intel, e& (Etisalat), AUC, USAID, DAI, INSEAD.
* **Startup History:**
   * **AutoPilot AI:** Enterprise finance/accounting Agent Studio.
   * **VentureOS:** 12-week AI-native company building platform.
   * **Eden AI:** Enterprise AI platform.
   * **eYouth:** Former CTO (Ed-Tech).
   * **Spectro Systems:** IoT platform.
   * **YallaSa7el & TheFitChamp:** Early startup ventures.

---

### Core Platform Architecture & Synergy

The product ecosystem consists of two closely linked flagship initiatives:

#### 1. AutoPilot AI (Enterprise Finance Agent Studio)

* **What it is:** An enterprise Agent Studio designed for accounting and finance teams.
* **Key Capabilities:**
   * Autonomous, role-based agents for Accounts Receivable (AR), Accounts Payable (AP), Cash Control, Reconciliations, and Financial Reporting.
   * **Human-in-the-Loop Governance:** Keeps approvals, audit traces, context, and accountability visible so finance teams can adopt autonomy with confidence.
* **Goal:** Automates repeatable finance operations while integrating directly with enterprise workflows.

#### 2. VentureOS (12-Week AI-Native Company Program)

* **What it is:** A practical, source-backed company-building program and execution platform for founders, operators, and corporate executives.
* **Key Capabilities:**
   * Moves learners from use-case selection to prototype, trust engineering, and GTM strategy.
   * Generates a 30/60/90-day operating system and personal company playbook.
   * Features the **Sundai AI Startup Toolbox** (55 tools), 10 composite industry tracks, and dynamic AI-personalized lesson guidance.

#### 3. Strategic Consulting & Enterprise AI Enablement

* Focuses on moving enterprises from Proof-of-Concept (POC) to production-scale AI systems.
* Specialized in **Banking AI Enablement**, RAG systems, permissioned agent architectures, and executive AI decision frameworks across MEA.

---

### Key Technical Guidelines Derived from Dr. Moustafa's Philosophy

When generating code or architecture for `autopilot-mobile`:

1. **Human-in-the-Loop & Trust First:** Always design AI features with clear approval mechanisms, explicit permission bounds, and zero black-box obscurity.
2. **Enterprise Production Standards:** Prioritize idempotency, auditability, role-based action tiers, and robust fallbacks over raw model autonomy.
3. **Finance & Workflow Discipline:** Keep user context, financial compliance, and practical operational utility at the center of UI design choices.