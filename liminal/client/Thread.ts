import type { AdapterDescriptor, CompletionValueConfig } from "./Adapter.ts"
import type { Liminal } from "./Liminal.ts"

export class Thread<D extends AdapterDescriptor> {
  constructor(
    readonly session: Liminal<D>,
    readonly threadId: string,
    readonly messages: Array<D["message"]>,
    public resumeIndex?: number,
  ) {}

  text = (messages: Array<D["message"]>, model?: D["model"]) => {
    this.messages.push(...messages)
    const assistantMessage = this.session.adapter.completeText(this.messages, model)
    this.messages.push(assistantMessage)
    return assistantMessage.then(this.session.adapter.unwrapMessage)
  }

  json = <T>(
    { messages, name, description, type, model }: CompletionValueConfig<D, T>,
  ): Promise<T> => {
    if (messages) {
      this.messages.push(...messages)
    }
    const assistantMessage = this.session.adapter
      .completeValue({
        messages: this.messages,
        name,
        description,
        type,
        model,
      })
      .then(this.session.adapter.unwrapMessage)
    this.messages.push(assistantMessage)
    return assistantMessage.then(type.deserialize)
  }

  save = async (): Promise<void> => {
    await this.session.adapter.saveThread?.(
      this.threadId,
      this.messages.slice(this.resumeIndex ?? 0),
      typeof this.resumeIndex === "number" ? this.messages.slice(0, this.resumeIndex) : undefined,
    )
    this.resumeIndex = this.messages.length - 1
  }
}
