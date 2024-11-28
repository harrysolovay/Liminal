export type EnsureLiteralKeys<T extends Array<keyof any>> = Extract<keyof any, T[number]> extends
  never ? T : never

export type Expand<T> = T extends T ? { [K in keyof T]: T[K] } : never
