import { Address } from "@graphprotocol/graph-ts"
import {
  Transfer as TransferEvent,
  Transfer1 as Transfer1Event,
  BBGWool as BBGWoolContract
} from "../../generated/BBGWool/BBGWool"

import {
  Transfer,
  Transfer1
} from "../../generated/schema"

export const FACTORY_ADDRESS = "0xDADaa4956CAf8E0cda39925e1e31167693E91A42";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export let factoryContract = BBGWoolContract.bind(
  Address.fromString(FACTORY_ADDRESS)
);

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

}

export function handleTransfer1(event: Transfer1Event): void {
  let entity = new Transfer1(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenID = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  // entity.name = "0404"
  let jsonString = factoryContract.tokenURI(event.params.id);
  entity.name = jsonString
  if (event.params.to.toHexString() != ADDRESS_ZERO) {
    entity.save();
  }
}

