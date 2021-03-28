const roll = (dice) => {
  return Math.floor((Math.random() * dice) + 1)
}

const rollXAmount = (amount, dice) => {
  const rollArray = [];
  for (let i = 0; i < amount; i++) {
    rollArray.push(roll(dice));
  }
  return rollArray;
}

// OLD
const checkDiceArguments = (list) => {
  return list.map(element => {
    return
  })
}

const rollAdvantage = () => {
  const result = rollXAmount(2, 20);
  return {
    higher: result[0] > result[1] ? result[0] : result[1],
    lower: result[0] < result[1] ? result[0] : result[1]
  };
}

// OLD
const findCalculation = (args) => {
  return args.find(element => {
    return element.includes('+') ||
    element.includes('-') ||
     element.includes('*') ||
     element.includes('/')
  });
}

const calculate = (sum, modifier, amount) => {
  console.log('asd');
}

// OLD
const findDicer = (args) => {
  return args.find(element => {
    return element.includes('d')
  });
}

const findAdvantage = (args) => {
  return args.find(element => {
    return element.includes('advantage') ||
    element.includes('a');
  });
}

const findDisadvantage = (args) => {
  return args.find(element => {
    return element.includes('disadvantage') ||
    element.includes('dis');
  });
}

module.exports = {
roll,
findDisadvantage,
findAdvantage,
findDicer,
calculate,
findCalculation,
rollAdvantage,
rollXAmount,
roll,
 };
