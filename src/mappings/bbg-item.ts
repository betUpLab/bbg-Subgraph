import { Bytes, ethereum } from "@graphprotocol/graph-ts"
import {
    TransferSingle as TransferEvent,
  } from "../../generated/BBGItem/BBGItem"
  
  import {
    TransferSingle
  } from "../../generated/schema"
import { bbgItemContract } from "./helpers"
  
export function handleTransferSingle(event: TransferEvent): void {
    let entity = new TransferSingle(
      event.transaction.hash.toHexString().concat(event.logIndex.toI32().toString())
    )
    entity.from = event.params.from
    entity.to = event.params.to
    entity.amount = event.params.value
    entity.id = event.params.id.toString()


      // let items =  bbgItemContract.try_itemDetail(Bytes.fromHexString(entity.id));

      // if (!items.reverted) {
      //   entity.name = items.value.getName();
      // } else {
      //   entity.name = "unknown";
      // }

    entity.operator = event.params.operator
    entity.blockNumber = event.block.number
    entity.blockTimestamp = event.block.timestamp
    entity.transactionHash = event.transaction.hash
    entity.save()
  }
