import { ByteArray, Bytes , BigInt} from "@graphprotocol/graph-ts";
import {
    TransferSingle as TransferEvent,
  } from "../../generated/BBGItem/BBGItem"
  
  import {
    TransferSingle
  } from "../../generated/schema"
import { bbgItemContract } from "./helpers"
  
export function handleTransferSingle(event: TransferEvent): void {
    let entity = new TransferSingle(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    entity.from = event.params.from
    entity.to = event.params.to
    entity.amount = event.params.value
    
    entity.itemID = event.params.id.toString()
    
    
    let tokenIdTraitCall = bbgItemContract.try_tokenIdTrait(event.params.id); 

    if (!tokenIdTraitCall.reverted) {

        let catalogueId = BigInt.fromI32(tokenIdTraitCall.value.value0)
        let rarityId = BigInt.fromI32(tokenIdTraitCall.value.value1)
        let levelId = BigInt.fromI32(tokenIdTraitCall.value.value2)
        let graphicId = BigInt.fromI32(tokenIdTraitCall.value.value3)

        let getUidCall =  bbgItemContract.try_getUid(catalogueId , rarityId, levelId, graphicId) 

        if (!getUidCall.reverted) {

           let itemDetailCall = bbgItemContract.try_itemDetail(getUidCall.value)

            if (!itemDetailCall.reverted) {
                entity.name = itemDetailCall.value.getName()
            } else {
                entity.name = "unknown"
            }

        } else {
            entity.name = "unknown"
        }

    } else {
        entity.name = "unknown"
    }

    entity.operator = event.params.operator
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }
