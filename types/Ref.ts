import { recombineTaggedTemplateArgs } from "../util/recombineTaggedTemplateArgs.ts"
import type { Applied, Schema, Ty } from "./Ty.ts"

export type Ref = (ty: Ty) => Schema

export function Ref(applied: Applied): Ref {
  return (ty) => {
    applied = { ...applied, ...ty[""].applied }
    const description = ty[""].context
      .map(({ template, placeheld }) =>
        recombineTaggedTemplateArgs(template, placeheld.map((k) => applied[k]!))
      )
      .join(" ")
    return {
      ...ty[""].toSchema(Ref(applied)),
      ...description ? { description } : {},
    }
  }
}
