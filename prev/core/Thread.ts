export type ET<E> = [
  {
    [K in keyof E]: E[K] extends ThreadE<infer E2> ? {
        type: K
        value: ET<E2>
      }
      : {
        type: K
        value: E[K]
      }
  }[keyof E],
][0]

declare const ThreadE_: unique symbol
export interface ThreadE<E> {
  [ThreadE_]: E
}
