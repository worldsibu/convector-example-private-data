# Private data Convector tests

Example based on fabric's private data marbles

Test it:

```bash
hurl new
hurl install marp node -P ./chaincode-product --collections-config ./collections.json
export MARBLE=$(echo -n "{\"name\":\"marble1\",\"color\":\"blue\",\"size\":35,\"owner\":\"tom\",\"price\":99}" | base64)
hurl invoke marp Invoke initMarble -t "{\"marble\":\"$MARBLE\"}"

hurl invoke marp readMarble "marble1"
hurl invoke marp readMarblePrivateDetails "marble1"
```