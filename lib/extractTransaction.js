const descriptionRegex = /^tuckshop:(.*)$/i;
const satoshisPerBitcoin = 1e8;

const validateTransaction = ({ type, amount, currency, description }) => {
  if (type !== 'transaction.created') {
    return 'Non-creation transaction';
  }
  if (currency !== 'GBP') {
    return 'Non-GBP transaction';
  }
  if (amount <= 0) {
    return 'Non-positive amount';
  }
  if (!description.match(descriptionRegex)) {
    return 'Non-matching transaction';
  }
  return true;
};

module.exports = (transaction) => {
  const { type, data: { id, amount, currency, description } } = transaction;

  const validationResult = validateTransaction({ type, amount, currency, description });

  if (validationResult !== true) {
    console.log(`Transaction ${id} ignored: ${validationResult}`);
    return;
  }

  const amountSatoshis = amount / 100 * satoshisPerBitcoin;

  const [_, address] = description.match(descriptionRegex);
  return { message: id, amount: amountSatoshis, address };
};
