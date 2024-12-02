import { assert } from "../asserts/mod.ts"
import { type AnyType, typeKey } from "./Type.ts"

export class TypeVisitorContext<C, R> {
  constructor(
    readonly visitors: Visitors<C, R> = new Map(),
    readonly fallback?: Visitor<C, R, AnyType>,
  ) {}

  add<X extends AnyType>(type: X, visitor: TypeVisitor<C, R, X>): TypeVisitorContext<C, R>
  add<A extends unknown[], X extends AnyType>(
    typeFactory: (...args: A) => X,
    visitor: TypeFactoryVisitor<C, R, A, X>,
  ): TypeVisitorContext<C, R>
  add(type: VisitTarget, visitor: Visitor<C, R, AnyType>): TypeVisitorContext<C, R> {
    assert(!this.visitors.has(type), "Duplicate visitor for type.") // TODO: format
    return new TypeVisitorContext(
      new Map([...this.visitors, [type, visitor]]) as Visitors<C, R>,
    )
  }

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
    assert(this.fallback, "Could not match type with visitor. No fallback specified.") // TODO: format
    return this.fallback(ctx, type)
  }
}

export type Visitors<C, R> = Map<VisitTarget, Visitor<C, R, AnyType>>
export type VisitTarget = AnyType | ((...args: unknown[]) => AnyType)
export type Visitor<C, R, X extends AnyType> =
  | TypeVisitor<C, R, AnyType>
  | TypeFactoryVisitor<C, R, any[], X>
export type TypeVisitor<C, R, X extends AnyType> = (ctx: C, type: X) => R
export type TypeFactoryVisitor<
  C,
  R,
  A extends unknown[],
  X extends AnyType,
> = (ctx: C, type: X, ...args: A) => R
