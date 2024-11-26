import { recombine } from "../util/recombine.ts"
import type { EnsureLiteralKeys } from "../util/util_types.ts"

export interface Ty<T = any, P extends keyof any = keyof any, R extends boolean = boolean> {
  <P2 extends Array<keyof any>>(
    template: TemplateStringsArray,
    ...params: EnsureLiteralKeys<P2>
  ): Ty<T, P | P2[number], R>

  /** The native TypeScript type. The runtime value is nonexistent. */
  T: T
  /** The literal types of the parameter keys. The runtime value is nonexistent. */
  P: P

  "": {
    subschema: Subschema
    root: R
    transform: (value: any) => any
    context: Array<Context>
    applied: Applied
  }

  /** Apply context to parameters. */
  fill: <A extends Partial<Record<P, number | string>>>(
    values: A,
  ) => Ty<T, Exclude<P, keyof A>, R>

  /** Get the corresponding JSON Schema. */
  schema(this: Ty<T, never>): Schema
}

export function Ty<T, P extends keyof any, R extends boolean, I = T>(
  subschema: Subschema,
  root: R,
  transform: (value: I) => T = (value) => value as never,
  context: Array<Context> = [],
  applied: Applied = {},
): Ty<T, P, R> {
  return Object.assign(
    <P2 extends Array<keyof any>>(template: TemplateStringsArray, ...params: P2) =>
      Ty<T, P | P2[number], R, I>(
        subschema,
        root,
        transform,
        [{ template, params }, ...context],
        applied,
      ),
    {} as { T: T; P: P },
    {
      "": {
        subschema,
        root,
        transform,
        context,
        applied,
      },
      fill: <A extends Partial<Record<P, string | number>>>(values: A) => {
        return Ty<T, Exclude<P, keyof A>, R, I>(subschema, root, transform, context, {
          ...applied,
          ...values,
        })
      },
      schema(this: Ty<T, never>) {
        return SubschemaFactory({})(this)
      },
    },
  )
}

export type Subschema = (subschema: SubschemaFactory) => Schema

export type SubschemaFactory = (ty: Ty) => Schema
export function SubschemaFactory(applied: Applied): SubschemaFactory {
  return (ty) => {
    applied = { ...applied, ...ty[""].applied }
    const description = ty[""].context
      .map(({ template, params }) => recombine(template, params.map((k) => applied[k]!)))
      .join(" ")
    return {
      ...ty[""].subschema(SubschemaFactory(applied)),
      ...description ? { description } : {},
    }
  }
}

interface Context {
  template: TemplateStringsArray
  params: Array<keyof any>
}
type Applied = Record<keyof any, number | string>

export type Schema = Record<string, unknown>
