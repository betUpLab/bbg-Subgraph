#!/bin/bash

set -o errexit -o pipefail

subgraphName="subgraphBBG"
graphNodePubUrl="https://testnet-graph-node.functionx.io"
graphNodeUrl="${TESTNET_GRAPH_NODE_URL}"
ipfsUrl="${TESTNET_GRAPH_IPFS_URL}"

yarn
yarn codegen
npx graph build

echo "Deploying to Graph node"
npx graph create --node "${graphNodeUrl}" "${subgraphName}"
# npx graph deploy --ipfs "${ipfsUrl}" --node "${graphNodeUrl}" "${subgraphName}"
npx graph deploy --ipfs "${ipfsUrl}" --node "${graphNodeUrl}" $name ${subgraph} -l "v0.0.1"
echo "Deployed to $graphNodePubUrl/subgraphs/name/${subgraphName}/graphql"
echo "Subgraph endpoints:"
echo "Queries (HTTP): $graphNodePubUrl/subgraphs/name/${subgraphName}"
echo "Subscriptions (WS): $graphNodePubUrl/ws/subgraphs/name/${subgraphName}"
