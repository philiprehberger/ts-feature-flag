# @philiprehberger/ts-feature-flag

[![CI](https://github.com/philiprehberger/ts-feature-flag/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/ts-feature-flag/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/ts-feature-flag.svg)](https://www.npmjs.com/package/@philiprehberger/ts-feature-flag)
[![License](https://img.shields.io/github/license/philiprehberger/ts-feature-flag)](LICENSE)

Simple in-memory feature flag system with percentage rollouts and targeting.

## Installation

```bash
npm install @philiprehberger/ts-feature-flag
```

## Usage

```ts
import { createFlags } from '@philiprehberger/ts-feature-flag';

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

## API

| Export | Description |
|--------|-------------|
| `createFlags(definitions)` | Create a flags instance |

### Flag Types

| Type | Example | Description |
|------|---------|-------------|
| Boolean | `true` / `false` | Static on/off |
| Percentage | `{ percentage: 50 }` | Deterministic rollout by userId hash |
| Function | `{ enabled: (ctx) => ... }` | Custom targeting logic |

## License

MIT
