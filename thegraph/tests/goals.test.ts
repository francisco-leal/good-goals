import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { GroupCreated } from "../generated/schema"
import { GroupCreated as GroupCreatedEvent } from "../generated/Goals/Goals"
import { handleGroupCreated } from "../src/goals"
import { createGroupCreatedEvent } from "./goals-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let groupName = "Example string value"
    let newGroupCreatedEvent = createGroupCreatedEvent(groupName)
    handleGroupCreated(newGroupCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("GroupCreated created and stored", () => {
    assert.entityCount("GroupCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "GroupCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "groupName",
      "Example string value"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
