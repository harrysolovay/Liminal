import { type AnyType, typeKey } from "./Type.ts"

// const inspected = new Map<AnyType, number>()
// let inspectedId = 0

export function inspect(
  type: AnyType,
  inspect: (value: unknown) => string,
): string {
  const { declaration } = type[typeKey]
  if (declaration.getAtom) {
    return "TODO"
  }
  return `${"TODO"}(${declaration.args.map((arg) => inspect(arg)).join(", ")})`
}
