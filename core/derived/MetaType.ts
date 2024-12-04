import type { Type } from "../Type.ts"
import { fromJson } from "../TypeJson.ts"
import * as T from "../types/mod.ts"
import { TypeJson } from "./TypeJson.ts"

export const MetaType: Type<Type<unknown>> = T.transform("MetaType", TypeJson, fromJson)
