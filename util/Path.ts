export class Path {
  constructor(readonly junctions: Array<number | string> = []) {}

  next = (junction?: number | string): Path =>
    junction === undefined ? this : new Path([...this.junctions, junction])

  toString(): string {
    return this.junctions.reduce<string>((acc, cur) => `${acc}["${cur}"]`, "root")
  }
}
