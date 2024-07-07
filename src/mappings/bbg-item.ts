import { ByteArray, Bytes , BigInt, ethereum} from "@graphprotocol/graph-ts";
import {
    TransferSingle as TransferEvent,
    EventAddItem as GameItemEvent,
    EventAddMoreItemLevel as GameMoreItemEvent,
    EventAddMoreItemGraphic as GameMoreItemGraphicEvent
  } from "../../generated/BBGItem/BBGItem"
  
  import {
    AllItem,
    GameItem,
    MoreItemGraphic
  } from "../../generated/schema"
import { bbgItemContract, getItemName, getMaxGraphics } from "./helpers"
  
export function handleTransferSingle(event: TransferEvent): void {
    let entity = new AllItem(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    entity.from = event.params.from
    entity.to = event.params.to
    entity.amount = event.params.value
    
    entity.tokenId = event.params.id.toString()    
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.type = "tool"
        
    let tokenIdTraitCall = bbgItemContract.try_tokenIdTrait(BigInt.fromString(entity.tokenId)); 
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
          let _graphicId = getMaxGraphics(_catalogueId, _rarityId, _level).plus(BigInt.fromI32(j))
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

export function handleEventAddMoreItemGraphic(event: GameMoreItemGraphicEvent): void {

  let entity = new MoreItemGraphic(
    event.transaction.hash.toHexString().concat(event.logIndex.toString())
  )

  let inputValues = event.transaction.input;
  // let methodId = inputValues.slice(0, 10);

  entity.name = inputValues.slice(10, 74).toString();


  // // 根据合约 ABI 获取方法签名
  // let methodSignature = "(uint256,uint256,uint256,uint256,string[])";

  // // 解码输入参数
  // let decodedParams = ethereum.decode(methodSignature, inputValues);

  // if (decodedParams != null) {
  //   let catalogueId = decodedParams.toTuple()[0].toBigInt();
  //   let rarityId = decodedParams.toTuple()[1].toBigInt();
  //   let level = decodedParams.toTuple()[2].toBigInt();
  //   let graphicAmount = decodedParams.toTuple()[3].toBigInt();
  //   let names = decodedParams.toTuple()[4].toStringArray();
    
  //   for (let j = 0; j < graphicAmount.toI32(); j++) {
        
  //     let _graphicId = getMaxGraphics(catalogueId, rarityId, level).plus(BigInt.fromI32(j))

  //     let _name = names[j]

  //     let getUidCall = bbgItemContract.try_getUid(catalogueId, rarityId, level, _graphicId)
  //     if (!getUidCall.reverted) {

  //       let uuid = getUidCall.value.toHexString()
  //       let entity = GameItem.load(uuid) 

  //        if (entity == null) {
  //         entity = new GameItem(uuid)
  //         entity.catalogueId = catalogueId
  //         entity.rarityId = rarityId
  //         entity.level = level
  //         entity.graphicId = _graphicId
  //         entity.name = _name
  //         entity.isActivated = true
  //         entity.save()
  //        }
  //     } 
  //   }

  //   entity.image = catalogueId.toHexString().concat(rarityId.toHexString()).concat(level.toHexString());
  // } else {
  //   entity.description = "decoded unknown";
  //   entity.image = inputValues.toHexString();
  // }
  entity.description = "decoded unknown";
  entity.image = inputValues.toHexString();
  entity.graphicId = BigInt.fromI32(0);
  entity.save()
} 


