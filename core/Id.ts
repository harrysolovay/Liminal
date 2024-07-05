import { Store } from "../client/mod.ts"
import { Tagged } from "../util/Tagged.ts"
import { unimplemented } from "../util/unimplemented.ts"
import { Effect } from "./Effect.ts"
import { EffectStatements } from "./F.ts"
import { u256, U256Source } from "./Int.ts"
import { Value } from "./Value.ts"
import { Vk } from "./Vk.ts"

export type IdSource =
  | IdSource.Sender
  | IdSource.Self
  | IdSource.Caller
  | IdSource.Null
  | IdSource.Random
export namespace IdSource {
  export class Hex extends Tagged("Hex") {}
  export class Bytes extends Tagged("Bytes") {}
  export class Sender extends Tagged("Sender") {}
  export class Self extends Tagged("Self") {}
  export class Caller extends Tagged("Caller") {}
  export class Null extends Tagged("Null") {}
  export class Random extends Tagged("Random") {}
}

export class id extends Value.make("id")<IdSource, Uint8Array, Uint8Array, id> {
  static fromHex(_hex: string): id {
    unimplemented()
  }

  static deferred<K extends string>(_key: K): Effect<SignerRequirement<K>, signer<K>> {
    unimplemented()
  }

  static random(): id {
    return new id(new IdSource.Random())
  }

  balance = new u256(new U256Source.Balance(this))

  bind<N>(_namespace: N): Contract<N> {
    unimplemented()
  }

  signer<K extends string>(_key: K): Effect<SignerRequirement<K>, signer<K>> {
    unimplemented()
  }
}

export class SignerRequirement<K extends string = any>
  extends Value.make("SignerRequirement")<K, never>
{
  constructor(readonly key: K) {
    super(key)
  }
}

export interface signer<K extends keyof any = any>
  extends InstanceType<ReturnType<typeof signer<K>>>
{}

export function signer<K extends keyof any>(key: K) {
  return class extends id {
    readonly key = key

    deploy<N>(_namespace: N, _deployOptions?: DeployOptions): Effect<never, Contract<N>> {
      unimplemented()
    }

    send(...[_amount, _to]: Value.Args<[u256, id]>): Effect<never, never> {
      unimplemented()
    }
  }
}

export interface PureProxy<P extends Value.PropTypes = any, Y extends Value = any>
  extends InstanceType<ReturnType<typeof PureProxy<P, Y>>>
{}

export function PureProxy<P extends Value.PropTypes, Y extends Value>(
  propsTypes: Value.Props<P>,
  statements: EffectStatements<id, [resolved: Value.PropsResolved<P>], Y, Vk | void>,
) {
  return class extends id {
    readonly brand = "PureProxy"
    propsTypes = propsTypes
    statements = statements
  }
}

export const nullId = new id(new IdSource.Null())
export const caller = new id(new IdSource.Caller())
export const self = new id(new IdSource.Self())
export const sender = new id(new IdSource.Sender())

export interface DeployOptions {
  deployer?: signer
}

export type Contract<N> = id & { da(_store: Store): void } & { [K in keyof N]: N[K] }
export function Contract<N>(id: id, ns: N): Contract<N> {
  return Object.assign(id, ns, {
    da(_store: Store) {
      return Contract(id, ns)
    },
  })
}
