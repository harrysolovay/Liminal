import type { EnsureLiteralKeys } from "../util/mod.ts"
import { type Assertion, Context, type DescriptionArgs, type DescriptionParams } from "./Context.ts"

/** The core unit of schema composition. */
export interface Type<T, P extends keyof any = never> {
  <P2 extends DescriptionParams>(
    template: TemplateStringsArray,
    ...params: EnsureLiteralKeys<P2>
  ): Type<T, P | P2[number]>

  /** The native type. */
  T: T
  /** The union of literal types of parameter keys. */
  P: P

  [typeKey]: {
    /** Readonly values that describe the type. */
    declaration: TypeDeclaration
    /** Container to be filled with context parts as chaining occurs. */
    ctx: Context
  }

  /** Fill in parameterized context. */
  fill: <A extends Partial<DescriptionArgs<P>>>(
    args: A,
  ) => Type<T, Exclude<P, keyof { [K in keyof A as A[K] extends undefined ? never : K]: never }>>

  /** Specify assertions to be run on the type's output. */
  assert: <A extends unknown[]>(
    f: (target: T, ...args: A) => void | Promise<void>,
    ...args: A
  ) => Type<T, P>

  /** Annotate the type with arbitrary metadata. */
  annotate: (metadata: Record<keyof any, unknown>) => Type<T, P>

  /** Widen the type for dynamic use cases. */
  widen: () => Type<any, never>
}

export function Type<T, P extends keyof any = never>(
  declaration: TypeDeclaration,
  ctx?: Context,
): Type<T, P> {
  ctx = ctx ?? new Context([], [], {})
  const self = Object.assign(
    (template: TemplateStringsArray, ...params: DescriptionParams) =>
      Type(
        declaration,
        new Context(
          [{ template, params }, ...ctx.descriptionParts],
          ctx.assertionConfigs,
          ctx.metadata,
        ),
      ),
    {
      [typeKey]: { declaration, ctx },
      fill: (args: DescriptionArgs) =>
        Type(
          declaration,
          new Context([{ args }, ...ctx.descriptionParts], ctx.assertionConfigs, ctx.metadata),
        ),
      assert: (assertion: Assertion, ...args: unknown[]) => {
        const trace = new Error().stack ?? ""
        return Type(
          declaration,
          new Context(
            ctx.descriptionParts,
            [...ctx.assertionConfigs, { assertion, args, trace }],
            ctx.metadata,
          ),
        )
      },
      annotate: (metadata: Record<keyof any, unknown>) =>
        Type(
          declaration,
          new Context(ctx.descriptionParts, ctx.assertionConfigs, {
            ...ctx.metadata,
            ...metadata,
          }),
        ),
      widen: () => self,
      toJSON: () => ({
        type: declaration.name,
        value: {
          description: ctx.formatDescription({}),
          ...declaration.factory ? declaration.argsLookup : {},
        },
      }),
      [Symbol.for("nodejs.util.inspect.custom")](
        this: AnyType,
        _0: unknown,
        _1: unknown,
        inspect_: (value: unknown) => string,
      ): string {
        return inspect(inspect_)
      },
      [Symbol.for("Deno.customInspect")](
        this: AnyType,
        inspect_: (value: unknown, opts: unknown) => string,
        opts: unknown,
      ): string {
        return inspect((x) => inspect_(x, opts))
      },
    },
  )
  return self as never

  function inspect(inspect: (value: unknown) => string): string {
    if (declaration.getAtom) {
      return `T.${declaration.name}`
    }
    return `T.${declaration.name}(${declaration.args.map((arg) => inspect(arg)).join(", ")})`
  }
}

export const typeKey: unique symbol = Symbol()

export type TypeDeclaration =
  & {
    name: string
  }
  & ({
    getAtom: () => AnyType
    factory?: never
    args?: never
  } | {
    getAtom?: never
    factory: (...args: any) => AnyType
    args: unknown[]
    argsLookup: Record<string, unknown>
  })

export type AnyType<T = any> = Type<T, any>

export function isType(value: unknown): value is AnyType {
  return typeof value === "object" && value !== null && typeKey in value
}
