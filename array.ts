import { make, type Ty } from "./_base.ts"

export function array<E extends Ty>(description: string | undefined, element: E): ArrayTy<E> {
  return make((ctx) => ({
    type: "array",
    description,
    items: ctx.ref(element),
  }))
}

export type ArrayTy<E extends Ty = any> = Ty<Array<InstanceType<E>>>
