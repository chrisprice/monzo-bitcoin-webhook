const readFileSync = require('fs').readFileSync;
const express = require('express');
const bodyParser = require('body-parser');
const wallet = require('./lib/wallet');
const extractTransaction = require('./lib/extractTransaction');

const configPath = process.argv[2];
const { secret, mnemonic, bws } = JSON.parse(readFileSync(configPath, 'utf8'));

wallet({ bws, mnemonic })
  .then(({ send }) => {

    const app = express();
    app.use(bodyParser.json());

    app.get('/', (req, res) => {
      res.sendStatus(200);
    });

    app.post('/:secret', (req, res) => {
      if (req.params.secret !== secret) {
        return res.sendStatus(404);
      }

      const transaction = extractTransaction(req.body);

      if (transaction == null) {
        return res.sendStatus(200);
      }

      console.log(`Sending ${transaction.amount} to ${transaction.address} (${transaction.message})`);

      send(transaction)
        .then(() => {
          console.log(`Sent ${transaction.amount} to ${transaction.address} (${transaction.message})`);
          res.sendStatus(200);
        })
        .catch((e) => {
          console.error(e);
          res.sendStatus(500);
        });
    });

    app.listen(3000, () => console.log('Listening on port 3000'));
  })
  .catch(console.error);
