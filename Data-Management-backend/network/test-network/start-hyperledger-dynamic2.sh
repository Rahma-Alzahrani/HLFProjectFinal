#!/bin/bash

# Approve the chaincode for org3
echo "Completed peer lifecycle chaincode approveformyorg"
peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --channelID mychannel --name basic --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1

# Query the committed chaincode
echo "Completed peer lifecycle chaincode querycommitted"
peer lifecycle chaincode querycommitted --channelID mychannel --name basic

# Invoke the chaincode in org3
echo "Completed peer chaincode invoke"
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" --peerAddresses localhost:11051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'

#Back to api-folder to remove orgs
cd ..
cd ..
cd api-server
rm -rf org*

#Remove all org files too

cd src
cd config
rm -rf connection*

#Back to ChaincodeFolder and copy paste all org

cd ..
cd ..
cd ..
cd network
cd test-network
cd organizations
cd peerOrganizations
cd org1.example.com
cp ./connection-org1.json ../../../../../api-server/src/config
cd ..
cd org2.example.com
cp ./connection-org2.json ../../../../../api-server/src/config
cd ..
cd org3.example.com
cp ./connection-org3.json ../../../../../api-server/src/config


#Done
