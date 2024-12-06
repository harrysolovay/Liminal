import { recombine } from "../util/mod.ts"

export class Prompt {
  segments: Array<string | Prompt> = []
  constructor(readonly depth = 0) {}

  write = (contents: string): void => {
    this.segments.push(indent(contents, this.depth * 2))
  }

  h = (level: number, heading: string): void => {
    this.write(`${"#".repeat(level)} ${heading}`)
  }

  span(content: string): void
  span(template: TemplateStringsArray, ...quasis: string[]): void
  span(templateOrContent: string | TemplateStringsArray, ...quasis: string[]): void {
    if (typeof templateOrContent === "string") {
      this.write(templateOrContent)
    } else {
      this.write(
        recombine(templateOrContent, quasis).trim().split("\n").map((v) => v.trim()).join(" "),
      )
    }
  }

  lineBreak = (count = 1): void => {
    this.write("\n".repeat(count))
  }

  fenced = (contents: string, label = ""): void => {
    this.write(`\`\`\`${label}\n`)
    this.write(contents)
    this.write("\n```")
  }

  json = (value: unknown): void => {
    this.fenced(JSON.stringify(value, null, 2), "json")
  }

  list = (list: Array<string | false>, numbered = false): void => {
    let first = true
    list.forEach((line, i) => {
      if (line !== false) {
        if (first) {
          first = false
        } else {
          this.write("\n")
        }
        this.write(`${numbered ? i : "-"} ${line}`)
      }
    })
  }

  toString(): string {
    return this.segments
      .map((segment) => segment instanceof Prompt ? segment.toString() : segment)
      .join("")
  }

  indent = (useInnerPrompt: (innerPrompt: Prompt) => void) => {
    const prompt = new Prompt(this.depth + 1)
    useInnerPrompt(prompt)
    this.segments.push(prompt)
  }
}

function indent(line: string, depth: number) {
  return `${" ".repeat(depth)}${line}`
}
