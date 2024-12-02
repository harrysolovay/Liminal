import { assert } from "../asserts/mod.ts"
import { type AnyType, typeKey } from "./Type.ts"

export class TypeVisitor<C, R> {
  #fallback?: Visitor<C, R>
  constructor(
    readonly visitors: Map<VisitTarget, Visitor<C, R>> = new Map(),
    fallback?: Visitor<C, R>,
  ) {
    this.#fallback = fallback
  }

  add<X extends AnyType>(type: X, visitor: (ctx: C, type: X) => R): TypeVisitor<C, R>
  add<A extends unknown[], X extends AnyType>(
    typeFactory: (...args: A) => X,
    visitor: (ctx: C, type: X, ...args: A) => R,
  ): TypeVisitor<C, R>
  add(
    type: VisitTarget,
    visitor: (ctx: C, type: AnyType, ...args: unknown[]) => R,
  ): TypeVisitor<C, R> {
    assert(!this.visitors.has(type), "Duplicate visitor for type.") // TODO: format
    return new TypeVisitor(
      new Map([...this.visitors, [type, visitor]]) as never,
    )
  }

  fallback = (visitor: (ctx: C, type: AnyType, ...args: unknown[]) => R) =>
    new TypeVisitor(this.visitors, visitor)

  visit = (ctx: C, type: AnyType): R => {
    const { declaration } = type[typeKey]
    if (declaration.source.factory) {
      const visitor = this.visitors.get(declaration.source.factory)
      if (visitor) {
        return visitor(ctx, type, ...declaration.source.args)
      }
    } else {
      const visitor = this.visitors.get(declaration.source.getType())
      if (visitor) {
        return visitor(ctx, type)
      }
    }
    assert(this.#fallback, `Could not match type ${type} with visitor. No fallback specified.`)
    return this.#fallback(ctx, type)
  }
}

type VisitTarget = AnyType | ((...args: unknown[]) => AnyType)
type Visitor<C, R> = (ctx: C, type: AnyType, ...args: unknown[]) => R
