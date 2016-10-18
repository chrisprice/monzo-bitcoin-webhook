A Monzo peer-to-peer transaction webhook handler for auto-magically exchanging GBP for ScottCoins. ScottCoins are Scott Logic's permissioned blockchain currency (more accurately/legally tokens), predominantly used for buying Monster Munch from the tuck shop.

To run your own copy, you'll need to create a "hot" wallet (just a wallet with funds in it you'd be happy to potentially lose) and have a Monzo account.

Now create a configuration file -

```json
{
  "mnemonic": "some random collection of words",
  "secret": "guid",
  "bws": "https://bws.bitpay.com/bws/api"
}
```

The `mnemonic` should match the backup phrase from your hot wallet, obviously keep this secret. The `secret` can be any GUID and will be used to validate the request came from Monzo, again keep it secret. Finally `bws` is the URL the `bitcore-wallet-client` should connect to (we point it at our ScottCoin insance), not necessarily secret.

Now run up the docker image with the configuration file mounted at `/app/config.json` and publish the port behind some form of HTTPS offload. N.B. HTTPS is required to ensure the secret doesn't become un-secret which would allow someone to plunder your hot wallet funds.

Sign into the [Monzo developer console](https://developers.getmondo.co.uk/api/playground) then take the publically accessibly (HTTPS!) URL of the running instance and register it as a webhook.
