export class Path {
  constructor(readonly junctions: PathJunctions = []) {}

  add = (junction?: PathJunction) => junction ? new Path([...this.junctions, junction]) : this

  format = (): string =>
    this.junctions.reduce<string>((acc, cur) => {
      return `${acc}${typeof cur === "number" ? `[${cur}]` : `.${cur}`}`
    }, "")
}

export type PathJunction = number | string
export type PathJunctions = Array<PathJunction>
