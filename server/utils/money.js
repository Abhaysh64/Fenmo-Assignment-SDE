function toPaise(amount) {
  return Math.round(parseFloat(amount) * 100);
}

function toRupees(amount) {
  return (amount / 100).toFixed(2);
}

module.exports = { toPaise, toRupees };