#!/bin/bash

set -o errexit -o pipefail

subgraphName="subgraphBBG"
graphNodePubUrl="https://testnet-graph-node.functionx.io"
graphNodeUrl="${TESTNET_GRAPH_NODE_URL}"
ipfsUrl="${TESTNET_GRAPH_IPFS_URL}"

npm install

npx @graphprotocol/graph-cli remove --node "${graphNodeUrl}" $subgraphName
