import { Bytes } from "@graphprotocol/graph-ts";
import {
    Transfer as TransferEvent,
  } from "../../generated/BBGSheep/BBGSheep"
  
  import {
    SheepSingle
  } from "../../generated/schema"
import { bbgItemContract } from "./helpers"

  export function handleTransferSheep(event: TransferEvent): void {  
    let entity = new SheepSingle(
        event.transaction.hash.concatI32(event.logIndex.toI32())
      )

      entity.from = event.params.from
      entity.to = event.params.to
      entity.tokenId = event.params.tokenId
      
      entity.blockNumber = event.block.number
      entity.blockTimestamp = event.block.timestamp
      entity.transactionHash = event.transaction.hash
      entity.save()
  }
