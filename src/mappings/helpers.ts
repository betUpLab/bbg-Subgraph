import { Address, JSONValueKind } from "@graphprotocol/graph-ts"
import { JSONValue, TypedMap, json, log , ValueKind } from '@graphprotocol/graph-ts';

import {
  BBGWool as BBGWoolContract  
} from "../../generated/BBGWool/BBGWool"


import {
  BBGItem as BBGItemContract  
} from "../../generated/BBGItem/BBGItem"

export const FACTORY_ADDRESS = "0xDADaa4956CAf8E0cda39925e1e31167693E91A42";
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

export const FACTORY_BBGITEM_ADDRESS = "0xBd4137b99AB0671da8C666C8C358eEBEe007e06e";

export let factoryContract = BBGWoolContract.bind(
  Address.fromString(FACTORY_ADDRESS)
);

export let bbgItemContract = BBGItemContract.bind(
  Address.fromString(FACTORY_BBGITEM_ADDRESS)
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