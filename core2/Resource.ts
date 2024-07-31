import { F, f } from "./F.ts"
import { u8 } from "./int.ts"
import { Struct } from "./Struct.ts"
import { Value } from "./Value.ts"

export interface Resource<
  P extends Value = any,
  Y extends Value = any,
  R extends Record<string, Value | F> = any,
> {
  (value: Value.From<P>): Generator<Y, R>
}

export class MultisigProps extends Struct({
  signatories: u8,
  threshold: u8,
}) {}

export const multisig = MultisigProps.resource(function*({ fields: { signatories, threshold } }) {
  yield* signatories.size.gte(2).assert(SoleSignatoryError.from({}))
  yield* threshold.lte(signatories.size).assert(InvalidThresholdError.from({}))

  return {
    fund: Struct({ amount: u8 }).f(function*({ fields: { amount } }) {
      // ...
    }),
    destroy: f(function*() {
      // ...
    }),
    propose: Struct({ proposal: u8 }).f(function*({ fields: { proposal } }) {
      // ...
    }),
    approve: Struct({ proposalId: u8 }).f(function*({ fields: { proposalId } }) {
      // ...
    }),
  }
})

class SoleSignatoryError extends Struct({}) {}
class InvalidThresholdError extends Struct({}) {}

const x = u8.resource(function*(count) {
  yield count

  const increment = u8.f(function*(by) {
    yield* count.assign(count.add(by))
    return by
  })

  return { count, increment }
})
