import { ReplaceVoid } from "./Effect.ts"
import { Value } from "./Value.ts"

export declare function normalize<Y extends Value, R extends Value | void>(
  statements: () => Generator<Y, R>,
): () => Generator<Y, ReplaceVoid<R>>
