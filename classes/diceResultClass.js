function DiceResult(amount, diceResults, newString, originalDice) {
    this.amount = amount;
    this.diceResults = diceResults;
    this.newString = newString;
    this.originalDice = originalDice;
}

module.exports = {
    DiceResult: DiceResult
}
