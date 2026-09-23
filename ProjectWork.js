const readline = require('readline');
let thresholds = [];


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function start() {
  let choice = await ask('Would you like to generate numbers (1) or provide your own numbers (2)? ');
  if (choice === '1') {
    function generateRandomNumbers(amount) {
      const numbers = [];

      for (let i = 0; i < amount; i++) {
        const randomNum = Math.floor(Math.random() * 1000) + 1;
        numbers.push(randomNum);
      }
      return numbers;
    }
    const amount = await ask('How many random numbers would you like to generate? ');
    const numbers = generateRandomNumbers(Number(amount));
    console.log(`Generated numbers: ${numbers}`);
    return numbers;
  }
  else if (choice === '2') {
    const numbers = await getNumbers();
    console.log(`Your numbers: ${numbers}`);
    return numbers;
  }
}

async function getNumbers() {
  const input = await ask('Enter numbers separated by spaces: ');
  return input.trim().split(/\s+/).map(Number); // \s+ means one or more white space characters
}

async function getOperator() {
  const answer = await ask('What operator would you like to use (square or sqrt)? ');
  return answer.trim().toLowerCase();
}

function applyOperator(numbers, operator) {
  if (operator === 'square' || operator === 'squared') {
    return numbers.map(num => num ** 2);
  } else if (operator === 'sqrt' || operator === 'square root') {
    return numbers.map(num => Math.sqrt(num));
  }
  return null; 
}

async function getThreshold() {
  const count = await ask('How many thresholds would you like? ');
  for (let i = 0; i < Number(count); i++) {
    const answer = await ask(`What should threshold number ${i + 1} be?: `);
    thresholds.push(Number(answer));
  }
}

function round(number) {
  return Number(number.toFixed(3));
}

async function higher_lower(list, threshold) {
    let list_higher = []
    let list_lower = []
    let list_length = list.length
    for (let i=0; i<list_length; i++) {
        list[i]>= threshold ? list_higher.push(list[i]) : list_lower.push(list[i])
    }
    console.log(`These are the numbers that are lower than ${threshold}: ${list_lower}`)
    console.log(`These are the numbers that are higher than ${threshold}: ${list_higher}`)
}

 async function lower(list, threshold) {
    let list_lower = []
    let list_length = list.length
    for (let i=0; i<list_length; i++) {
        if (list[i] < threshold) {
            list_lower.push(list[i])
        }
    }
    console.log(`These are the numbers that are lower than ${threshold}: ${list_lower}`)
}

// function printResults(finalHigher, finalLower, threshold) {
//   const formattedHigher = finalHigher.map(round);
//   const formattedLower = finalLower.map(round);

//   console.log(`These are the numbers that are higher than ${round(threshold)}: ${formattedHigher}`);
//   console.log(`These are the numbers that are lower than ${round(threshold)}: ${formattedLower}`);
// }

async function main() {
  const numbers1 = await start();
  const operator = await getOperator();

  const numbers = applyOperator(numbers1, operator);
  if (numbers === null) {
    console.log('Choose "square" or "sqrt" ');
    rl.close();
    return;
  }
  console.log(`Operator is ${operator}`);
  await getThreshold()
  
  thresholds.sort((a, b) => a - b)
  for (let i = 1; i <= thresholds.length; i++) {
        if (i == thresholds.length) {
            higher_lower(numbers, thresholds[i - 1])
        } else {
            lower(numbers, thresholds[i - 1])
        }
  }


  rl.close();
}

main();
