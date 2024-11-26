import { Ty } from "./Ty.ts"

export function transform<T, P extends keyof any, R extends boolean, I>(
  ty: Ty<I, P, R>,
  transform: (value: I) => T,
): Ty<T, P, R> {
  return Ty<T, P, R, I>((subschema) => subschema(ty), ty[""].root, (value) => transform(value))
}
