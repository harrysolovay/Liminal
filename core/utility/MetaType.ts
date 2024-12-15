import * as I from "../intrinsics/mod.ts"
import type { Type } from "../Type.ts"
import { Hydrated } from "./Hydrated.ts"
import { JSONType } from "./JSONType.ts"

export const MetaType: Type<Type<unknown, never>, never> = I.transform(
  JSONType,
  Hydrated,
)
