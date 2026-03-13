import type { FlagDefinitions, FlagContext, Flags } from './types.js';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function createFlags<T extends FlagDefinitions>(definitions: T): Flags<T> {
  return {
    enabled(name: keyof T, context?: FlagContext): boolean {
      const flag = definitions[name];
      if (flag === undefined) return false;

      if (typeof flag === 'boolean') return flag;

      const def = flag as { percentage: number } | { enabled: (context: FlagContext) => boolean };

      if ('percentage' in def) {
        const seed = context?.userId
          ? String(context.userId)
          : context?.id
            ? String(context.id)
            : String(Math.random());
        const hash = hashString(`${String(name)}:${seed}`);
        return (hash % 100) < def.percentage;
      }

      if ('enabled' in def) {
        return def.enabled(context ?? {});
      }

      return false;
    },
  };
}
