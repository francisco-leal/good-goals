import {
  GroupCreated as GroupCreatedEvent,
  GroupDistributed as GroupDistributedEvent,
  GroupJoined as GroupJoinedEvent,
  GroupStarted as GroupStartedEvent,
  ProofSubmitted as ProofSubmittedEvent,
  VoteSubmitted as VoteSubmittedEvent
} from "../generated/Goals/Goals"
import {
  GroupCreated,
  GroupDistributed,
  GroupJoined,
  GroupStarted,
  ProofSubmitted,
  VoteSubmitted
} from "../generated/schema"

export function handleGroupCreated(event: GroupCreatedEvent): void {
  let entity = new GroupCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.groupName = event.params.groupName

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGroupDistributed(event: GroupDistributedEvent): void {
  let entity = new GroupDistributed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.groupName = event.params.groupName

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGroupJoined(event: GroupJoinedEvent): void {
  let entity = new GroupJoined(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.groupName = event.params.groupName
  entity.member = event.params.member

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleGroupStarted(event: GroupStartedEvent): void {
  let entity = new GroupStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.groupName = event.params.groupName
  entity.endTime = event.params.endTime

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleProofSubmitted(event: ProofSubmittedEvent): void {
  let entity = new ProofSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.groupName = event.params.groupName
  entity.member = event.params.member
  entity.proof = event.params.proof

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleVoteSubmitted(event: VoteSubmittedEvent): void {
  let entity = new VoteSubmitted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.groupName = event.params.groupName
  entity.member = event.params.member

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
