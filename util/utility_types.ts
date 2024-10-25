export type Flatten<T> = [{ [K in keyof T]: T[K] }][0]

export type U2I<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never
