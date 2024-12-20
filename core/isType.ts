import { IntrinsicName } from "./intrinsics_util.ts"
import { type PartialType, TypeKey } from "./Type.ts"

export function isType(
  inQuestion: unknown,
  ...intrinsicNames: Array<IntrinsicName>
): inQuestion is PartialType {
  if (typeof inQuestion === "function" && TypeKey in inQuestion) {
    if (intrinsicNames.length) {
      for (const intrinsicName of intrinsicNames) {
        if (IntrinsicName(inQuestion as never as PartialType) === intrinsicName) {
          return true
        }
      }
    } else {
      return true
    }
  }
  return false
}
