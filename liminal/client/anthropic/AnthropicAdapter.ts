import type Anthropic from "@anthropic-ai/sdk"
import type { MessageParam, Model } from "@anthropic-ai/sdk/resources/messages"
import type { AdapterDefaults, LoadSession } from "../Adapter.ts"
import type { SaveSession } from "../Adapter.ts"

export interface AnthropicAdapterDescriptor {
  message: MessageParam
  role: "user"
  model: Model
  messageParams: [instruction?: string]
}

export interface AnthropicAdapterConfig {
  anthropic: Anthropic
  loadThread?: LoadSession<AnthropicAdapterDescriptor>
  saveThread?: SaveSession<AnthropicAdapterDescriptor>
  defaults: Omit<AdapterDefaults<AnthropicAdapterDescriptor>, "role">
}

export function AnthropicAdapter(
  { anthropic, defaults, loadThread, saveThread }: AnthropicAdapterConfig,
) {
  throw 0
}
