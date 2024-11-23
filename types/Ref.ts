import type { Applied, Schema, Ty } from "./Ty.ts"
import { recombineTaggedTemplateArgs } from "../util/recombineTaggedTemplateArgs.ts"

export type Ref = (ty: Ty) => Schema

export function Ref(applied: Applied): Ref {
  return (ty) => {
    applied = { ...applied, ...ty.applied }
    const description = ty.descriptions
      .map(({ template, placeheld }) =>
        recombineTaggedTemplateArgs(template, placeheld.map((k) => applied[k]!))
      )
      .join(" ")
    return ty.toSchema(description, Ref(applied))
  }
}
