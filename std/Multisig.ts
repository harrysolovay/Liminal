export {}

// import * as L from "../core/mod.ts"

// export class Approvals extends L.Mapping(L.Vk, L.LSet(L.u8)) {}

// export class Multisig extends L.Struct({
//   signatories: L.LSet(L.id),
//   threshold: L.u8,
//   approvals: Approvals,
//   id: L.id,
// }) {
//   static *create({ signatories, threshold }: { signatories: L.LSet<L.id>; threshold: L.u8 }) {
//     yield* signatories.size.equals(1).not().assert(SoleSignatoryError.new())
//     const approvals = Approvals.new()
//     const id = L.pureProxy(L.f({ proposal: L.Vk }, function*({ proposal }) {
//       const approvals_ = yield* approvals.get(proposal)["?"](L.None)
//       yield* approvals_.size.gte(threshold).assert(InsufficientApprovals.new())
//       return proposal
//     }))
//     return this.new({ approvals, id, signatories, threshold })
//   }

//   fund = L.f({ amount: L.u256 }, function*({ amount }) {
//     const funder = yield* L.sender.signer("funder")
//     yield* funder.send(amount, id)
//   })

//   propose = L.f({ vk: L.Vk }, function*({ vk }) {
//     const approvals_ = yield* approvals.get(vk)["?"](L.None, MultisigDneError.new())
//     const approvalSet = yield* approvals_.get(vk)["?"](L.None)
//     yield* approvalSet.assign(approvalSet.add(L.sender))
//   })
// }

// export class ProposalAlreadyExistsError extends L.Struct({ tag: "ProposalAlreadyExistsError" }) {}
// export class MultisigDneError extends L.Struct({ tag: "MultisigDneError" }) {}
// export class ProposalDneError extends L.Struct({ tag: "ProposalDneError" }) {}
// export class SoleSignatoryError extends L.Struct({ tag: "SoleSignatoryError" }) {}
// export class InsufficientApprovals extends L.Struct({ tag: "InsufficientApprovals" }) {}
