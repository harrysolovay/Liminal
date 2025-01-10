export type IterableLike<
  Y = any,
  R = any,
  N = any,
> = Iterable<Y, R, N> | AsyncIterable<Y, R, N>
