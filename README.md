# @philiprehberger/feature-flag

Simple in-memory feature flag system with percentage rollouts and targeting.

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
