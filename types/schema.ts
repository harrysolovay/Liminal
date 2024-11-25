import { recombine } from "../util/recombine.ts"
import type { Applied, Ty } from "./Ty.ts"

export type Schema = Record<string, unknown>

export type Subschema = (subschema: SubschemaFactory) => Schema
export type SubschemaFactory = (ty: Ty) => Schema

export function SubschemaFactory(applied: Applied): SubschemaFactory {
  return (ty) => {
    applied = { ...applied, ...ty[""].applied }
    const description = ty[""].context
      .map(({ template, placeheld }) => recombine(template, placeheld.map((k) => applied[k]!)))
      .join(" ")
    return {
      ...ty[""].subschema(SubschemaFactory(applied)),
      ...description ? { description } : {},
    }
  }
}
