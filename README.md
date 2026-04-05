# @philiprehberger/feature-flag

[![CI](https://github.com/philiprehberger/ts-feature-flag/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-feature-flag/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/feature-flag.svg)](https://www.npmjs.com/package/@philiprehberger/feature-flag)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/ts-feature-flag)](https://github.com/philiprehberger/ts-feature-flag/commits/main)

Simple in-memory feature flag system with percentage rollouts, targeting, scheduling, A/B variants, dependency chains, and per-context overrides

## Installation

```bash
npm install @philiprehberger/feature-flag
```

## Usage

```ts
import { createFlags } from '@philiprehberger/feature-flag';

const flags = createFlags({
  newCheckout: true,
  darkMode: { percentage: 50 },
  betaFeature: { enabled: (ctx) => ctx.role === 'beta' },
});

flags.enabled('newCheckout');                     // true
flags.enabled('darkMode', { userId: 'abc' });     // deterministic by userId
flags.enabled('betaFeature', { role: 'beta' });   // true
flags.enabled('betaFeature', { role: 'user' });   // false
```

### Flag Scheduling

Enable or disable flags based on date ranges. A flag with a schedule only evaluates as enabled when the current time falls within the configured window.

```ts
const flags = createFlags({
  holidaySale: {
    schedule: {
      startDate: '2026-12-20T00:00:00Z',
      endDate: '2026-12-31T23:59:59Z',
    },
  },
  earlyAccess: {
    percentage: 25,
    schedule: { startDate: new Date('2026-04-01') },
  },
});

flags.enabled('holidaySale');  // true only between Dec 20-31
flags.enabled('earlyAccess', { userId: 'u1' }); // true after Apr 1 for 25% of users
```

### A/B Variant Assignment

Return variant IDs for multivariate testing instead of just boolean values. Variants are selected deterministically based on the context, using weights to control distribution.

```ts
const flags = createFlags({
  checkoutFlow: {
    variants: [
      { id: 'control', weight: 50 },
      { id: 'single-page', weight: 30 },
      { id: 'wizard', weight: 20 },
    ],
  },
});

flags.enabled('checkoutFlow');                        // true (flag has variants)
flags.variant('checkoutFlow', { userId: 'user-42' }); // 'control', 'single-page', or 'wizard'
flags.variant('unknownFlag');                          // null
```

### Flag Dependency Chains

A flag can depend on another flag. The dependent flag only evaluates as enabled when its parent flag is also enabled.

```ts
const flags = createFlags({
  newDashboard: true,
  dashboardCharts: { dependsOn: 'newDashboard' },
  chartAnimations: { dependsOn: 'dashboardCharts' },
});

flags.enabled('dashboardCharts');  // true (newDashboard is true)
flags.enabled('chartAnimations');  // true (entire chain is true)
```

### Per-Context Overrides

Force-enable or force-disable flags for specific user IDs or organization IDs, regardless of rollout percentage or other conditions.

```ts
const flags = createFlags({
  experimentalApi: {
    percentage: 10,
    overrides: [
      { userIds: ['admin-1', 'admin-2'], enabled: true },
      { orgIds: ['org-beta'], enabled: true },
      { userIds: ['banned-user'], enabled: false },
    ],
  },
});

flags.enabled('experimentalApi', { userId: 'admin-1' });      // always true
flags.enabled('experimentalApi', { orgId: 'org-beta' });       // always true
flags.enabled('experimentalApi', { userId: 'banned-user' });   // always false
flags.enabled('experimentalApi', { userId: 'regular-user' });  // 10% rollout
```

## API

| Export | Description |
|--------|-------------|
| `createFlags(definitions)` | Create a flags instance |

### Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `flags.enabled(name, context?)` | `boolean` | Check if a flag is enabled |
| `flags.variant(name, context?)` | `string \| null` | Get the assigned variant ID, or null |

### Flag Types

| Type | Example | Description |
|------|---------|-------------|
| Boolean | `true` / `false` | Static on/off |
| Percentage | `{ percentage: 50 }` | Deterministic rollout by userId hash |
| Function | `{ enabled: (ctx) => ... }` | Custom targeting logic |
| Schedule | `{ schedule: { startDate, endDate } }` | Time-based activation window |
| Variants | `{ variants: [{ id, weight }] }` | A/B multivariate assignment |
| Dependency | `{ dependsOn: 'otherFlag' }` | Only enabled if dependency is enabled |
| Overrides | `{ overrides: [{ userIds, enabled }] }` | Force enable/disable per user/org |

### Types

| Type | Description |
|------|-------------|
| `FlagContext` | `Record<string, unknown>` context passed to evaluators |
| `FlagDefinition` | Union of all flag configuration shapes |
| `FlagDefinitions` | `Record<string, FlagDefinition>` |
| `FlagSchedule` | `{ startDate?: Date \| string; endDate?: Date \| string }` |
| `FlagVariant` | `{ id: string; weight: number }` |
| `FlagOverride` | `{ userIds?: string[]; orgIds?: string[]; enabled: boolean }` |
| `Flags<T>` | Instance returned by `createFlags` |

## Development

```bash
npm install
npm run build
npm test
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/ts-feature-flag)

🐛 [Report issues](https://github.com/philiprehberger/ts-feature-flag/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/ts-feature-flag/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
