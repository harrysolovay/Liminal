import { type Schema, type Subschema, SubschemaFactory } from "./schema.ts"

export interface Ty<T = any, P extends keyof any = keyof any, R extends boolean = boolean> {
  <P2 extends Array<keyof any>>(
    template: TemplateStringsArray,
    ...placeheld: P2
  ): Ty<T, P | P2[number], R>

  /** The native TypeScript type. The runtime value is nonexistent. */
  T: T
  /** The literal types of the placeheld keys. The runtime value is nonexistent. */
  P: P

  "": {
    subschema: Subschema
    root: R
    transform: (value: any) => any
    context: Array<Context>
    applied: Applied
  }

  /** Inject context into that which is placeheld. */
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
    <P2 extends Array<keyof any>>(template: TemplateStringsArray, ...placeheld: P2) =>
      Ty<T, P | P2[number], R, I>(
        subschema,
        root,
        transform,
        [{ template, placeheld }, ...context],
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

export interface Context {
  template: TemplateStringsArray
  placeheld: Array<keyof any>
}

export type Applied = Record<keyof any, number | string>
