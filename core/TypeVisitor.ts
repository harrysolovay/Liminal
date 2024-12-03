import { assert } from "../util/mod.ts"
import { type AnyType, typeKey } from "./Type.ts"

export class TypeVisitor<C, R> {
  #fallback?: Visitor<C, R>
  #middleware?: Array<Middleware<C, R>>
  constructor(
    readonly visitors: Map<VisitTarget, Visitor<C, R>> = new Map(),
    fallback?: Visitor<C, R>,
    middleware?: Array<Middleware<C, R>>,
  ) {
    this.#fallback = fallback
    this.#middleware = middleware
  }

  middleware = (f: Middleware<C, R>): TypeVisitor<C, R> =>
    new TypeVisitor(
      this.visitors,
      this.#fallback,
      this.#middleware ? [f, ...this.#middleware] : [f],
    )

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
      this.#fallback,
      this.#middleware,
    )
  }

  fallback = (f: (ctx: C, type: AnyType, ...args: unknown[]) => R) =>
    new TypeVisitor(this.visitors, f, this.#middleware)

  visit = (ctx: C, type: AnyType): R => {
    const { declaration } = type[typeKey]
    if (declaration.factory) {
      const visitor = this.visitors.get(declaration.factory)
      if (visitor) {
        return sequence.call(this, visitor, ...declaration.args)
      }
    } else {
      const visitor = this.visitors.get(declaration.getType())
      if (visitor) {
        return sequence.call(this, visitor)
      }
    }
    assert(this.#fallback, `Could not match type ${type} with visitor. No fallback specified.`)
    return sequence.call(this, this.#fallback)

    function sequence(this: TypeVisitor<C, R>, visitor: Visitor<C, R>, ...args: unknown[]): R {
      if (this.#middleware) {
        return this.#middleware.reduce(
          (next, cur) => (ctx, type, ...args) => cur(next, ctx, type, ...args),
          visitor,
        )(ctx, type, ...args)
      }
      return visitor(ctx, type, ...args)
    }
  }
}

export type Visitor<C, R> = (ctx: C, type: AnyType, ...args: unknown[]) => R
export type Middleware<C, R> = (
  next: (ctx: C, type: AnyType, ...args: unknown[]) => R,
  ctx: C,
  type: AnyType,
  ...args: unknown[]
) => R
export type VisitTarget = AnyType | ((...args: unknown[]) => AnyType)
