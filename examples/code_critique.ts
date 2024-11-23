import { T } from "../mod.ts"

export const Suggestion = T.struct({
  file: T.str`The file containing the span to be potentially replaced.`,
  startLine: T.num`"The line on which the potentially-to-be-replaced span starts.`,
  endLine: T.num`The line on which the potentially-to-be-replaced span ends.`,
  what: T.str`The suggestion for the replacement.`,
  why: T.str`The reason for suggesting the replacement`,
  code: T.str`The replacement code.`,
})`A container for information related to a replacement suggestion.`
