# Code Review Guide

Complete reference for reviewing the `pomello-desktop` Electron/SolidJS monorepo. Organized by review concern.

## Table of Contents

1. [Confidence Scoring](#1-confidence-scoring) - When to report vs skip
2. [SolidJS Anti-Patterns](#2-solidjs-anti-patterns) - Signals, stores, effects, reactivity pitfalls
3. [Electron Security](#3-electron-security) - IPC, preload, contextBridge, process isolation
4. [TypeScript Traps](#4-typescript-traps) - Type system pitfalls
5. [Performance Red Flags](#5-performance-red-flags) - Reactivity, IPC overhead, bundle size
6. [Correctness Checks](#6-correctness-checks) - Runtime safety, edge cases
7. [Testing Principles](#7-testing-principles) - Vitest, SolidJS Testing Library, MSW, fixtures
8. [Accessibility](#8-accessibility) - ARIA, semantic HTML, keyboard navigation
9. [Internationalization](#9-internationalization) - Translation patterns
10. [Commit & Branch Format](#10-commit--branch-format) - Commit messages, scope, minimal changes
11. [Output Format](#11-output-format) - How to report issues

---

## 1. Confidence Scoring

Score each potential issue 0-100. **Only report issues >= 80.**

### Quick Reference

| Confidence | Meaning | Report? |
|------------|---------|---------|
| 90-100 | "Will break production" - clear evidence | Yes |
| 80-89 | "Probably wrong" - strong signals | Yes |
| 70-79 | "Looks suspicious" - uncertain | No |
| <70 | Speculative | No |

**Rule of thumb**: If you have to argue why it's a problem, it's <80.

### Scoring Scale

| Score | Meaning | Action |
|-------|---------|--------|
| 90-100 | **Certain** - Verified in code, clear impact | Report |
| 80-89 | **High confidence** - Strong evidence | Report |
| 60-79 | **Moderate** - Possible issue, needs verification | Don't report |
| 40-59 | **Low** - Might be intentional | Don't report |
| 0-39 | **Speculative** - No clear evidence | Don't report |

### Confidence Factors

**Increases (+10-20 each):**
- Verified issue exists by re-reading code
- Clear violation of documented guidelines (AGENTS.md)
- Obvious bug (null deref, missing return, wrong type)
- Security vulnerability with clear exploit path
- Pattern known to cause production issues

**Decreases (-10-20 each):**
- Style preference vs actual bug
- Might be handled elsewhere in codebase
- Depends on runtime context you can't verify
- Similar pattern exists elsewhere and works
- Could be intentional design decision
- "Feels wrong" without concrete reason

### False Positive Filters

**Auto-skip these (do not report):**

- **Pre-existing code** - Issue exists in lines NOT modified by the branch
- **Linter-handled** - Would be caught by ESLint/Prettier/Stylelint
- **Test code** - Lower bar for type safety (still flag security issues)
- **Generated code** - Build outputs in `dist/`

### Verification Checklist

Before assigning >= 80:

1. **Re-read the code** - Did you actually verify?
2. **Bug vs preference** - Definitely wrong, not just different?
3. **Not handled elsewhere** - Checked rest of the changes?
4. **Actionable** - Can explain what's wrong and how to fix?
5. **Evidence-based** - Specific code evidence, not intuition?

---

## 2. SolidJS Anti-Patterns

### CRITICAL: Destructuring props breaks reactivity

```tsx
// BAD: Destructuring loses reactive tracking
function MyComponent(props) {
    const { name, count } = props; // BROKEN - reads once, never updates
    return <div>{name}: {count}</div>;
}

// GOOD: Access props directly or use splitProps/mergeProps
function MyComponent(props) {
    return <div>{props.name}: {props.count}</div>;
}

// GOOD: When you need to split
function MyComponent(props) {
    const [local, rest] = splitProps(props, ['name']);
    return <div {...rest}>{local.name}</div>;
}
```

**Confidence: 95%** - Destructuring props is the #1 SolidJS mistake. Component will render with initial values and never update.

### CRITICAL: Accessing signals outside reactive context

```tsx
// BAD: Reading signal value outside reactive scope
const [count, setCount] = createSignal(0);
const doubled = count() * 2; // Reads once at creation, never updates

// GOOD: Wrap in createMemo or use inside JSX
const doubled = createMemo(() => count() * 2);
// or inside JSX: <div>{count() * 2}</div>
```

**Confidence: 95%** - Value computed once at module/function level won't track signal changes.

### HIGH: Mutating store objects directly without produce/reconcile

```tsx
// BAD: Direct mutation without store setter
const [store, setStore] = createStore({ items: [] });
store.items.push(newItem); // Mutation not tracked!

// GOOD: Use setStore with path or produce
setStore('items', items => [...items, newItem]);
// or with immer's produce:
setStore(produce(draft => { draft.items.push(newItem); }));
```

**Confidence: 90%** - Direct mutation bypasses SolidJS's fine-grained reactivity tracking. The project uses immer for store immutability.

### HIGH: createEffect without explicit dependency tracking

```tsx
// BAD: Effect depends on signal but intent is unclear
createEffect(() => {
    console.log("Value changed:", someSignal());
    doSideEffect();  // Does this need someSignal? Unclear.
});

// GOOD: Use on() for explicit tracking
createEffect(on(someSignal, (value) => {
    console.log("Value changed:", value);
    doSideEffect();
}));
```

**Confidence: 85%** - Implicit tracking can cause effects to re-run unexpectedly when unrelated signals are read inside.

### HIGH: Calling signal getters in event handlers when value is stale

```tsx
// BAD: Captures stale closure
const handleClick = () => {
    setTimeout(() => {
        console.log(count()); // This actually works in SolidJS (signals are always current)
    }, 1000);
};

// NOTE: Unlike React, SolidJS signals always return current value.
// But SolidJS store values accessed via destructuring ARE stale.
const { items } = store; // STALE - captured at destructure time
const handleClick = () => {
    console.log(items); // Stale reference
    console.log(store.items); // Current value - correct
};
```

**Confidence: 88%** - Store destructuring creates stale snapshots. Signal getters are always current.

### MEDIUM: Using createSignal when createStore is more appropriate

```tsx
// BAD: Signal holding complex object - entire object replaces on any change
const [state, setState] = createSignal({ name: '', items: [], count: 0 });
setState({ ...state(), count: state().count + 1 }); // Replaces entire object

// GOOD: Store for nested/complex state - fine-grained updates
const [state, setState] = createStore({ name: '', items: [], count: 0 });
setState('count', c => c + 1); // Only count subscribers re-run
```

**Confidence: 82%** - Signals replace the entire value; stores provide path-based updates for fine-grained reactivity.

### MEDIUM: Missing untrack for non-reactive reads inside effects

```tsx
// BAD: Reading a signal inside effect that shouldn't trigger re-run
createEffect(() => {
    const threshold = configSignal(); // Re-runs when config changes - unintended
    if (dataSignal() > threshold) {
        notifyUser();
    }
});

// GOOD: untrack config read if only data changes should trigger
createEffect(() => {
    const threshold = untrack(() => configSignal());
    if (dataSignal() > threshold) {
        notifyUser();
    }
});
```

**Confidence: 80%** - Prevents unnecessary effect re-runs when a read is informational, not reactive.

### MEDIUM: Conditional signal access breaks tracking

```tsx
// BAD: Signal in second branch might not track
const display = () => {
    if (showSimple()) {
        return simpleName();
    }
    return fullName(); // Only tracks if showSimple() is false on first run
};

// NOTE: SolidJS tracks ALL signals read in the current execution.
// If showSimple() returns true, fullName() is never read and never tracked.
// This is correct SolidJS behavior but can surprise developers.
```

**Confidence: 82%** - Conditional signal access means some signals only track when their branch executes.

---

## 3. Electron Security

### CRITICAL: nodeIntegration must be false in renderer

```ts
// BAD: Renderer has full Node.js access
new BrowserWindow({
    webPreferences: {
        nodeIntegration: true, // DANGEROUS
    }
});

// GOOD: nodeIntegration disabled (default in modern Electron)
new BrowserWindow({
    webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
    }
});
```

**Confidence: 98%** - nodeIntegration in renderer enables arbitrary code execution from any XSS.

### CRITICAL: contextIsolation must be true

```ts
// BAD: Preload script shares JS context with renderer
new BrowserWindow({
    webPreferences: {
        contextIsolation: false, // DANGEROUS
    }
});

// GOOD: contextIsolation enabled (default in modern Electron)
new BrowserWindow({
    webPreferences: {
        contextIsolation: true,
    }
});
```

**Confidence: 98%** - Without context isolation, renderer code can modify preload globals and access Node.js APIs.

### HIGH: Preload scripts must not expose dangerous APIs

```ts
// BAD: Exposing raw IPC or Node APIs
contextBridge.exposeInMainWorld('app', {
    exec: (cmd) => require('child_process').exec(cmd), // DANGEROUS
    readFile: (path) => fs.readFileSync(path), // DANGEROUS
    send: (channel, data) => ipcRenderer.send(channel, data), // Too broad
});

// GOOD: Expose specific, validated operations
contextBridge.exposeInMainWorld('app', {
    getSettings: () => ipcRenderer.invoke('getSettings'),
    updateSetting: (key, value) => ipcRenderer.invoke('updateSetting', key, value),
});
```

**Confidence: 95%** - Preload should expose narrow, specific functions. Never expose raw IPC send/invoke with arbitrary channels.

### HIGH: IPC handlers must validate input

```ts
// BAD: Trusting renderer input without validation
ipcMain.handle('writeFile', async (event, path, content) => {
    await fs.writeFile(path, content); // Path traversal!
});

// GOOD: Validate and constrain inputs
ipcMain.handle('writeFile', async (event, filename, content) => {
    const safePath = path.join(app.getPath('userData'), path.basename(filename));
    await fs.writeFile(safePath, content);
});
```

**Confidence: 90%** - Renderer is untrusted. All IPC handler inputs must be validated and constrained.

### HIGH: electron-store should not contain plaintext secrets

```ts
// BAD: Storing tokens/keys in plaintext
store.set('apiToken', rawToken);

// GOOD: Use encrypted storage or Electron safeStorage
const encrypted = safeStorage.encryptString(rawToken);
store.set('apiToken', encrypted.toString('base64'));
```

**Confidence: 88%** - electron-store writes to a JSON file on disk. Secrets should be encrypted. Check if the project uses encryptValue/decryptValue preload functions.

### MEDIUM: Avoid shell: true in child_process

```ts
// BAD: Shell injection risk
exec(`open ${url}`, { shell: true });

// GOOD: Use shell.openExternal or execFile
shell.openExternal(url);
```

**Confidence: 85%** - Shell execution with user-influenced input enables command injection.

### MEDIUM: Validate URLs before navigation

```ts
// BAD: Opening arbitrary URLs
shell.openExternal(userProvidedUrl);

// GOOD: Validate protocol
const parsed = new URL(userProvidedUrl);
if (['https:', 'http:'].includes(parsed.protocol)) {
    shell.openExternal(userProvidedUrl);
}
```

**Confidence: 82%** - Arbitrary URL navigation could execute `file://` or `javascript:` protocols.

---

## 4. TypeScript Traps

### HIGH: null vs undefined for default parameters

```tsx
// BAD: Default doesn't trigger on null
function formatDate(date: string | null = "today") {
    return date; // Returns null, not "today"
}

// GOOD: Explicit null check
function formatDate(date: string | null | undefined = "today") {
    return date ?? "today";
}
```

**Confidence: 90%** - Default parameter values don't trigger on `null` -- only on `undefined`.

### HIGH: Array index access not flagged as potentially undefined

```tsx
// BAD: TypeScript won't warn, but can throw
const firstItem = items[0]; // Type is Item, not Item | undefined
firstItem.name; // Runtime error if empty array

// GOOD: Explicit guard
const firstItem = items[0];
if (!firstItem) return null;
```

**Confidence: 88%** - All array index access on arrays that may be empty must be guarded.

### MEDIUM: Truthiness checks for type guards produce false positives

```tsx
// BAD: Truthy check on nullable field
if (response.data) {
    // data could be 0, empty string (falsy but valid)
}

// GOOD: Use explicit comparison or "property" in object
if (response.data !== undefined && response.data !== null) {
    // Proper narrowing
}
```

**Confidence: 82%** - Truthy checks fail on falsy-but-valid values (0, empty string).

### MEDIUM: filter + map without type predicates

```tsx
// BAD: Forces the return type
const items = results
    .map(r => r.item)
    .filter(item => item !== undefined) as Item[];

// GOOD: Type predicate with .filter()
const items = results
    .map(r => r.item)
    .filter((item): item is Item => item !== undefined);
```

**Confidence: 80%** - Type assertions (`as`) mask potential type errors.

### MEDIUM: Exhaustive switch without default

```tsx
// BAD: New enum value silently falls through
switch (status) {
    case 'idle': return handleIdle();
    case 'running': return handleRunning();
    // New 'paused' status added later - no error!
}

// GOOD: Exhaustive check
switch (status) {
    case 'idle': return handleIdle();
    case 'running': return handleRunning();
    default: {
        const _exhaustive: never = status;
        throw new Error(`Unhandled status: ${_exhaustive}`);
    }
}
```

**Confidence: 85%** - Particularly important for Pomello timer states and service lifecycle states.

---

## 5. Performance Red Flags

### HIGH: Unnecessary reactive computations

```tsx
// BAD: Creating new arrays/objects in JSX (re-creates every render)
<For each={items().filter(i => i.active)}>
    {item => <Item item={item} />}
</For>

// GOOD: Memoize derived data
const activeItems = createMemo(() => items().filter(i => i.active));
<For each={activeItems()}>
    {item => <Item item={item} />}
</For>
```

**Confidence: 88%** - Inline transformations in JSX create new arrays on every signal update, defeating SolidJS's fine-grained reactivity.

### HIGH: Heavy computation in signal derivation without memo

```tsx
// BAD: Expensive computation runs on every access
const Component = () => {
    return <div>{expensiveComputation(data())}</div>;
};

// GOOD: Memoize expensive work
const Component = () => {
    const result = createMemo(() => expensiveComputation(data()));
    return <div>{result()}</div>;
};
```

**Confidence: 85%** - Without createMemo, the computation runs every time any subscriber re-evaluates.

### MEDIUM: Excessive IPC calls from renderer

```tsx
// BAD: Multiple IPC calls that could be batched
const name = await window.app.getSetting('name');
const theme = await window.app.getSetting('theme');
const sound = await window.app.getSetting('sound');

// GOOD: Batch into single IPC call
const settings = await window.app.getSettings();
const { name, theme, sound } = settings;
```

**Confidence: 82%** - Each IPC call has overhead from serialization and process boundary crossing.

### MEDIUM: Large objects passed over IPC without filtering

```tsx
// BAD: Sending entire store state over IPC
ipcRenderer.invoke('saveState', entireStoreObject);

// GOOD: Send only what's needed
ipcRenderer.invoke('saveState', { relevantField: store.relevantField });
```

**Confidence: 80%** - IPC serializes data via structured clone. Large objects add latency and memory pressure.

### MEDIUM: Missing cleanup in createEffect / onCleanup

```tsx
// BAD: Event listener or timer never cleaned up
createEffect(() => {
    const interval = setInterval(() => update(), 1000);
    // Interval leaks on re-run or component unmount
});

// GOOD: Use onCleanup
createEffect(() => {
    const interval = setInterval(() => update(), 1000);
    onCleanup(() => clearInterval(interval));
});
```

**Confidence: 85%** - Leaked timers and listeners cause memory leaks and stale behavior in Electron (long-running app).

### MEDIUM: Bundle size - importing entire libraries

```tsx
// BAD: Pulls in entire library
import { format } from 'date-fns';

// GOOD: Deep import for tree-shakeable modules
import { format } from 'date-fns/format';
```

**Confidence: 80%** - Relevant for Electron renderer bundle size. Check if the library is tree-shakeable first.

---

## 6. Correctness Checks

### HIGH: Incomplete optional chaining

```tsx
// BAD: Throws if obj?.items returns undefined
const count = obj?.items.length;

// GOOD: Chain continues through the entire path
const count = obj?.items?.length;
```

**Confidence: 92%** - `obj?.items.length` throws if `?.items` returns `undefined`.

### HIGH: Empty array check vs falsy check

```tsx
// BAD: Truthy empty array produces blank content
if (tasks) {
    return <TaskList tasks={tasks} />;
}

// GOOD: Check for empty
if (tasks && tasks.length > 0) {
    return <TaskList tasks={tasks} />;
}
```

**Confidence: 88%** - `[]` is truthy. A component that checks `if (data)` but not `data.length` renders blank.

### HIGH: Async operations without error handling

```tsx
// BAD: Unhandled rejection crashes silently in Electron
async function fetchTasks() {
    const tasks = await api.getTasks(); // What if this throws?
    setTasks(tasks);
}

// GOOD: Handle errors explicitly
async function fetchTasks() {
    try {
        const tasks = await api.getTasks();
        setTasks(tasks);
    } catch (error) {
        logger.error('Failed to fetch tasks', error);
        setError('Failed to load tasks');
    }
}
```

**Confidence: 88%** - Unhandled promise rejections in Electron can crash the app or leave it in a broken state.

### MEDIUM: Timer state machine inconsistencies

```tsx
// BAD: Setting timer state without checking current state
function startTimer() {
    setTimerState('running'); // What if already running? What if in break?
}

// GOOD: Validate state transitions
function startTimer() {
    if (timerState() !== 'idle' && timerState() !== 'paused') return;
    setTimerState('running');
}
```

**Confidence: 85%** - Pomello's timer has defined states (idle, running, paused, break). Invalid transitions cause bugs.

### MEDIUM: Race conditions in async state updates

```tsx
// BAD: Stale closure over signal in async callback
const handleFetch = async () => {
    const currentId = selectedTaskId();
    const data = await fetchData(currentId);
    // User may have selected a different task while awaiting
    setTaskData(data); // Data for wrong task!
};

// GOOD: Check if selection changed
const handleFetch = async () => {
    const currentId = selectedTaskId();
    const data = await fetchData(currentId);
    if (currentId === selectedTaskId()) {
        setTaskData(data);
    }
};
```

**Confidence: 82%** - Common in task selection flows where user can switch tasks while data loads.

---

## 7. Testing Principles

### Project-Specific Test Conventions

This project uses **Vitest** with **@solidjs/testing-library** and **MSW** for API mocking.

**Key conventions:**
- Test files use `*.spec.ts` or `*.spec.tsx` extensions (NOT `.test.ts`)
- Tests are ONLY in `packages/renderer`
- Tests use `describe`/`it` blocks (not `test`)
- Vitest globals are enabled (no imports needed for `describe`/`it`/`expect`)
- `vi.fn()`, `vi.useFakeTimers()` for mocking
- Wider print width (120) in test files

### Test Fixture Pattern (project-specific)

Tests render full features via `__fixtures__/` directories:

```tsx
import { renderApp } from '../__fixtures__/renderApp';
import { screen, waitFor } from '@solidjs/testing-library';

it('should do something', async () => {
    const { simulate } = renderApp({ /* overrides */ });
    await simulate.selectTask();
    expect(screen.getByText('Task Name')).toBeInTheDocument();
});
```

**Key patterns:**
- Each feature area has `__fixtures__/` with `render*` helpers and `simulate` objects
- `simulate` wraps user interactions (selectTask, startTimer, advanceTimer, hotkey, etc.)
- Mock factories: `createMockAppApi`, `createMockService`, `createMockSettings`, etc.
- MSW `mockServer` for API mocking
- Service-specific generators: `generateTrelloCard`, `generateTrelloBoard`, etc.

### HIGH: Test observable behavior, not implementation

```tsx
// BAD: Assert on internal state
expect(store.state.isRunning).toBe(true);

// GOOD: Assert on rendered UI
expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
```

**Confidence: 90%** - Tests coupled to implementation break on refactoring.

### HIGH: Use role-based queries

```tsx
// BAD: Test ID as first resort
screen.getByTestId("start-button");

// GOOD: Role-based query
screen.getByRole("button", { name: "Start" });
```

**Confidence: 85%** - Role queries test accessibility and behavior simultaneously.

### HIGH: Explicitly create test data for assertions

```tsx
// BAD: Relies on mock defaults
const service = createMockService();
expect(screen.getByText(service.displayName)).toBeInTheDocument(); // What IS that value?

// GOOD: Explicit data
const service = createMockService({ displayName: 'My Service' });
expect(screen.getByText('My Service')).toBeInTheDocument();
```

**Confidence: 90%** - If a test relies on mock defaults for its assertions, it's not testing what it claims.

### When to Flag Missing Tests

**HIGH Priority (Flag):**

| Scenario | Confidence |
|----------|------------|
| New component/feature without tests | 95% |
| Bug fix without regression test | 90% |
| Critical path changes without test updates | 90% |
| New IPC handler without corresponding test | 85% |

**MEDIUM Priority (Flag):**

| Scenario | Confidence |
|----------|------------|
| New branches without coverage | 85% |
| Error handling without tests | 80% |
| Test doesn't verify actual change | 85% |

---

## 8. Accessibility

### HIGH: ARIA roles have structural requirements

```tsx
// BAD: option outside listbox
<div role="option">Task 1</div>

// GOOD: Proper nesting
<div role="listbox">
    <div role="option">Task 1</div>
</div>

// BAD: role="button" without keyboard handler
<div role="button" onClick={handleClick}>Start</div>

// GOOD: Use semantic HTML
<button onClick={handleClick}>Start</button>
```

**Confidence: 90%** - ARIA roles have structural and interaction requirements.

### HIGH: Interactive elements need keyboard support

```tsx
// BAD: Click-only interaction
<div onClick={handleSelect}>Select Task</div>

// GOOD: Keyboard accessible
<button onClick={handleSelect}>Select Task</button>
// or if div is necessary:
<div role="button" tabIndex={0} onClick={handleSelect} onKeyDown={handleKeyDown}>
    Select Task
</div>
```

**Confidence: 88%** - Desktop apps must support keyboard navigation. Pomello uses hotkeys extensively.

### MEDIUM: Use semantic HTML

```tsx
// BAD: Generic elements
<div onClick={handleClick}>Start Timer</div>
<span>Task description</span>

// GOOD: Semantic elements
<button onClick={handleClick}>Start Timer</button>
<p>Task description</p>
```

**Confidence: 85%** - `<button>` for actions, `<ul>/<li>` for lists, `<p>` for text content.

### MEDIUM: Focus management in modals/dialogs

```tsx
// BAD: Modal opens without focus management
<Show when={isOpen()}>
    <div class="modal">...</div>
</Show>

// GOOD: Focus trapped and managed
<Show when={isOpen()}>
    <dialog ref={dialogRef} onClose={handleClose}>
        ...
    </dialog>
</Show>
```

**Confidence: 82%** - Focus should move to modal on open and return on close. The project uses `<dialog>` elements.

---

## 9. Internationalization

### HIGH: All user-facing strings should be translatable

```tsx
// BAD: Hardcoded English
<button>Start Timer</button>

// GOOD: Using translation system
<button>{t('startTimer')}</button>
```

**Confidence: 88%** - The project has a `translations/` directory. New user-facing strings should use the translation system.

### HIGH: Never concatenate translated strings

```tsx
// BAD: Sentence structure varies by locale
const message = t('from') + ' ' + origin + ' ' + t('to') + ' ' + destination;

// GOOD: Parameterized translation
const message = t('route', { origin, destination });
```

**Confidence: 92%** - Concatenation breaks in languages with different word order.

### MEDIUM: Dates and durations should be locale-aware

```tsx
// BAD: Hardcoded format
const display = `${minutes}:${seconds.toString().padStart(2, '0')}`;

// GOOD: Use locale-aware formatting where appropriate
// Note: Timer display format may be intentionally fixed (MM:SS)
// Flag only when the format is clearly locale-dependent
```

**Confidence: 75%** - Timer displays are often intentionally fixed format. Only flag when clearly locale-dependent (dates, etc.).

---

## 10. Commit & Branch Format

### Commit Message Format

**Format:** `type: description`

This project uses Conventional Commits (via `standard-version`) by convention. No enforcement via hooks.

**Types:**

| Type | Use |
|------|-----|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | No behavior change |
| `perf` | Performance |
| `test` | Tests only |
| `docs` | Documentation |
| `chore` | Build/deps/tooling |

**Observed conventions:**
- Description is lowercase after the colon
- Scopes are used sparingly (mainly `chore(release)`)
- No ticket IDs in commit messages

**Examples:**
```
# GOOD
feat: add edit event form
fix: account for pause events in events modal
refactor: reorganize tests and fetch tasks helper

# BAD - uppercase description
feat: Add Edit Event Form

# BAD - no type prefix
add edit event form
```

### Scope Check

**Single concern per branch.** Warning signs:
- Commits addressing different features
- "Also fixed..." or "While I was here..."

### Minimal Changes Principle

Changes should contain **only what's needed for the stated purpose**.

| Pattern | Confidence | Action |
|---------|------------|--------|
| Reformatting unrelated files | 90% | Flag |
| Import reordering in untouched files | 85% | Flag |
| "Drive-by" fixes | 80% | Flag, suggest separate branch/commit |
| IDE auto-format on untouched files | 90% | Flag |

**Exception:** Trivial fix in file already modified for the change -> note, don't block.

---

## 11. Output Format

### File References

Use `file:line` format for all references:

```
packages/renderer/src/File.tsx:42
```

For ranges: `packages/renderer/src/File.tsx:42-50`

### Issue Format

```
### packages/renderer/src/File.tsx:42 (confidence: 92)
Missing null check -- `getTasks()` can return empty array but result used directly.
**Fix**: Add `if (!tasks.length)` guard
```

Keep it short. One issue per block. Actionable fix required.

### Review Template

```markdown
# Branch Review: [branch name]

## Status
- **Branch**: feature -> main
- **Commits**: N ahead of main
- **Verification**: `pnpm verify` [PASS/FAIL]

## Problem
[What the changes address]

## Current Behavior
[How code works before changes]

## Solution Analysis

### Candidate Approaches
1. **[Approach A]**: [trade-off]
2. **[Approach B]**: [trade-off]

### Branch Approach
[What the changes actually do]

### Assessment
- **Strengths**: [what the changes do well]
- **Considerations**: [potential improvements]

## Commit Format

| Check | Status |
|-------|--------|
| Commit format | PASS/FAIL |
| Scope consistency | PASS/FAIL |

## Code Issues

### packages/renderer/src/File.tsx:42 (confidence: 92)
[Issue description]
**Fix**: [Suggestion]

## Summary
- Format: X issues
- Code: Y issues (Z filtered < 80)
- Recommendation: [Looks good / Needs changes]
```
