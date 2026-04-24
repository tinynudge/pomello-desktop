# Review Agent Prompts

Detailed prompts for:
- **Phase 3:** 10 parallel review agents
- **Phase 4:** Reflection Agent
- **Per-Issue Confidence Scorer**

## Agent Overview

| Agent | Focus | Why |
|-------|-------|-----|
| **2x Guidelines Compliance** | AGENTS.md, conventions, commit format | Redundancy catches more violations |
| **1x Bug Detector** | SolidJS anti-patterns, TS traps, correctness | Focused scope, ignores pre-existing |
| **1x Security Reviewer** | Electron IPC, preload, XSS, secrets | Dedicated security expertise |
| **1x Behavioral Change Detector** | Unintended side effects, service changes | Catches scope creep |
| **1x Architecture/Design Reviewer** | Main/renderer/preload/domain layering, SOLID | Structural quality |
| **1x Performance Reviewer** | SolidJS reactivity, IPC overhead, bundle size | Runtime efficiency |
| **1x Accessibility/i18n Reviewer** | ARIA, semantic HTML, keyboard nav, translations | Inclusive design |
| **1x History Analyzer** | Git blame/history context | Understands *why* before flagging |
| **1x Test Reviewer** | Vitest, fixture patterns, coverage | Dedicated test expertise |

**Note:** Reflection Agent runs in Phase 4, after parallel review.

## Agent Prompts

### Agent 1 & 2: Guidelines Compliance (x2 for redundancy)

```
Review the branch changes for guidelines compliance and commit format:

Context from Phase 1:
- Guidelines: [summary from repo guidelines subagent]

Read the review guide at this skill's references/REVIEW-GUIDE.md file.

Instructions:
1. Read the branch diff (`git diff main...HEAD`) (focus on NEW/CHANGED code only)
2. Read AGENTS.md at the repo root for project conventions
3. Check each change against project guidelines, especially:
   - Commit message format: `type: description` (Conventional Commits)
   - Test files use *.spec.ts / *.spec.tsx (NOT .test.ts)
   - Tests render via __fixtures__/ helpers (renderApp, renderDashboard, etc.)
   - Tests use @solidjs/testing-library patterns
   - Shared types go in packages/domain
   - IPC handlers in packages/main/src/events/
   - Preload exposures in packages/preload/src/
   - Prettier: 100 char width (120 for spec files), 2-space indent, trailing commas (es5), single quotes
4. Check commit format:
   - Commit messages follow Conventional Commits (type: description)
   - Changes have a single concern (no mixed features/fixes)
   - No unrelated reformatting or drive-by changes
5. For each potential violation:
   - Quote the specific guideline being violated
   - Link to exact file:line
   - Explain why it violates the guideline
6. Score each issue 0-100 confidence
7. Only include issues where guideline EXPLICITLY mentions the concern

Return format:
ISSUE: [description]
GUIDELINE: "[exact quote from AGENTS.md or relevant config]"
LOCATION: [file:line]
CONFIDENCE: [0-100]
REASONING: [why this violates the guideline]

FORMAT_ISSUE: [description] (for commit format concerns)
CURRENT: [what exists]
EXPECTED: [what it should be]
CONFIDENCE: [0-100]

If no violations found, return: "No guideline violations detected."
```

### Agent 3: Bug Detector

```
Review the branch changes for bugs, anti-patterns, and correctness issues:

Context from Phase 1:
- Current behavior: [summary]
- Expected change: [description]

Read the review guide at this skill's references/REVIEW-GUIDE.md file.
Focus on Sections 2 (SolidJS Anti-Patterns), 4 (TypeScript Traps), and 6 (Correctness).

Instructions:
1. Read the branch diff (`git diff main...HEAD`) (focus on NEW/CHANGED code only)
2. Check SolidJS Anti-Patterns:
   - Destructuring props (breaks reactivity tracking)
   - Accessing signals outside reactive context (computed once, never updates)
   - Direct store mutation without setStore/produce
   - createEffect with implicit dependency tracking (use on() for explicit)
   - Store destructuring creating stale references
   - createSignal for complex objects (should use createStore)
   - Missing untrack for non-reactive reads inside effects
   - Conditional signal access breaking tracking
3. Check TypeScript Traps:
   - null vs undefined for default parameters
   - Array index access not guarded for potentially undefined
   - Truthiness checks instead of explicit comparisons for type guards
   - .filter() without type predicates when .map() can return undefined
   - Non-exhaustive switch statements on union types
4. Check Correctness:
   - Incomplete optional chaining (obj?.items.length should be obj?.items?.length)
   - Empty array not checked (truthy empty array produces blank page)
   - Async operations without error handling (crashes Electron)
   - Timer state machine inconsistencies (invalid state transitions)
   - Race conditions in async state updates (stale task selection)
5. IGNORE pre-existing issues (code that existed before this branch)
6. IGNORE style preferences and nitpicks
7. IGNORE security issues (covered by Security Reviewer)
8. IGNORE accessibility issues (covered by Accessibility Reviewer)
9. Score each issue 0-100 confidence

For BUG FIX branches, also verify:
- Does fix address root cause from Phase 1, or just the symptom?

Return format:
BUG: [description]
CATEGORY: [solidjs-anti-pattern / typescript-trap / correctness]
LOCATION: [file:line]
CONFIDENCE: [0-100]
EVIDENCE: [why this is definitely a bug, not intentional]
ROOT_CAUSE_ALIGNMENT: [addresses root / symptom-only / unclear] (bug fixes only)

If no bugs found, return: "No bugs detected in changes."
```

### Agent 4: Security Reviewer

```
Review the branch changes for security vulnerabilities:

Context from Phase 1:
- Current behavior: [summary]
- Expected change: [description]

Read the review guide at this skill's references/REVIEW-GUIDE.md file.
Focus on Section 3 (Electron Security).

Instructions:
1. Read the branch diff (`git diff main...HEAD`) (focus on NEW/CHANGED code only)

2. Check Electron-specific security:
   - nodeIntegration set to true in any BrowserWindow (CRITICAL)
   - contextIsolation set to false (CRITICAL)
   - Preload scripts exposing dangerous APIs (raw IPC, Node modules, file system)
   - IPC handlers that don't validate input (path traversal, injection)
   - electron-store containing plaintext secrets/tokens
   - shell: true in child_process calls
   - Unvalidated URLs in shell.openExternal or loadURL
   - webSecurity disabled

3. Check for XSS vulnerabilities:
   - innerHTML or dangerouslySetInnerHTML usage without sanitization
   - User input rendered without escaping
   - eval() or new Function() with dynamic content

4. Check for secrets and credentials:
   - Hardcoded API keys, tokens, passwords
   - Secrets in comments or TODOs
   - Credentials in config files that get committed
   - Hardcoded URLs that should use configuration

5. Check for data exposure:
   - PII in console.log or logger calls
   - Sensitive data in error messages rendered to users
   - User data logged without redaction

6. Check IPC contract safety:
   - New IPC channels that accept arbitrary data
   - IPC handlers that execute commands based on renderer input
   - Missing validation on IPC message payloads
   - Preload functions that bypass intended restrictions

7. IGNORE pre-existing issues (code that existed before this branch)
8. Score each issue 0-100 confidence

Return format:
SECURITY: [vulnerability type]
DESCRIPTION: [what the issue is]
LOCATION: [file:line]
CONFIDENCE: [0-100]
SEVERITY: [critical/high/medium/low]
EVIDENCE: [why this is a security issue]
REMEDIATION: [how to fix]

If no security issues found, return: "No security vulnerabilities detected in changes."
```

### Agent 5: Behavioral Change Detector

```
Review the branch changes for unintended behavioral changes:

Context from Phase 1:
- Branch scope: [what the changes intend to do]
- Current behavior: [how code works before changes]

Instructions:
1. Read the branch diff (`git diff main...HEAD`)
2. Identify changes that alter existing behavior BEYOND the stated scope:
   - Changed default values in signals, stores, or props
   - Modified validation rules or error messages
   - Altered rendering conditions (shows/hides UI differently)
   - Changed IPC message formats or handler behavior
   - Modified service plugin interface (ServiceFactory, Service methods)
   - Changed timer behavior (durations, state transitions, sounds)
   - Altered store schemas or default configurations
   - Changed hotkey bindings or menu items
   - Modified window management behavior (size, position, always-on-top)

3. For each behavioral change:
   - Is it clearly part of the stated purpose? If yes, skip.
   - Is it a necessary side effect of the intended change? Note it.
   - Is it unrelated to the stated purpose? Flag as HIGH priority.

4. Check IPC contract changes:
   - New preload functions added (changes the renderer API surface)
   - IPC handler signatures changed (breaks existing callers)
   - Return value types changed
   - Error handling behavior changed

5. Check service plugin impact:
   - ServiceFactory interface changes affect all service implementations
   - Changes to service registration in services/index.tsx
   - New required methods that existing services don't implement

6. Score each issue 0-100 confidence

Return format:
BEHAVIORAL_CHANGE: [what changed]
BEFORE: [old behavior]
AFTER: [new behavior]
LOCATION: [file:line]
IN_SCOPE: [yes/no/unclear]
CONFIDENCE: [0-100]
REASONING: [why this is a concern]

If no unintended changes, return: "All behavioral changes align with branch scope."
```

### Agent 6: Architecture/Design Reviewer

```
Review the branch changes for architectural and design issues:

Context from Phase 1:
- Current behavior: [summary]
- System architecture: [from project guidelines]

The monorepo packages are:
- packages/domain: Shared TypeScript types and interfaces (no runtime code)
- packages/preload: Electron preload scripts (contextBridge IPC exposure)
- packages/main: Electron main process (Node.js: app lifecycle, windows, stores, events)
- packages/renderer: SolidJS UI (app, auth, dashboard, select entry points)

Dependency flow: domain -> preload + main + renderer
IPC boundary: renderer <-> preload <-> main

Instructions:
1. Read the branch diff (`git diff main...HEAD`)
2. Check package boundary violations:
   - Does code respect the package dependency flow?
   - Is packages/domain importing from other packages? (reverse dependency)
   - Is packages/renderer importing Node.js modules? (process boundary violation)
   - Is packages/main importing browser/DOM APIs? (wrong process)
   - Is packages/preload exposing more than necessary? (surface area)
   - Are renderer-specific types in packages/domain? (should be in renderer)

3. Check IPC architecture:
   - New IPC handlers follow the pattern in packages/main/src/events/
   - New preload exposures follow the pattern in packages/preload/src/
   - TypeScript definitions for window.app are updated in types/
   - IPC communication follows the established pattern (invoke/handle, not send/on for request-response)

4. Check service plugin architecture:
   - Services implement the ServiceFactory interface from domain
   - Services are registered in packages/renderer/src/services/index.tsx
   - Service-specific code is isolated in its own directory
   - No cross-service dependencies (trello/ importing from zen/ etc.)

5. Check for anti-patterns:
   - Component doing too much (presentation + business logic + data fetching)
   - Prop drilling through many levels (should use context)
   - Shared mutable state between unrelated features
   - Business logic in preload scripts (should be in main or renderer)

6. Check SOLID violations:
   - Single Responsibility: Component/module doing multiple unrelated things?
   - Open/Closed: Modification instead of extension?
   - Dependency Inversion: High-level depending on low-level directly?

7. IGNORE pre-existing architectural issues
8. Score each issue 0-100 confidence

Return format:
ARCHITECTURE: [issue type]
DESCRIPTION: [what the issue is]
LOCATION: [file:line or package/module]
CONFIDENCE: [0-100]
IMPACT: [maintainability/scalability/testability/security]
REASONING: [why this is a concern]
SUGGESTION: [how to improve]

If no architectural issues found, return: "No architectural concerns detected in changes."
```

### Agent 7: Performance Reviewer

```
Review the branch changes for performance issues:

Context from Phase 1:
- Current behavior: [summary]
- Expected change: [description]

Read the review guide at this skill's references/REVIEW-GUIDE.md file.
Focus on Section 5 (Performance Red Flags).

Instructions:
1. Read the branch diff (`git diff main...HEAD`) (focus on NEW/CHANGED code only)

2. Check SolidJS reactivity performance:
   - Inline transformations in JSX (filter/map/sort creating new arrays on every signal update)
   - Heavy computation without createMemo
   - Unnecessary createEffect when createMemo would suffice
   - Missing onCleanup for timers/listeners (memory leaks in long-running Electron app)
   - Excessive signal granularity (too many fine-grained signals where a store would be simpler)
   - createSignal holding complex objects (should use createStore for fine-grained updates)

3. Check Electron/IPC performance:
   - Multiple sequential IPC calls that could be batched
   - Large objects passed over IPC without filtering
   - Synchronous IPC (ipcRenderer.sendSync) blocking renderer
   - Frequent IPC polling instead of event-based updates
   - Heavy computation in main process blocking UI responsiveness

4. Check bundle size impact:
   - Non-tree-shakeable library imports (import from root vs deep path)
   - New heavy dependencies added
   - Large assets bundled unnecessarily

5. Check rendering performance:
   - <For> vs <Index> usage (For for keyed lists, Index for index-based)
   - Unnecessary component re-creation (missing keys or unstable references)
   - Large DOM trees without virtualization

6. IGNORE pre-existing performance issues
7. Score each issue 0-100 confidence

Return format:
PERFORMANCE: [issue type]
DESCRIPTION: [what the issue is]
LOCATION: [file:line]
CONFIDENCE: [0-100]
IMPACT: [reactivity/ipc-overhead/bundle-size/memory-leak/render-performance]
EVIDENCE: [why this causes performance problems]
SUGGESTION: [how to improve]

If no performance issues found, return: "No performance concerns detected in changes."
```

### Agent 8: Accessibility/i18n Reviewer

```
Review the branch changes for accessibility and internationalization issues:

Context from Phase 1:
- Current behavior: [summary]
- Expected change: [description]

Read the review guide at this skill's references/REVIEW-GUIDE.md file.
Focus on Sections 8 (Accessibility) and 9 (Internationalization).

Instructions:

ACCESSIBILITY:
1. Read the branch diff (`git diff main...HEAD`) (focus on NEW/CHANGED code only)
2. Check ARIA usage:
   - ARIA roles follow structural requirements (option inside listbox, etc.)
   - role="button" has keyboard handler implementation
   - Interactive elements have accessible names (aria-label, aria-labelledby, visible text)
   - aria-hidden on decorative or loading elements
3. Check semantic HTML:
   - <ul>/<li> for lists, not <div> chains
   - <button> not <div> for clickable actions
   - <dialog> for modals (project uses native dialog elements)
   - Headings follow hierarchy (no skipping h2 to h4)
4. Check keyboard navigation:
   - New interactive elements reachable via tab
   - Custom components implement keyboard interaction
   - Focus visible indicators present
   - Hotkey additions are documented and don't conflict
5. Check focus management:
   - Modals/dialogs trap focus appropriately
   - Focus returns to trigger element on close
   - Dynamic content updates announced to screen readers

INTERNATIONALIZATION:
6. Check string handling:
   - No hardcoded user-facing English strings (should use translation system)
   - No concatenation of translated strings (sentence structure varies by locale)
   - ARIA labels should be translatable
   - Error messages should be translatable
7. Check the translations/ directory:
   - New user-facing strings have corresponding translation keys
   - Translation keys are descriptive and organized

8. IGNORE pre-existing accessibility/i18n issues
9. Score each issue 0-100 confidence

Return format:
A11Y: [issue description]
CATEGORY: [aria / semantic-html / keyboard / focus-management / i18n-hardcoded / i18n-concatenation / i18n-missing]
LOCATION: [file:line]
CONFIDENCE: [0-100]
IMPACT: [screen-reader / keyboard-nav / locale-support]
EVIDENCE: [specific element or string that has the issue]
SUGGESTION: [how to fix]

If no issues found, return: "No accessibility or i18n concerns detected in changes."
```

### Agent 9: History Analyzer

```
Review the branch changes with git history context:

Instructions:
1. For each file changed in the branch:
   - Run `git blame <file>` on the base branch
   - Run `git log -p --follow -5 <file>` for recent history
2. Identify context-based issues:
   - Code being changed was recently modified (potential conflict/churn)
   - Code has extensive history of bug fixes (fragile area)
   - Original author left explanatory comments that the changes remove
   - Code pattern was intentionally designed (don't break it)
3. Identify missed context:
   - Changes modify code without understanding why it exists
   - Changes remove defensive code that was added for a reason
   - Changes duplicate logic that exists elsewhere (found via history)
4. For BUG FIX branches, check for recurring patterns:
   - Run: `git log --oneline --since="6 months ago" -- <file>`
   - If 2+ similar fixes in same file/function, flag as recurring
5. Score each issue 0-100 confidence

Return format:
HISTORY_ISSUE: [description]
LOCATION: [file:line]
HISTORY_CONTEXT: [what git blame/log revealed]
CONFIDENCE: [0-100]
RECOMMENDATION: [what the author should consider]
RECURRING_PATTERN: [yes/no] (bug fixes only)
SIMILAR_FIXES: [list commit summaries if recurring]

If no history concerns, return: "No history-based concerns detected."
```

### Agent 10: Test Reviewer

```
Review the branch changes for test coverage and quality:

Context from Phase 1:
- Expected change: [description]
- Is bug fix: [yes/no]

Read the review guide at this skill's references/REVIEW-GUIDE.md file.
Focus on Section 7 (Testing Principles).

CRITICAL: Only packages/renderer has unit tests. Do not look for tests elsewhere.

Instructions:
1. Read test files changed/added in the branch
2. Read production code changes to understand what needs testing

3. Check test coverage (flag missing tests):
   | Scenario | Confidence | Priority |
   |----------|------------|----------|
   | New component/feature without tests | 95% | HIGH |
   | Bug fix without regression test | 90% | HIGH |
   | Critical path changes without test updates | 90% | HIGH |
   | New IPC handler without corresponding test | 85% | HIGH |
   | New branches without coverage | 85% | MEDIUM |
   | Error handling paths without tests | 80% | MEDIUM |

4. Check project-specific test conventions:
   a) Test fixture pattern (85%):
      - Tests should render via renderApp, renderDashboard, renderAuth, renderSelect from __fixtures__/
      - simulate object wraps user interactions and must be used for complex flows
      - Mock factories: createMockAppApi, createMockService, createMockSettings
      - MSW mockServer for API mocking

   b) Test file naming (85%):
      - Must be *.spec.ts or *.spec.tsx
      - NOT .test.ts or .test.tsx
      - Split by concern: App.spec.tsx, App.selectTask.spec.tsx, App.dial.spec.tsx

   c) Test framework conventions (85%):
      - Uses describe/it blocks (not test)
      - Vitest globals enabled (no imports for describe/it/expect)
      - vi.fn(), vi.useFakeTimers() for mocking
      - @solidjs/testing-library for rendering and queries
      - @testing-library/user-event for interactions

   d) Assertion conventions (85%):
      - Use role selectors (getByRole) over test IDs where possible
      - Assert on rendered output, not internal state
      - Explicitly create test data for assertions (don't rely on mock defaults)

5. Check test quality:
   a) Test doesn't verify actual change (85%)
   b) Flaky indicators (85%): setTimeout without fake timers, hardcoded dates, order-dependent assertions
   c) Logic in tests (85%): if/else in test methods, loops with assertions
   d) Missing test isolation (80%): tests share state via beforeAll
   e) Missing cleanup (80%): timers not advanced/cleared, MSW handlers not reset

6. IGNORE pre-existing test issues
7. Score each issue 0-100 confidence

Return format:
TEST_ISSUE: [description]
PATTERN: [missing coverage / convention violation / quality issue]
LOCATION: [test file:line or "missing test for X"]
CONFIDENCE: [0-100]
EVIDENCE: [specific code or condition]
SUGGESTION: [what test should be added/fixed]

If tests look good, return: "Test coverage appears adequate for this change."
```

---

## Phase 4: Reflection Agent

**Timing:** Run AFTER all 10 parallel review agents complete.

```
Evaluate the review results for completeness:

BRANCH_SUMMARY:
- Type: [bug fix / feature / refactor / perf]
- Files changed: [count, grouped by package]
- Lines added/removed: [+X / -Y]
- Test files changed: [yes/no]
- Monorepo packages affected: [list]

PHASE_1_CONTEXT:
- Root cause (for bugs): [from 5 Whys]
- Branch scope: [summary]

AGENT_RESULTS:
[For each agent, list: agent name, issues found count, "no issues" if zero]

SYNTHESIZED_ISSUES:
[List of issues that passed >= 80 threshold]

Instructions:

1. COVERAGE GAP CHECK
   | Change Characteristic | Expected Finding | Check |
   |----------------------|------------------|-------|
   | Bug fix branch | "Missing regression test" OR test file in changes | Required |
   | Bug fix branch | ROOT_CAUSE_ALIGNMENT finding | Required |
   | New feature | Test coverage for new behavior | Required |
   | New UI component | A11y findings OR aria attributes in code | Required |
   | User-facing strings added | i18n findings OR translation calls | Required |
   | New IPC handler | Security findings OR input validation in code | Required |
   | New preload exposure | Security review of exposed API | Required |
   | >5 files changed | At least one Architecture finding OR explicit "no concerns" | Expected |
   | >200 lines changed | Multiple agent categories with findings | Expected |

2. CROSS-AGENT CONSISTENCY
   - Contradictions or duplicates to merge?

3. RCA ALIGNMENT (bug fixes only)
   - Phase 1 root cause: [X]
   - Bug Detector ROOT_CAUSE_ALIGNMENT: [addresses root / symptom-only / unclear]
   - Mismatch? Flag for re-review

4. CONFIDENCE CALIBRATION
   - List all issues with confidence 80-85 (borderline)
   - For each: "Would this definitely be flagged in human review?"
   - Downgrade to 79 (exclude) if uncertain

5. SUSPICIOUS SILENCE CHECK
   - Security Reviewer found nothing on changes with new IPC/preload changes: SUSPICIOUS
   - Test Reviewer found nothing on bug fix with no test changes: SUSPICIOUS
   - A11y Reviewer found nothing on changes with new UI components: SUSPICIOUS
   - All 10 agents found nothing on changes with >100 lines: SUSPICIOUS

Return:
GAPS_FOUND:
- [Gap]: [description] -> RE-RUN: [Agent name]

CONTRADICTIONS:
- [Issue] flagged differently by multiple agents -> RESOLUTION: [merged finding]

DOWNGRADED_ISSUES:
- [Issue]: confidence 82 -> 79 (excluded) because [reason]

SUSPICIOUS_SILENCE:
- [Agent] found nothing, but [condition] suggests issues likely -> RE-RUN: [yes/no]

RE_REVIEW_NEEDED: [yes/no]
RE_REVIEW_AGENTS: [list of agents to re-run]
RE_REVIEW_FOCUS: [specific areas to emphasize]
```

### Re-Run Protocol

If Reflection Agent returns `RE_REVIEW_NEEDED: yes`:

1. **Re-launch specified agents** with enhanced prompts:
   ```
   [Original prompt]

   ADDITIONAL FOCUS (from Reflection):
   - [Specific area to check]

   Previous run found no issues. Please re-verify with extra attention to:
   - [Focus area 1]
   - [Focus area 2]
   ```

2. **Merge re-run results** with original findings
3. **Do NOT re-run Reflection** (avoid infinite loop)
4. **If re-run still finds nothing**, accept and note in output

---

## Per-Issue Confidence Scoring

For issues near the threshold (78-85), launch a dedicated scorer agent:

```
Score this potential issue independently:

ISSUE: [description from review agent]
LOCATION: [file:line]
CODE_CONTEXT: [relevant code snippet]

Scoring criteria (see REVIEW-GUIDE.md Section 1):
- Is this definitely wrong, or could be intentional?
- Is this in NEW code from this branch?
- Is there clear evidence of the failure mode?
- Would this cause production issues?

Return:
SCORE: [0-100]
REASONING: [why this score]
INCLUDE: [yes/no based on >=80 threshold]
```
