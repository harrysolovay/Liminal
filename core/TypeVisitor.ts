import { assert } from "../asserts/mod.ts"
import { type AnyType, typeKey } from "./Type.ts"

export class TypeVisitor<C, R> {
  #fallback?: Visitor<C, R>
  #middleware?: Middleware<C>
  constructor(
    readonly visitors: Map<VisitTarget, Visitor<C, R>> = new Map(),
    fallback?: Visitor<C, R>,
    middleware?: Middleware<C>,
  ) {
    this.#fallback = fallback
    this.#middleware = middleware
  }

  middleware = (f: (ctx: C, type: AnyType, ...args: unknown[]) => void): TypeVisitor<C, R> =>
    new TypeVisitor(
      this.visitors,
      this.#fallback,
      this.#middleware ? [...this.#middleware, f] : [f],
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
    if (declaration.source.factory) {
      const visitor = this.visitors.get(declaration.source.factory)
      if (visitor) {
        const { args } = declaration.source
        this.#middleware?.forEach((f) => f(ctx, type, ...args))
        return visitor(ctx, type, ...args)
      }
    } else {
      const visitor = this.visitors.get(declaration.source.getType())
      if (visitor) {
        this.#middleware?.forEach((f) => f(ctx, type))
        return visitor(ctx, type)
      }
    }
    assert(this.#fallback, `Could not match type ${type} with visitor. No fallback specified.`)
    this.#middleware?.forEach((f) => f(ctx, type))
    return this.#fallback(ctx, type)
  }
}

export type VisitTarget = AnyType | ((...args: unknown[]) => AnyType)
export type Visitor<C, R> = (ctx: C, type: AnyType, ...args: unknown[]) => R
export type Middleware<C> = Array<(ctx: C, type: AnyType, ...args: unknown[]) => void>
