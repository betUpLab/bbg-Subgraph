import { Address, JSONValueKind } from "@graphprotocol/graph-ts"
import { JSONValue, TypedMap, json, log , ValueKind } from '@graphprotocol/graph-ts';

import {
  Transfer as TransferEvent,
  Transfer1 as Transfer1Event,
  BBGWool as BBGWoolContract  
} from "../../generated/BBGWool/BBGWool"

import {
  Transfer,
  Transfer721
} from "../../generated/schema"

export const FACTORY_ADDRESS = "0xDADaa4956CAf8E0cda39925e1e31167693E91A42";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export let factoryContract = BBGWoolContract.bind(
  Address.fromString(FACTORY_ADDRESS)
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

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  entity.from = event.params.from
  entity.to = event.params.to
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

}

export function handleTransfer1(event: Transfer1Event): void {
  let entity = new Transfer721(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenID = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

    let tokenURICall = factoryContract.try_tokenURI(event.params.id);
    if (!tokenURICall.reverted) {
      const tokenURI = tokenURICall.value.toString();
      entity.colorID = extractValueFromAttributes(tokenURI);
    } else { 
      entity.colorID = "";
    } 

  if (event.params.to.toHexString() != ADDRESS_ZERO) {
    entity.save();
  }
}
