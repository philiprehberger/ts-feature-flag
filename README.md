# @philiprehberger/feature-flag

[![CI](https://github.com/philiprehberger/feature-flag/actions/workflows/ci.yml/badge.svg)](https://github.com/philiprehberger/feature-flag/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@philiprehberger/feature-flag.svg)](https://www.npmjs.com/package/@philiprehberger/feature-flag)
[![Last updated](https://img.shields.io/github/last-commit/philiprehberger/feature-flag)](https://github.com/philiprehberger/feature-flag/commits/main)

Simple in-memory feature flag system with percentage rollouts and targeting

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

## Development

```bash
npm install
npm run build
npm test
```

## Support

If you find this project useful:

⭐ [Star the repo](https://github.com/philiprehberger/feature-flag)

🐛 [Report issues](https://github.com/philiprehberger/feature-flag/issues?q=is%3Aissue+is%3Aopen+label%3Abug)

💡 [Suggest features](https://github.com/philiprehberger/feature-flag/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)

❤️ [Sponsor development](https://github.com/sponsors/philiprehberger)

🌐 [All Open Source Projects](https://philiprehberger.com/open-source-packages)

💻 [GitHub Profile](https://github.com/philiprehberger)

🔗 [LinkedIn Profile](https://www.linkedin.com/in/philiprehberger)

## License

[MIT](LICENSE)
