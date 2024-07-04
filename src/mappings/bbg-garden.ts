import { Bytes, BigInt } from "@graphprotocol/graph-ts";
import {
    Transfer as TransferEvent,
  } from "../../generated/BBGGarden/BBGGarden"
  
  import {
    AllItem
  } from "../../generated/schema"

import { bbgGardenContract, getGardenName } from "./helpers"

  export function handleTransferGarden(event: TransferEvent): void {  
    let entity = new AllItem(
        event.transaction.hash.concatI32(event.logIndex.toI32())
      )

      entity.from = event.params.from
      entity.to = event.params.to
      entity.tokenId = event.params.tokenId.toString()
      entity.amount =  BigInt.fromI32(1)


      entity.blockNumber = event.block.number
      entity.blockTimestamp = event.block.timestamp
      entity.transactionHash = event.transaction.hash
      entity.type = "garden"

      let tokenIdTraitCall = bbgGardenContract.try_tokenIdTrait(BigInt.fromString(entity.tokenId)); 
      if (!tokenIdTraitCall.reverted) {
        let catalogueId = BigInt.fromI32(tokenIdTraitCall.value.value0)
        let rarityId = BigInt.fromI32(tokenIdTraitCall.value.value1)
        let levelId = BigInt.fromI32(tokenIdTraitCall.value.value2)
        let graphicId = BigInt.fromI32(tokenIdTraitCall.value.value3)
        entity.catalogueId = catalogueId
        entity.rarityId = rarityId
        entity.level = levelId
        entity.graphicId = graphicId    
      }

      entity.save()
  }
