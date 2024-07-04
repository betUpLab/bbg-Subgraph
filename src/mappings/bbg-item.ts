import { ByteArray, Bytes , BigInt} from "@graphprotocol/graph-ts";
import {
    TransferSingle as TransferEvent,
    EventAddItem as GameItemEvent,
    EventAddMoreItemLevel as GameMoreItemEvent
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
    
    let temp = event.params.item
    let catalogueId = temp.catalogueId 
    let rarityId = temp.rarityId
    let levels = temp.levels
    let maxGraphics = temp.maxGraphics
    let names = temp.names

    for (let i = 0; i < levels.length; i++) {
      
      for (let j = 0; j < maxGraphics[i]; j++) {
        
        let _catalogueId = BigInt.fromI32(catalogueId)
        let _rarityId = BigInt.fromI32(rarityId)
        let _level = BigInt.fromI32(levels[i])
        let _graphicId = BigInt.fromI32(j+1)
        let _name = names[i][j]
 
        let getUidCall = bbgItemContract.try_getUid(_catalogueId, _rarityId, _level, _graphicId)
        if (!getUidCall.reverted) {

          let uuid = getUidCall.value.toHexString()
          let entity = GameItem.load(uuid) 

           if (entity == null) {
            entity = new GameItem(uuid)
            entity.catalogueId = _catalogueId
            entity.rarityId = _rarityId
            entity.level = _level
            entity.graphicId = _graphicId
            entity.name = _name
            entity.isActivated = true
            entity.save()
           }
        } 
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
      
        for (let j = 0; j < maxGraphics[i]; j++) {
          
          let _catalogueId = BigInt.fromI32(catalogueId)
          let _rarityId = BigInt.fromI32(rarityId)
          let _level = BigInt.fromI32(levels[i])
          let _graphicId = BigInt.fromI32(j+1)
          let _name = names[i][j]
   
          let getUidCall = bbgItemContract.try_getUid(_catalogueId, _rarityId, _level, _graphicId)
          if (!getUidCall.reverted) {
  
            let uuid = getUidCall.value.toHexString()
            let entity = GameItem.load(uuid) 
  
             if (entity == null) {
              entity = new GameItem(uuid)
              entity.catalogueId = _catalogueId
              entity.rarityId = _rarityId
              entity.level = _level
              entity.graphicId = _graphicId
              entity.name = _name
              entity.isActivated = true
              entity.save()
             }
          } 
        }
      }
  }

