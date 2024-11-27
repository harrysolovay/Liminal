import type { Type } from "./Type.ts"

export class TypeMetadata<
  Name extends string = any,
  Root extends boolean = any,
  Output = any,
  Refinements extends Record<string, unknown> = any,
> {
  static make<Name extends string, Root extends boolean>(name: Name, root: Root) {
    return class<Output, Refinements extends Record<string, unknown> = {}>
      extends TypeMetadata<Name, Root, Output, Refinements>
    {
      constructor(source: TypeSource) {
        super(source, name, root, undefined!, {})
      }
    }
  }

  constructor(
    /** A reference to the containing type or type factory and arguments. */
    readonly source: TypeSource,
    /** The name of the type. */
    readonly name: Name,
    /** Whether the type can be used as the root type. */
    readonly root: Root,
    /** The type corresponding to the underlying JSON schema (and therefore the raw structure output). */
    readonly output: Output,
    /** Refinements available for the type. */
    readonly refinements: Partial<Refinements>,
  ) {}
}

export type TypeSource = {
  atom: () => Type
  factory?: never
  args?: never
} | {
  atom?: never
  factory: (...args: any) => Type
  args: unknown[]
}
