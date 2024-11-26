export type EnsureLiteralKeys<T extends Array<keyof any>> = Extract<keyof any, T[number]> extends
  never ? T
  : never
