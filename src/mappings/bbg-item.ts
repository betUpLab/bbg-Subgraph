import {
    TransferSingle as TransferEvent,
  } from "../../generated/BBGItem/BBGItem"
  
  import {
    TransferSingle
  } from "../../generated/schema"
import { bbgItemContract } from "./helpers"


  
export function handleTransferSingle(event: TransferEvent): void {
    // let entity = new TransferSingle(  
    //   event.transaction.hash.concatI32(event.logIndex.toI32())

    // )
    let entity = new TransferSingle(
      event.transaction.hash.toHex() + "-" + event.logIndex.toString()
    )
    entity.from = event.params.from
    entity.to = event.params.to
    entity.amount = event.params.value
    entity.itemID = event.params.id.toString()

    entity.operator = event.params.operator
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }
