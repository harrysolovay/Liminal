import { Ty } from "./Ty.ts"

export function tuple<F extends Ty[]>(
  ...elements: F
): Ty<{ [K in keyof F]: F[K]["T"] }, F[number]["P"], true> {
  const { length } = elements
  return Ty(
    (ref) => ({
      type: "object",
      properties: Object.fromEntries(Array.from({ length }, (_0, i) => [i, ref(elements[i]!)])),
      additionalProperties: false,
      required: Object.keys(Array.from({ length }, (_0, i) => i)),
    }),
    true,
    (v) => Array.from({ length }, (_0, i) => elements[i]![""].transform(v[i])) as never,
  )
}
