import { Ty } from "./Ty.ts"

export function object<F extends Record<string, Ty>>(
  fields: F,
): Ty<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["P"], true> {
  return Ty(
    (ref) => ({
      type: "object",
      properties: Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, ref(v)])),
      additionalProperties: false,
      required: Object.keys(fields),
    }),
    true,
    (v) =>
      Object.fromEntries(
        Object.entries(v).map(([k, v]) => [k, fields[k]![""].transform(v)]),
      ) as never,
  )
}
