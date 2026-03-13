export type FlagContext = Record<string, unknown>;

export type FlagDefinition =
  | boolean
  | { percentage: number }
  | { enabled: (context: FlagContext) => boolean };

export type FlagDefinitions = Record<string, FlagDefinition>;

export interface Flags<T extends FlagDefinitions> {
  enabled(name: keyof T, context?: FlagContext): boolean;
}
