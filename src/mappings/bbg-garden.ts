import { Bytes } from "@graphprotocol/graph-ts";
import {
    Transfer as TransferEvent,
  } from "../../generated/BBGGarden/BBGGarden"
  
  import {
    GardenSingle
  } from "../../generated/schema"

import { getGardenName } from "./helpers"

  export function handleTransferGarden(event: TransferEvent): void {  
    let entity = new GardenSingle(
        event.transaction.hash.concatI32(event.logIndex.toI32())
      )

      entity.from = event.params.from
      entity.to = event.params.to
      entity.tokenId = event.params.tokenId
      
      entity.name = getGardenName(event.params.tokenId)

      entity.blockNumber = event.block.number
      entity.blockTimestamp = event.block.timestamp
      entity.transactionHash = event.transaction.hash
      entity.save()
  }
