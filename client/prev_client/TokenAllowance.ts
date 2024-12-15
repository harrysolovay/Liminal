import type { ChatCompletion } from "openai/resources/chat/completions"

export interface TokenAllowanceOptions {
  /** Number of tokens in the generated completion. */
  completion_tokens?: number
  /** Number of tokens in the prompt. */
  prompt_tokens?: number
  /** Total number of tokens used in the request (prompt + completion). */
  total_tokens?: number
}

export class TokenAllowance {
  stop: boolean = false
  constructor(
    readonly allowances: TokenAllowanceOptions,
    readonly halt?: (self: TokenAllowance) => boolean,
  ) {}

  ingest = (completion: ChatCompletion): void => {
    const { usage } = completion
    if (usage) {
      Object.keys(this.allowances).forEach((key) => {
        if (!(this.allowances[key as keyof TokenAllowanceOptions]! -= usage[key as never])) {
          this.stop = true
        }
      })
    }
    if (this.halt?.(this)) {
      this.stop = true
    }
  }
}
