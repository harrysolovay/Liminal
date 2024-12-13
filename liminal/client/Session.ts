import type { Type } from "../core/mod.ts"
import type { AdapterDescriptor, CompletionValueConfig } from "./Adapter.ts"
import type { Liminal } from "./Liminal.ts"

export class Session<D extends AdapterDescriptor> {
  constructor(
    readonly liminal: Liminal<D>,
    readonly threadId: string,
    public messages: Array<D["message"]>,
    public resumeIndex?: number,
  ) {}

  text = (messages: Array<D["message"]>, model?: D["model"]) => {
    this.messages.push(...messages)
    const assistantMessage = this.liminal.adapter.completeText(this.messages, model)
    this.messages.push(assistantMessage)
    return assistantMessage.then(this.liminal.adapter.unwrapMessage)
  }

  value = async <T>(config: Type<T, never> | CompletionValueConfig<D, T>): Promise<T> => {
    if ("messages" in config) {
      this.messages.push(...config.messages ?? [])
    }
    const assistantMessage = await this.liminal.adapter
      .completeValue({
        ...typeof config === "function" ? { type: config } : config,
        messages: this.messages,
      })
    this.messages.push(assistantMessage)
    return (typeof config === "function" ? config.deserialize : config.type.deserialize)(
      this.liminal.adapter.unwrapMessage(assistantMessage),
    )
  }

  save = async (): Promise<void> => {
    await this.liminal.adapter.saveSession?.(
      this.threadId,
      this.messages.slice(this.resumeIndex ?? 0),
      typeof this.resumeIndex === "number" ? this.messages.slice(0, this.resumeIndex) : undefined,
    )
    this.resumeIndex = this.messages.length - 1
  }

  clear = () => {
    this.messages = []
  }
}
