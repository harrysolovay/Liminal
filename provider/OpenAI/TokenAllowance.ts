import type { ChatCompletion } from "openai/resources/chat/completions"
import type { PromiseOr } from "../../util/mod.ts"

export interface TokenAllowanceOptions {
  /** Number of tokens in the generated completion. */
  completion_tokens?: number
  /** Number of tokens in the prompt. */
  prompt_tokens?: number
  /** Total number of tokens used in the request (prompt + completion). */
  total_tokens?: number
}

export class TokenAllowance {
  constructor(
    readonly allowances: TokenAllowanceOptions,
    readonly onExceeded?: (self: TokenAllowance) => PromiseOr<void>,
  ) {}

  ingest = (completion: ChatCompletion): void => {
    const { usage } = completion
    if (usage) {
      Object.keys(this.allowances).forEach((key) => {
        if (!(this.allowances[key as keyof TokenAllowanceOptions]! -= usage[key as never])) {
          this.onExceeded?.(this)
        }
      })
    }
  }
}
