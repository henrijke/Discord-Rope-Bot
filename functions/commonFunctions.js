// const { calculationParameters } = require('./diceFunctions');

// Go through the arguments and if char is found split the argument with it
// const find = (argumentList, char) => {
//   const list = argumentList.find(element => element.includes(char));
//   return list ? list.split(char) : null;
// }

// const findFromString = (string, char) => {
//   return string.split(char);
// }

// OLD
// const checkIfDice = (string) => {
//   string.includes('d/\d+/');
// }

// const findCalculations = (string) => {
//   console.log('string', string);
// const test = calculationParameters.map(element => find(string, element));
// console.log('test', test);
// }

// const splitString = (string) => {
//   return string.split(/\d+/).filter(word => word !== '');
// }

const replaceString = (originalString, oldString, newString) => {
  return originalString.replace(oldString, newString);
}

const embedLength = (string, number) => {
  const num = number ? number : 1024
  return string.length > num ? string.slice(0, num-4) + '...' : string;
}

module.exports = {
  replaceString,
  embedLength,
 };
