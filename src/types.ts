export type FlagContext = Record<string, unknown>;

export interface FlagSchedule {
  startDate?: Date | string;
  endDate?: Date | string;
}

export interface FlagVariant {
  id: string;
  weight: number;
}

export interface FlagOverride {
  userIds?: string[];
  orgIds?: string[];
  enabled: boolean;
}

export type FlagDefinition =
  | boolean
  | { percentage: number }
  | { enabled: (context: FlagContext) => boolean }
  | {
      percentage?: number;
      enabled?: (context: FlagContext) => boolean;
      schedule?: FlagSchedule;
      variants?: FlagVariant[];
      dependsOn?: string;
      overrides?: FlagOverride[];
    };

export type FlagDefinitions = Record<string, FlagDefinition>;

export interface Flags<T extends FlagDefinitions> {
  enabled(name: keyof T, context?: FlagContext): boolean;
  variant(name: keyof T, context?: FlagContext): string | null;
}
