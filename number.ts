import { make, type Ty } from "./_base.ts"

export function number(description?: string) {
  return make<NumberTy>(() => ({
    type: "number",
    description,
  }))
}

export type NumberTy = Ty<number>
