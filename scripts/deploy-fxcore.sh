#!/bin/bash

set -o errexit -o pipefail

subgraphName="subgraphBBG"
graphNodePubUrl="https://testnet-graph-node.functionx.io"
graphNodeUrl="${TESTNET_GRAPH_NODE_URL}"
ipfsUrl="${TESTNET_GRAPH_IPFS_URL}"

yarn
yarn codegen
npx graph build

# echo "Deploying to Graph node"
npx graph create --node "${graphNodeUrl}" "${subgraphName}"
# npx graph deploy --ipfs "${ipfsUrl}" --node "${graphNodeUrl}" "${subgraphName}"
# npx graph deploy --ipfs "${ipfsUrl}" --node "${graphNodeUrl}" $name ${subgraph} -l "v0.0.1"
# npx graph deploy --ipfs "${ipfsUrl}" --node "${graphNodeUrl}" $name ${subgraph}subgraph.yaml -l "v0.0.1"


echo "Deploying subgraph ${subgraphName} to Graph node"
    if npx graph deploy --ipfs "${ipfsUrl}" --node "${graphNodeUrl}" "${subgraphName}" >/dev/null 2>&1; then
      echo "Deploying to Graph node"
      echo "Deployed to $graphNodePubUrl/subgraphs/name/${subgraphName}/graphql"
      echo "Subgraph endpoints:"
      echo "Queries (HTTP): $graphNodePubUrl/subgraphs/name/${subgraphName}"
      echo "Subscriptions (WS): $graphNodePubUrl/ws/subgraphs/name/${subgraphName}"
    else
      echo "Failed to deploy ${subgraphName}!"
    fi

# echo "Deployed to $graphNodePubUrl/subgraphs/name/${subgraphName}/graphql"
# echo "Subgraph endpoints:"
# echo "Queries (HTTP): $graphNodePubUrl/subgraphs/name/${subgraphName}"
# echo "Subscriptions (WS): $graphNodePubUrl/ws/subgraphs/name/${subgraphName}"
