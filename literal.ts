import { make, type Ty } from "./_base.ts"

export function literal<V extends number | string>(description: string | undefined, value: V) {
  return make<LiteralTy<V>>(() => ({
    const: value,
    description,
  }))
}

export type LiteralTy<V extends number | string = any> = Ty<V>
