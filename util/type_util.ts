export type Expand<T> = T extends T ? { [K in keyof T]: T[K] } : never

export type U2I<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never
