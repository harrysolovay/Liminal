import { make, type Ty } from "./_base.ts"

export function union<M extends Ty[]>(description: string | undefined, members: [...M]): UnionTy<M> {
  return make((ctx) => ({
    description,
    oneOf: members.map((member) => ctx.ref(member)),
  }))
}

export type UnionTy<M extends Ty[]> = Ty<
  { [K in keyof M]: M[K] extends Ty ? InstanceType<M[K]> : M[K] }[number]
>
