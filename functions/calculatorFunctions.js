const calculationParameters = [
  '+',
  '-',
  '/',
  '*',
];

const add = (parameter, number) => {
  return parameter + number;
}

const deduct = (parameter, number) => {
  return parameter - number;
}

const multiple = (parameter, number) => {
  return parameter * number;
}

const division = (parameter, number) => {
  return number !== 0 ? parameter / number : parameter;
}

const isMathFunction = (parameter, operation, number) => {
  switch(operation) {
    case '+':
      return add(parameter, number);
      break;
    case '+':
      return deduct(parameter, number);
      break;
    case '+':
      return multiple(parameter, number);
      break;
    case '+':
      return division(parameter, number);
      break;
    default:
  }
}

module.exports = {
  add,
  deduct,
  multiple,
  division,
  isMathFunction,
  calculationParameters,
}
