const notesRegex = /^tuckshop:(.*)$/i;
const satoshisPerBitcoin = 1e8;

const validateTransaction = ({ type, amount, currency, notes }) => {
  if (type !== 'transaction.created') {
    return 'Non-creation transaction';
  }
  if (currency !== 'GBP') {
    return 'Non-GBP transaction';
  }
  if (amount <= 0) {
    return 'Non-positive amount';
  }
  if (!notes.match(notesRegex)) {
    return 'Non-matching transaction';
  }
  return true;
};

module.exports = (transaction) => {
  const { type, data: { id, amount, currency, notes } } = transaction;

  const validationResult = validateTransaction({ type, amount, currency, notes });

  if (validationResult !== true) {
    console.log(`Transaction ${id} ignored: ${validationResult}`);
    return;
  }

  const amountSatoshis = amount / 100 * satoshisPerBitcoin;

  const [_, address] = notes.match(notesRegex);
  return { message: id, amount: amountSatoshis, address };
};
