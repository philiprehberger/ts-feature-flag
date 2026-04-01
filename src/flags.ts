import type {
  FlagDefinitions,
  FlagContext,
  FlagSchedule,
  FlagVariant,
  FlagOverride,
  Flags,
} from './types.js';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

function getSeed(name: string, context?: FlagContext): string {
  if (context?.userId) return String(context.userId);
  if (context?.id) return String(context.id);
  return String(Math.random());
}

function isWithinSchedule(schedule: FlagSchedule): boolean {
  const now = Date.now();
  if (schedule.startDate) {
    const start = schedule.startDate instanceof Date
      ? schedule.startDate.getTime()
      : new Date(schedule.startDate).getTime();
    if (now < start) return false;
  }
  if (schedule.endDate) {
    const end = schedule.endDate instanceof Date
      ? schedule.endDate.getTime()
      : new Date(schedule.endDate).getTime();
    if (now > end) return false;
  }
  return true;
}

function checkOverrides(
  overrides: FlagOverride[],
  context?: FlagContext,
): boolean | undefined {
  if (!context) return undefined;
  const userId = context.userId ? String(context.userId) : undefined;
  const orgId = context.orgId ? String(context.orgId) : undefined;

  for (const override of overrides) {
    if (userId && override.userIds?.includes(userId)) {
      return override.enabled;
    }
    if (orgId && override.orgIds?.includes(orgId)) {
      return override.enabled;
    }
  }
  return undefined;
}

function resolveVariant(
  name: string,
  variants: FlagVariant[],
  context?: FlagContext,
): string | null {
  if (variants.length === 0) return null;

  const seed = getSeed(name, context);
  const hash = hashString(`${name}:${seed}`);
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0);
  if (totalWeight <= 0) return null;

  const bucket = hash % totalWeight;
  let cumulative = 0;
  for (const variant of variants) {
    cumulative += variant.weight;
    if (bucket < cumulative) return variant.id;
  }
  return variants[variants.length - 1].id;
}

function isComplexDef(
  def: unknown,
): def is {
  percentage?: number;
  enabled?: (context: FlagContext) => boolean;
  schedule?: FlagSchedule;
  variants?: FlagVariant[];
  dependsOn?: string;
  overrides?: FlagOverride[];
} {
  if (typeof def !== 'object' || def === null) return false;
  const keys = Object.keys(def);
  return keys.some((k) =>
    ['schedule', 'variants', 'dependsOn', 'overrides'].includes(k),
  );
}

export function createFlags<T extends FlagDefinitions>(definitions: T): Flags<T> {
  function evaluateEnabled(name: keyof T, context?: FlagContext): boolean {
    const flag = definitions[name];
    if (flag === undefined) return false;
    if (typeof flag === 'boolean') return flag;

    const def = flag as Record<string, unknown>;

    // Check for complex definition with new features
    if (isComplexDef(def)) {
      // Check overrides first (highest priority)
      if (def.overrides) {
        const overrideResult = checkOverrides(def.overrides, context);
        if (overrideResult !== undefined) return overrideResult;
      }

      // Check dependency chain
      if (def.dependsOn) {
        const depName = def.dependsOn as keyof T;
        if (!evaluateEnabled(depName, context)) return false;
      }

      // Check schedule
      if (def.schedule) {
        if (!isWithinSchedule(def.schedule)) return false;
      }

      // If variants are defined, the flag is considered enabled
      // when the context falls within percentage (or no percentage set)
      if (def.percentage !== undefined) {
        const seed = getSeed(String(name), context);
        const hash = hashString(`${String(name)}:${seed}`);
        return (hash % 100) < def.percentage;
      }

      if (def.enabled) {
        return def.enabled(context ?? {});
      }

      // If only schedule/variants/overrides/dependsOn with no percentage/enabled,
      // treat as enabled (schedule/dependency already checked above)
      return true;
    }

    // Legacy simple definitions
    if ('percentage' in def) {
      const seed = getSeed(String(name), context);
      const hash = hashString(`${String(name)}:${seed}`);
      return (hash % 100) < (def as { percentage: number }).percentage;
    }

    if ('enabled' in def) {
      return (def as { enabled: (ctx: Record<string, unknown>) => boolean }).enabled(
        context ?? {},
      );
    }

    return false;
  }

  return {
    enabled(name: keyof T, context?: FlagContext): boolean {
      return evaluateEnabled(name, context);
    },

    variant(name: keyof T, context?: FlagContext): string | null {
      const flag = definitions[name];
      if (flag === undefined) return null;
      if (typeof flag === 'boolean') return null;

      const def = flag as Record<string, unknown>;
      if (!isComplexDef(def) || !def.variants || def.variants.length === 0) {
        return null;
      }

      // Must pass enabled check to get a variant
      if (!evaluateEnabled(name, context)) return null;

      return resolveVariant(String(name), def.variants, context);
    },
  };
}
