import { JSONTypeName, L, type Type } from "../mod.ts"

export function transform<T>(type: Type<T, never>): Type<T, never> {
  return ROOT_COMPATIBLE[JSONTypeName(type)] ? type : L.transform(L.Tuple(type), ([value]) => value)
}

const ROOT_COMPATIBLE: Partial<Record<JSONTypeName, boolean>> = {
  object: true,
  string: true,
}
