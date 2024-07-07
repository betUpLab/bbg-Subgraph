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
import { bbgItemContract, getItemName, getMaxGraphics, getMaxLevel } from "./helpers"
  
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
          let _graphicId = BigInt.fromI32(j+1)//getMaxGraphics(_catalogueId, _rarityId, _level).plus(BigInt.fromI32(j))
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

  entity.name =  event.params.uid.toHexString();
  entity.description = "decoded unknown";
  entity.image = inputValues.toHexString();
  entity.graphicId = BigInt.fromI32(0);
 
  let inputData = event.transaction.input;
  const encodedData = event.transaction.input;
  const types = '(uint256,uint256,uint256,uint256,string[])';
  const functionInput = encodedData.subarray(4);
  const tuplePrefix = ByteArray.fromHexString('0x0000000000000000000000000000000000000000000000000000000000000020');
  const functionInputAsTuple = new Uint8Array(tuplePrefix.length + functionInput.length);
  functionInputAsTuple.set(tuplePrefix, 0);
  functionInputAsTuple.set(functionInput, tuplePrefix.length);
  const tupleInputBytes = Bytes.fromUint8Array(functionInputAsTuple);
  // 进行解码
  const decodedData = ethereum.decode(types, tupleInputBytes);
  
  if (decodedData != null) {

    let catalogueId = decodedData.toTuple()[0].toBigInt();
    let rarityId = decodedData.toTuple()[1].toBigInt();
    let level = decodedData.toTuple()[2].toBigInt();
    let graphicAmount = decodedData.toTuple()[3].toBigInt();
    let names = decodedData.toTuple()[4].toStringArray();

    entity.image = catalogueId.toString().concat(rarityId.toString()).concat(level.toString()).concat(graphicAmount.toString()).concat(names.join(","));
    entity.save()

    for (let i = 0; i < graphicAmount.toI32(); i++) {
      
      let maxlevel =  getMaxLevel(catalogueId, rarityId)
      let _name = names[i]

      let _graphicId = getMaxGraphics(catalogueId, rarityId, maxlevel).plus(BigInt.fromI32(i+1))
  
      let getUidCall = bbgItemContract.try_getUid(catalogueId, rarityId, level, _graphicId)
      if (!getUidCall.reverted) { 
        let uuid = getUidCall.value.toHexString()
        let gameItem = GameItem.load(uuid) 
        if (gameItem == null) {
          gameItem = new GameItem(uuid)
          gameItem.catalogueId = catalogueId
          gameItem.rarityId = rarityId
          gameItem.level = level
          gameItem.graphicId = _graphicId
          gameItem.name = _name
          gameItem.isActivated = true
          gameItem.save()
        }
      }
    }
  } 

}

