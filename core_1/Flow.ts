import type { Action } from "./Action.ts"

export type Flow<
  R = any,
  Y extends Action = Action,
> = Iterator<Y, R, void> | AsyncIterator<Y, R, void>
