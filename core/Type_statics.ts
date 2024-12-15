import { type AnyType, isType } from "./Type.ts"

// TODO: get this working with non-intrinsic `extendsType`s
export { extends_ as extends }
function extends_<T>(
  checkType: AnyType,
  ...extendsTypes: Array<AnyType<T> | ((...args: any) => AnyType<T>)>
): checkType is AnyType<T> {
  for (const extendsType of extendsTypes) {
    if (isType(extendsType)) {
      if (
        checkType.declaration.factory === extendsType.declaration.factory
        || checkType.declaration.getAtom === extendsType.declaration.getAtom
      ) {
        return true
      }
    }
    if (checkType.declaration.factory === extendsType) {
      return true
    }
  }
  return false
}
Object.defineProperty(extends_, "name", { value: "extends" })
