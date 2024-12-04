import { type AnyType, typeKey } from "./Type.ts"

export function inspect(
  type: AnyType,
  inspect: (value: unknown) => string,
): string {
  const { declaration } = type[typeKey]
  if (declaration.getAtom) {
    return declaration.name
  }
  return `${declaration.name}(${declaration.args.map((arg) => inspect(arg)).join(", ")})`
}
