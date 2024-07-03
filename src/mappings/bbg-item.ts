import { ByteArray, Bytes , BigInt} from "@graphprotocol/graph-ts";
import {
    TransferSingle as TransferEvent,
    EventAddItem as GameItemEvent,
    EventAddMoreItemLevel as GameMoreItemEvent,
    EventAddMoreItemGraphic as GameMoreItemGraphicEvent,
    EventUpdateGraphic as GameUpdateGraphicEvent
  } from "../../generated/BBGItem/BBGItem"
  
  import {
    TransferSingle,
    GameItem
  } from "../../generated/schema"
import { bbgItemContract, getItemName } from "./helpers"
  
export function handleTransferSingle(event: TransferEvent): void {
    let entity = new TransferSingle(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    entity.from = event.params.from
    entity.to = event.params.to
    entity.amount = event.params.value
    
    entity.itemID = event.params.id.toString()
    
    entity.name = getItemName(event.params.id)
    
    entity.operator = event.params.operator
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }

  export function handleEventAddItem(event: GameItemEvent): void {
    
    let temp =  event.params.item
    let catalogueId = temp.catalogueId 
    let rarityId = temp.rarityId

    let levels = temp.levels
    let maxGraphics = temp.maxGraphics
    let names = temp.names

    for (let i = 0; i < levels.length; i++) {
      
      for (let j = 0; j < maxGraphics.length; j++) {
        let entity = new GameItem(
          "GameItem" + catalogueId.toString() + rarityId.toString() + levels[i].toString() + maxGraphics[j].toString()
        )
        entity.catalogueId = BigInt.fromI32(catalogueId)
        entity.rarityId = BigInt.fromI32(rarityId)
        entity.level = BigInt.fromString(i.toString())
        entity.graphicId = BigInt.fromString(j.toString())
        entity.name = names[i][j]

        let getUidCall = bbgItemContract.try_getUid(entity.catalogueId, entity.rarityId, BigInt.fromI32(i), BigInt.fromI32(j))

        if (!getUidCall.reverted) {
          let itemDetailCall = bbgItemContract.try_itemDetail(getUidCall.value)
          if (!itemDetailCall.reverted) {
            entity.id = getUidCall.value.toString()
          }
        } 
        entity.save()
      }
    }
  }

  export function handleEventAddMoreItemLevel(event: GameMoreItemEvent): void {
      let temp =  event.params.item
      let catalogueId = temp.catalogueId 
      let rarityId = temp.rarityId
  
      let levels = temp.levels
      let maxGraphics = temp.maxGraphics
      let names = temp.names
  
      for (let i = 0; i < levels.length; i++) {
        
        for (let j = 0; j < maxGraphics.length; j++) {
          let entity = new GameItem(
            "GameItem" + catalogueId.toString() + rarityId.toString() + levels[i].toString() + maxGraphics[j].toString()
          )
          entity.catalogueId = BigInt.fromI32(catalogueId)
          entity.rarityId = BigInt.fromI32(rarityId)
          entity.level = BigInt.fromString(i.toString())
          entity.graphicId = BigInt.fromString(j.toString())
          entity.name = names[i][j]
          
          let getUidCall = bbgItemContract.try_getUid(entity.catalogueId, entity.rarityId, BigInt.fromI32(i), BigInt.fromI32(j))

        if (!getUidCall.reverted) {
          let itemDetailCall = bbgItemContract.try_itemDetail(getUidCall.value)
          if (!itemDetailCall.reverted) {
            entity.id = getUidCall.value.toString()
          }
        }
          entity.save()
        }
      } 
  }

  export function handleEventAddMoreItemGraphic(event: GameMoreItemGraphicEvent): void {

  }

  export function handleEventUpdateGraphic(event: GameUpdateGraphicEvent): void {
    
  }

