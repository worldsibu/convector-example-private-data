# Private data Convector tests

Example based on fabric's private data marbles

Run the end-2-end test:

```bash
npm run env:restart
npm run cc:start -- product
npm run test:e2e
```

Test it with Hurley:

```bash
hurl new
hurl install marp node -P ./chaincode-product --collections-config ./collections.json
export MARBLE=$(echo -n "{\"name\":\"marble1\",\"color\":\"blue\",\"size\":35,\"owner\":\"tom\",\"price\":99}" | base64)
hurl invoke marp product_initMarble -t "{\"marble\":\"$MARBLE\"}"

hurl invoke marp product_readMarble "marble1"
hurl invoke marp product_readMarblePrivateDetails "marble1"
```