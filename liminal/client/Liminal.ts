import type { Adapter, AdapterDescriptor } from "./Adapter.ts"
import { Session } from "./Session.ts"

export class Liminal<D extends AdapterDescriptor> {
  constructor(readonly adapter: Adapter<D>) {}

  session = async (id?: string): Promise<Session<D>> => {
    const messages = await this.adapter.loadMessages(id)
    return new Session(this, id ?? crypto.randomUUID(), messages, id ? messages.length - 1 : 0)
  }
}
