import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  GroupCreated,
  GroupDistributed,
  GroupJoined,
  GroupStarted,
  ProofSubmitted,
  VoteSubmitted
} from "../generated/Goals/Goals"

export function createGroupCreatedEvent(groupName: string): GroupCreated {
  let groupCreatedEvent = changetype<GroupCreated>(newMockEvent())

  groupCreatedEvent.parameters = new Array()

  groupCreatedEvent.parameters.push(
    new ethereum.EventParam("groupName", ethereum.Value.fromString(groupName))
  )

  return groupCreatedEvent
}

export function createGroupDistributedEvent(
  groupName: string,
  eligible: Array<Address>
): GroupDistributed {
  let groupDistributedEvent = changetype<GroupDistributed>(newMockEvent())

  groupDistributedEvent.parameters = new Array()

  groupDistributedEvent.parameters.push(
    new ethereum.EventParam("groupName", ethereum.Value.fromString(groupName))
  )
  groupDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "eligible",
      ethereum.Value.fromAddressArray(eligible)
    )
  )

  return groupDistributedEvent
}

export function createGroupJoinedEvent(
  groupName: string,
  member: Address
): GroupJoined {
  let groupJoinedEvent = changetype<GroupJoined>(newMockEvent())

  groupJoinedEvent.parameters = new Array()

  groupJoinedEvent.parameters.push(
    new ethereum.EventParam("groupName", ethereum.Value.fromString(groupName))
  )
  groupJoinedEvent.parameters.push(
    new ethereum.EventParam("member", ethereum.Value.fromAddress(member))
  )

  return groupJoinedEvent
}

export function createGroupStartedEvent(
  groupName: string,
  endTime: BigInt
): GroupStarted {
  let groupStartedEvent = changetype<GroupStarted>(newMockEvent())

  groupStartedEvent.parameters = new Array()

  groupStartedEvent.parameters.push(
    new ethereum.EventParam("groupName", ethereum.Value.fromString(groupName))
  )
  groupStartedEvent.parameters.push(
    new ethereum.EventParam(
      "endTime",
      ethereum.Value.fromUnsignedBigInt(endTime)
    )
  )

  return groupStartedEvent
}

export function createProofSubmittedEvent(
  groupName: string,
  member: Address,
  proof: string
): ProofSubmitted {
  let proofSubmittedEvent = changetype<ProofSubmitted>(newMockEvent())

  proofSubmittedEvent.parameters = new Array()

  proofSubmittedEvent.parameters.push(
    new ethereum.EventParam("groupName", ethereum.Value.fromString(groupName))
  )
  proofSubmittedEvent.parameters.push(
    new ethereum.EventParam("member", ethereum.Value.fromAddress(member))
  )
  proofSubmittedEvent.parameters.push(
    new ethereum.EventParam("proof", ethereum.Value.fromString(proof))
  )

  return proofSubmittedEvent
}

export function createVoteSubmittedEvent(
  groupName: string,
  member: Address
): VoteSubmitted {
  let voteSubmittedEvent = changetype<VoteSubmitted>(newMockEvent())

  voteSubmittedEvent.parameters = new Array()

  voteSubmittedEvent.parameters.push(
    new ethereum.EventParam("groupName", ethereum.Value.fromString(groupName))
  )
  voteSubmittedEvent.parameters.push(
    new ethereum.EventParam("member", ethereum.Value.fromAddress(member))
  )

  return voteSubmittedEvent
}
