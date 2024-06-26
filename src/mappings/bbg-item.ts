import { Bytes } from "@graphprotocol/graph-ts";
import {
    TransferSingle as TransferEvent,
  } from "../../generated/BBGItem/BBGItem"
  
  import {
    TransferSingle
  } from "../../generated/schema"
import { bbgItemContract, bigIntToBytes32 } from "./helpers"
  
export function handleTransferSingle(event: TransferEvent): void {
    let entity = new TransferSingle(
      event.transaction.hash.concatI32(event.logIndex.toI32())
    )
    entity.from = event.params.from
    entity.to = event.params.to
    entity.amount = event.params.value
    entity.itemID = event.params.id.toString()
    
    let bytesParams = Bytes.fromByteArray(Bytes.fromBigInt(event.params.id)) 
    let itemDetailCall = bbgItemContract.try_itemDetail(bytesParams);

    if (!itemDetailCall.reverted) {
        entity.name = itemDetailCall.value.getName() + bytesParams.toString()
    } else {
        entity.name = "unknown" + bytesParams.toString()
    }

    entity.operator = event.params.operator
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }
