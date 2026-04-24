---
name: pomello-code-review
description: Thorough local branch code reviews for pomello-desktop with independent solution exploration, confidence-scored issue detection, and Electron/SolidJS-specific checks. Use when asked to review changes, review a branch, or review code before creating a PR in the pomello-desktop repo.
---

# Pomello Desktop Code Review Skill

Thorough local branch reviews with independent solution exploration and confidence-scored issue detection.
Optimized for the `pomello-desktop` Electron/SolidJS monorepo (pnpm workspaces).
Designed to run **before** a PR is created — reviews the current branch diff against the base branch.

## Core Principles

1. **Accuracy over speed** - Take time to catch real issues, reduce false positives
2. **Confidence-based reporting** - Only report >=80% confidence issues
3. **Context preservation** - Delegate all file/diff reading to subagents
4. **Independent exploration** - Understand problem and brainstorm solutions BEFORE reading changes
5. **Parallel specialized agents** - Multiple focused agents catch more than one generalist
6. **Redundancy for critical checks** - 2x agents for guidelines = fewer missed violations
7. **Code is truth** - Trust code diffs over commit messages or branch names

## Mandatory: Subagent Delegation

**All file/diff reading MUST use subagents. No exceptions.**

### Why

Reading raw diffs consumes massive context (10-50K tokens per branch). Main agent fills context -> forgets early analysis -> misses issues.

**Solution:** Delegate all file/diff reading to subagents. Each has fresh context, returns structured summaries, then frees context. Main agent stays lean for synthesis.

### Main Agent Constraints

**NEVER do in main conversation:**
- `git diff` or any diff command
- `git show <file>` / `cat` / `head` / `tail` on source files
- Read file contents directly
- Any command outputting code

**ONLY do in main conversation:**
- Branch metadata (`git log --oneline`, `git branch`)
- Verification command summary (counts only)
- Synthesis from subagent summaries
- User communication

---

## Context Accumulation

Each phase outputs a **compact summary** (~5 lines). All Phase 3 agents receive identical context.

```
Context = Phase 0 summary + Phase 1 summary + Phase 2 summary
```

**Context Block (sent to all agents):**
```
Branch: {head} -> {base}
Type: {bug fix / feature / refactor}
Commits: {count} commits ahead of {base}

Problem (Phase 1):
- Root cause HYPOTHESIS: {one line}
- Current behavior: {one line}
- Expected change: {one line}

Solutions (Phase 2):
- Minimal: {one line}
- Proper: {one line}
- Failure modes: {list}
- Branch approach: {minimal/proper/other}
```

No selective routing. All agents see the same accumulated context.

---

## Workflow Phases

### Phase 0: Resolve Branch

**Determine what to review from the current branch:**

1. Get current branch: `git branch --show-current`
2. Determine base branch (typically `main`): `git merge-base HEAD main`
3. Get commit count: `git rev-list --count main..HEAD`
4. Get changed file list: `git diff --name-only main...HEAD`

**Skip conditions:**

| Condition | Action |
|-----------|--------|
| On main/master | Inform: "You're on the base branch. Switch to your feature branch first." Stop. |
| No commits ahead of base | Inform: "No commits ahead of base branch. Nothing to review." Stop. |
| Uncommitted changes | Warn: "You have uncommitted changes that won't be included in the review. Commit or stash first?" |

**Bug Fix Detection** (1+ signal = bug fix review mode):

| Signal Source | Keywords |
|---------------|----------|
| Branch name | fix/, bug/, hotfix/, patch/ |
| Commit type | `fix:` prefix |
| Commit messages | fix, bug, hotfix, patch, resolve, crash, error, issue, regression |

**Steps:**
1. Detect current branch and base
2. Get metadata: commit count, changed files, commit messages
3. Check skip conditions
4. Output plan and wait for confirmation

```
## Review Plan for branch: {branch} ({N} commits ahead of {base})

**Phase 0:** Resolve branch (main agent - metadata only)
**Phase 1:** Understand Problem
  - Explore the problem (SUBAGENT) -> root cause HYPOTHESIS
  - Read repo guidelines (SUBAGENT)
**Phase 2:** Brainstorm Solutions
  - Minimal fix, proper fix, failure modes (main agent)
  - Read branch diff (SUBAGENT)
  - Compare approaches
**Phase 3:** Parallel Agent Review (10 agents)
**Phase 4:** Reflection (1 agent)
**Phase 5:** Output (main agent)

Proceed? (yes/no)
```

### Phase 1: Understand the Problem

**Goal:** Understand what needs to change BEFORE seeing the diff.

#### 1. Explore the Problem (SUBAGENT)

```
Explore the problem to form a root cause hypothesis:
- Identify affected areas (packages: main, renderer, preload, domain)
- Trace the flow related to the problem through the monorepo layers:
  domain (types) -> preload (IPC bridge) -> main (Electron) + renderer (SolidJS UI)
- Use available history (git log, git blame) to understand context
- Gather any relevant information from the environment

For bug fixes, apply 5 Whys to form a HYPOTHESIS:
1. Why did the problem occur?
2. Why did that condition exist?
3. Why wasn't it prevented earlier?
4. Why does the system allow this state?
5. Why wasn't this caught before?

Return:
- Current behavior summary
- 5 Whys chain (for bugs)
- Root cause HYPOTHESIS: [one sentence - this is a theory to be verified]
- Fix scope: [Root cause fix / Contributing factor / Symptom-only]
- Key references (file:line, config, etc.)
```

#### 2. Read Repo Guidelines (SUBAGENT)

```
Read project guidelines for pomello-desktop:
- Read AGENTS.md at repo root
- Extract: coding standards, test conventions, architecture patterns
- Note the monorepo structure: packages/main, packages/renderer, packages/preload, packages/domain
- Note the technology stack: Electron, SolidJS, Vitest, pnpm workspaces

Return: Summary of guidelines relevant to this review
```

**Phase 1 Output:**
- What is the current behavior?
- What problem do the changes address?
- What is the root cause HYPOTHESIS? (for bugs: 5 Whys chain)
- What packages are affected?

### Phase 2: Brainstorm Solutions

**Goal:** Avoid anchoring bias by brainstorming BEFORE reading the diff.

**Steps:**

1. **Brainstorm** (main agent) - Answer three questions:

| Question | Purpose |
|----------|---------|
| **Minimal fix:** What's the smallest change to stop the immediate problem? | Identify quick/safe option |
| **Proper fix:** What change addresses the root cause? | Identify ideal solution |
| **Failure modes:** What could go wrong with either approach? | Identify edge cases |

2. **Read branch diff** (SUBAGENT)
```
Read the branch diff (`git diff main...HEAD`) and summarize:
- What files changed (group by monorepo package: main, renderer, preload, domain)
- What approach was taken
- Key changes (summarize, don't paste raw code)
- Which monorepo packages are affected
- Any IPC changes (new handlers, preload exposures)

Return: Branch approach summary (5 lines max)
```

3. **Compare** (main agent): Which approach did the branch take? (minimal/proper/other)

**Phase 2 Output:**
```
MINIMAL_FIX: [one sentence]
PROPER_FIX: [one sentence]
FAILURE_MODES: [comma-separated list]
BRANCH_APPROACH: [minimal / proper / other - brief explanation]
```

### Phase 3: Parallel Agent Review

Launch **10 specialized agents in parallel** (all receive same context):

| Agent | Focus |
|-------|-------|
| **2x Guidelines Compliance** | AGENTS.md, project conventions, commit format (redundancy) |
| **1x Bug Detector** | SolidJS anti-patterns, TypeScript traps, correctness |
| **1x Security Reviewer** | Electron IPC security, preload safety, XSS, secrets |
| **1x Behavioral Change Detector** | Unintended side effects, service plugin changes |
| **1x Architecture/Design Reviewer** | Main/renderer/preload/domain layering, SOLID |
| **1x Performance Reviewer** | SolidJS reactivity, Electron IPC overhead, bundle size |
| **1x Accessibility/i18n Reviewer** | ARIA, semantic HTML, keyboard nav, translations |
| **1x History Analyzer** | Git blame/log context |
| **1x Test Reviewer** | Vitest conventions, fixture patterns, coverage |

Each agent MUST read the AGENT-PROMPTS.md reference file in this skill's `references/` directory for their specific detailed prompt.

Each agent MUST read the REVIEW-GUIDE.md reference file in this skill's `references/` directory for review criteria and confidence scoring.

#### Synthesize Results

1. **Collect** all issues from 10 agents
2. **Deduplicate** - Same issue from multiple agents = higher confidence
3. **Filter** - Only include >= 80% confidence
4. **Verify** - For borderline (80-85), re-check: Bug or preference? New or pre-existing?
5. **Format** - Use output template with file:line references

### Phase 4: Reflection

After synthesis, run the **Reflection Agent** to catch missed issues:

| Check | Purpose |
|-------|---------|
| Coverage gaps | Expected findings missing? (e.g., bug fix without "missing test" flag) |
| Cross-agent consistency | Contradictions or duplicates to merge? |
| Confidence calibration | Borderline issues (80-85) should be excluded? |
| Suspicious silence | Agent found nothing when issues likely? |

**Re-run protocol:** If gaps detected, re-launch specific agents with enhanced focus. Do NOT re-run Reflection (avoid loops).

See `references/AGENT-PROMPTS.md` for detailed Reflection Agent prompt.

### Phase 5: Output

Output the review to the terminal.

See `references/REVIEW-GUIDE.md` Section 11 for output format.

---

## Reference Files

| File | Content |
|------|---------|
| `references/REVIEW-GUIDE.md` | All review criteria, scoring, patterns, output format |
| `references/AGENT-PROMPTS.md` | Detailed prompts for 10 parallel agents + reflection |

All reference files are relative to this skill's directory.

---

## Project-Specific Context

This skill is designed for the `pomello-desktop` monorepo:

1. **Read AGENTS.md first** - Contains architecture, monorepo structure, commands, testing conventions
2. **Understand the monorepo packages:**
   - `packages/domain` - Shared TypeScript types (pure type definitions, no runtime code)
   - `packages/preload` - Electron preload scripts (contextBridge IPC exposure)
   - `packages/main` - Electron main process (Node.js: app lifecycle, windows, stores, IPC handlers)
   - `packages/renderer` - SolidJS UI (multiple entry points: app, auth, dashboard, select)
3. **Service architecture** - Plugin-like system for task management integrations (Trello, Zen, Mock)
4. **IPC pattern** - Main <-> Renderer via preload scripts exposing `window.app` API
5. **Only `packages/renderer` has unit tests** - Don't look for tests elsewhere
6. **Test fixture pattern** - Tests render via `renderApp`, `renderDashboard`, etc. from `__fixtures__/`
7. **Commit format** - Conventional Commits by convention (not enforced via hooks)
8. **CI verification** - `pnpm verify` runs format, lint, typecheck, test
