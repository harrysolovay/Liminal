import type Anthropic from "@anthropic-ai/sdk"
import type { MessageParam, Model } from "@anthropic-ai/sdk/resources/messages"
import type { AdapterDefaults, LoadThread } from "../Adapter.ts"
import type { SaveThread } from "../Adapter.ts"

export interface AnthropicAdapterDescriptor {
  message: MessageParam
  role: "user"
  model: Model
  messageParams: [instruction?: string]
}

export interface AnthropicAdapterConfig {
  anthropic: Anthropic
  loadThread?: LoadThread<AnthropicAdapterDescriptor>
  saveThread?: SaveThread<AnthropicAdapterDescriptor>
  defaults: AdapterDefaults<AnthropicAdapterDescriptor>
}

export function AnthropicAdapter(
  { anthropic, defaults, loadThread, saveThread }: AnthropicAdapterConfig,
) {
  throw 0
}
