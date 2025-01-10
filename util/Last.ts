export type Last<A extends any[]> = A extends [...infer _, infer L] ? L : never
