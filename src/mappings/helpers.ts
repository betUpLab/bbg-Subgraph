import { Address, JSONValueKind } from "@graphprotocol/graph-ts"
import { JSONValue, TypedMap, json, log , ValueKind } from '@graphprotocol/graph-ts';

import { Bytes, BigInt } from '@graphprotocol/graph-ts';


import {
  BBGWool as BBGWoolContract  
} from "../../generated/BBGWool/BBGWool"


import {
  BBGItem as BBGItemContract  
} from "../../generated/BBGItem/BBGItem"

export const FACTORY_ADDRESS = "0xDADaa4956CAf8E0cda39925e1e31167693E91A42";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const FACTORY_BBGITEM_ADDRESS = "0xBd4137b99AB0671da8C666C8C358eEBEe007e06e";

export const FACTORY_BBGSHEEP_ADDRESS = "0x0e8fb933d9ff31377de74bac64bb4e3cf928cb3f";

export const FACTORY_BBGGARDEN_ADDRESS = "0x40dD352D7628d43DE836bE48Dca290D4C0955A42";

export let factoryContract = BBGWoolContract.bind(
  Address.fromString(FACTORY_ADDRESS)
);

export let bbgItemContract = BBGItemContract.bind(
  Address.fromString(FACTORY_BBGITEM_ADDRESS)
);

export let bbgSheepContract = BBGItemContract.bind(
  Address.fromString(FACTORY_BBGSHEEP_ADDRESS)
);

export let bbgGardenContract = BBGItemContract.bind(
  Address.fromString(FACTORY_BBGGARDEN_ADDRESS)
);


export function extractValueFromAttributes(jsonString: string): string {

    const rmOther = jsonString.replace('data:application/json;utf8,', '');
  
    let colorValue = "unknown";
  
    let jsonObject: JSONValue | null = json.fromString(rmOther);
  
    if (jsonObject != null && jsonObject.kind == JSONValueKind.OBJECT) {
      let obj = jsonObject.toObject();
  
      if (obj.isSet('attributes')) {
        let attributes = obj.get('attributes');
  
        if (attributes != null && attributes.kind == JSONValueKind.ARRAY) {
          let attributesArray = attributes.toArray();
  
          for (let i = 0; i < attributesArray.length; i++) {
            let attribute = attributesArray[i].toObject();
  
            if (
              attribute.isSet('trait_type') &&
              attribute.get('trait_type')!.toString() == 'Color' &&
              attribute.isSet('value')
            ) {
              colorValue = attribute.get('value')!.toString();
            }
          }
  
        } else {
          colorValue = "attributes is not an array";
        }
      } else {
        colorValue = "attributes not found";
      }
    } else {
      colorValue =  "JSON object is not an object"
    }
    return colorValue;
  }

export function getItemName(tokenId: BigInt): string { 

  let tokenIdTraitCall = bbgItemContract.try_tokenIdTrait(tokenId); 

    if (!tokenIdTraitCall.reverted) {

        let catalogueId = BigInt.fromI32(tokenIdTraitCall.value.value0)
        let rarityId = BigInt.fromI32(tokenIdTraitCall.value.value1)
        let levelId = BigInt.fromI32(tokenIdTraitCall.value.value2)
        let graphicId = BigInt.fromI32(tokenIdTraitCall.value.value3)

        let getUidCall =  bbgItemContract.try_getUid(catalogueId , rarityId, levelId, graphicId) 

        if (!getUidCall.reverted) {

           let itemDetailCall = bbgItemContract.try_itemDetail(getUidCall.value)

            if (!itemDetailCall.reverted) {
                return  itemDetailCall.value.getName()
            } else {
              return "unknown"
            }

        } else {
          return "unknown"
        }

    } else {
      return "unknown"
    }
}

export function getSheepName(tokenId: BigInt): string { 

  let tokenIdTraitCall = bbgSheepContract.try_tokenIdTrait(tokenId);
  if (!tokenIdTraitCall.reverted) {

    let catalogueId = BigInt.fromI32(tokenIdTraitCall.value.value0)
    let rarityId = BigInt.fromI32(tokenIdTraitCall.value.value1)
    let levelId = BigInt.fromI32(tokenIdTraitCall.value.value2)
    let graphicId = BigInt.fromI32(tokenIdTraitCall.value.value3)

    let getUidCall =  bbgSheepContract.try_getUid(catalogueId , rarityId, levelId, graphicId)

    if (!getUidCall.reverted) {

       let itemDetailCall = bbgSheepContract.try_itemDetail(getUidCall.value)

        if (!itemDetailCall.reverted) {
          return itemDetailCall.value.getName();
        } else {
          return "unknown";
        }
    }

  }  else {
    return "unknown";
  }
  return "unknown";
}

export function getGardenName(tokenId: BigInt): string { 

  let tokenIdTraitCall = bbgGardenContract.try_tokenIdTrait(tokenId);
  
  if (!tokenIdTraitCall.reverted) {
      
      let catalogueId = BigInt.fromI32(tokenIdTraitCall.value.value0)
      let rarityId = BigInt.fromI32(tokenIdTraitCall.value.value1)
      let levelId = BigInt.fromI32(tokenIdTraitCall.value.value2)
      let graphicId = BigInt.fromI32(tokenIdTraitCall.value.value3)
  
      let getUidCall =  bbgGardenContract.try_getUid(catalogueId , rarityId, levelId, graphicId)
  
      if (!getUidCall.reverted) {
  
        let itemDetailCall = bbgGardenContract.try_itemDetail(getUidCall.value)
  
          if (!itemDetailCall.reverted) {
            return itemDetailCall.value.getName();
          } else {
            return "unknown";
          }
      }
  
    }  else {
      return "unknown";
    }
  return "unknown";
}
