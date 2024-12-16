import * as I from "../intrinsics/mod.ts"
import type { Type } from "../Type.ts"
import { Hydrated } from "./Hydrated.ts"
import { JSONType } from "./JSONType.ts"

export type MetaType<P extends symbol> = Type<Type<unknown, never>, P>

export const MetaType: MetaType<never> = I.transform(JSONType, Hydrated)
