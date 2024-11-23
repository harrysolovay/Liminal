import { Ty } from "./Ty.ts"

export function wrapper<X extends Ty>(ty: X): Ty<{ value: X[Ty.T] }, X[Ty.P]> {
  return Ty((_0, ref) => ({
    type: "object",
    properties: {
      value: ref(ty),
    },
    additionalProperties: false,
    required: ["value"],
  }))
}
