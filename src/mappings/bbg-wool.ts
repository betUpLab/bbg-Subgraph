import {
  Transfer as TransferEvent,
  Transfer1 as Transfer1Event,
} from "../../generated/BBGWool/BBGWool"

import {
  Transfer,
  Transfer721,
  Token721List
} from "../../generated/schema"

import {
  extractValueFromAttributes,
  ADDRESS_ZERO,
  factoryContract,
} from "./helpers";


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

  let tokenID = event.params.id
  let to = event.params.to
  let transactionHash =  event.transaction.hash

  entity.from = event.params.from
  entity.to = to
  entity.tokenID = tokenID

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

  let token721List = Token721List.load(tokenID.toString())
  if(token721List == null){
    token721List = new Token721List(tokenID.toString())
      token721List.tokenID = tokenID.toString()
      token721List.owner = to
      token721List.transactionHash = transactionHash
      token721List.version = 1
      token721List.save()
  } else {
    token721List.owner = to
    token721List.transactionHash = transactionHash
    token721List.version = token721List.version + 1
    token721List.save()
  }
}
