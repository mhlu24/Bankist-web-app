'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

// const account5 = {
//   owner: 'Minhang Lu',
//   movements: [10000, 2000, -3000, 45, 30],
//   interestRate: 2,
//   pin: 5555,
// };

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// Function to Display the movements
const displayMovements = function (movements, sort = false) {
  //Setting the whole original html details to empty
  // similar to .textContent = 0;
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    //check if it is deposite or withdrawal
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    //creating a html template literal
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// Displaying the balance
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // acc.balance = balance;
  labelBalance.textContent = `${acc.balance} €`;
};

//Displaying the summary
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interest}€`;
};
calcDisplaySummary(account1);

// Computing Usernames
console.log('----COMPUTING USERNAME---------');
const user = 'Steven Thomas Williams';
//what we want is stw
// const username = user.toLowerCase().split(' ');
// console.log(username);
// //from the above we want to have a new string which contains the letters stw, so MAP is the best for this use case
// const nameMap = username.map(function(name){
//   return name[0];
// }).join('');

// console.log(nameMap);
//to make the above simple
//MAKE IT INTO A FUNCTION
const createUserNames = function (accs) {
  //Inside this function perfrom a for each on each accounts element(accs);
  accs.forEach(function (acc) {
    //adding an attribute (username) to each object
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
//accounts is an array of objects
createUserNames(accounts);
console.log(accounts);

//update UI
const updateUI = function (acc) {
  //Display movements
  displayMovements(currentAccount.movements);

  //Display balance
  calcDisplayBalance(currentAccount);

  //Display summary
  calcDisplaySummary(currentAccount);
  // console.log('LOGIN');
};

// --------LOG IN-------Event handlers,
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent form from submitting
  //The preventDefault()method of the event interface tells the user
  //agent that if the vent does not get explicitly handled, its
  //default action should not be taken as it normally would be.
  e.preventDefault();

  //check if the username is in the system
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  //check password
  //otional chaining， checks if currentaccount exists
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and Welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    //when we are logged in, we show the transactions
    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    //get rid of the cursor
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }

  // console.log(currentAccount);
});

// ----------TRANSFER--------
btnTransfer.addEventListener('click', function (e) {
  //when working with forms this is basic
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  //this is to clear the input in the UI
  inputTransferAmount.value = inputTransferTo.value = '';

  //first we need to check whether amount is over 0
  //second we need to check current account has enough money
  //third we need to check receiver name is not current user name
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //if all is valid, we minus the amount from current account
    currentAccount.movements.push(-amount);
    //and add the amount to the receive account
    receiverAcc.movements.push(amount);

    //Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    //add the amount to current account
    currentAccount.movements.push(amount);

    //updateUI
    updateUI(currentAccount);
  }
  //clear input field
  inputLoanAmount.value = '';
});
//---------CLOSE ACCOUNT-----------
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  // console.log('delete');

  //if input name (from input text) = currentaccount.owner &&
  //if input pin (from input text) = currentaccount.pin
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    console.log('delete');
    //use splice method to delete the account
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    console.log(index);

    //delete currentAccount[index] from the accounts array
    //remove one element at index
    accounts.splice(index, 1);

    //log off user = Hide UI
    containerApp.style.opacity = 0;
  }

  //clear input text
  inputCloseUsername.value = inputClosePin.value = '';
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

// console.log(createUserNames('Steven Thomas Williams'));

// console.log(containerMovements.innerHTML);
//Summary:
//1 .insertAdjacentHTML(position, text)
//2 .innerHTML
//3.html template literal

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// //   SLICE ---DOES NOT MUTATE THE ARRAY

// //slice(beginIndex)//(inclusive, exclusive)
// console.log(arr.slice(2)); //returns a new array
// console.log(arr.slice(-2)); //['d', 'e']
// //create a shallow copy with slice
// console.log(arr.slice());
// //create a shallow copy with spread
// console.log([...arr]);

// //   SPLICE --MUTATES THE ARRAY
// //arr.splice(inclusive, inclusive) //means this two will be deleted
// // console.log(arr.splice(2)); //['c', 'd', 'e']
// console.log(arr); //['a', 'b']
// //use case: removing elements in array
// arr.splice(-1);
// console.log(arr);

// //   REVERSE ---- MUTATES THE ARRAY
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //   CONCAT --- DOES NOT MUTATE ARRAYS
// const letters = arr.concat(arr2);
// console.log(letters);
// //using SPREAD to achieve the same
// console.log([...arr, ...arr2]);

// // JOIN
// console.log(letters.join(' - ')); //Returns a string

const arr = [23, 11, 64];
// The AT method
console.log(arr[0]);
//ES2022 to extract one element in array
console.log(arr.at(0));

// Getting the last element
// suppose we dont know the length of the array
console.log(arr[arr.length - 1]);
console.log(arr.slice(-1)[0]);
console.log(arr.at(-1));

//The At Method also works on strings
console.log('Minhang');
console.log('Minhang'.at(0));
console.log('Minhang'.at(-1));

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

//for of loop --
//parameter order: index, current value
for (const [i, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`Movement ${i + 1}: You deposited ${movement}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
  }
}

//For each loop for arrays
console.log('----FOR EACH-----');
//for each loop cannot use break and continue
//parameter order: current value, index, entire array
movements.forEach(function (mov, i, arr) {
  if (mov > 0) {
    console.log(`Movement ${i + 1}: You deposited ${mov}`);
  } else {
    console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
  }
});
// 0: function(200)
// 1: function(450)
// 2: function(400)
// ...

//FOR EACH LOOP FOR MAPS
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key}: ${value}`);
});

//FOR EACH LOOP FOR SET
const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
console.log(currenciesUnique);
//set does not have keys, so key its not a useful parameter, use _ (throw away variable) to represent it.
currenciesUnique.forEach(function (value, _, map) {
  console.log(`${value}: ${value}`);
});
console.log('------------CODING CHALLENGE--------------');

const checkDogs = function (dogsJulia, DogsKate) {
  //create a shallow copy of Julia's array
  const dogsJuliaCpy = dogsJulia.slice();
  //remove the cat age
  //another way is to use slice
  // dogsJulia.slice(1,3); //returns [5,2]
  dogsJuliaCpy.splice(0, 1);
  dogsJuliaCpy.splice(-2, 2);

  //concat dogsJuliaCpy & DogsKate
  //we can use concat or spread
  const dogs = dogsJuliaCpy.concat(DogsKate);
  // const dogsAlt = [...dogsJuliaCpy, ...DogsKate];
  dogs.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
    } else if (dog < 3) {
      console.log(`Dog number ${i + 1} is still a puppy🐶`);
    }
  });
};

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);
//[16,6,10,5,6,1,4]

//test
// const test = [3, 5, 2, 12, 7];
// const copy = test.slice();
// copy.splice(0, 1);
// copy.splice(-2, 2);

// console.log(copy);
/////////////////////////
//DATA TRANSFORMATION:
// THE MAP METHOD : returns a new array, will not mutate the original array
console.log('--------MAP----------------');
const eurToUsd = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

//use arrow function to simply the above
const movementsUSD = movements.map(mov => mov * eurToUsd);

console.log(movements);
console.log(movementsUSD);
//achieve the same result with forOf loop, but in modern JS, we use functional programming
const movementsUSDfor = [];
for (const mov of movements) {
  movementsUSDfor.push(mov * eurToUsd);
}

console.log(movementsUSDfor);

//the map method to loop over movements accessing the index as well, (returns a new array, therefore we use return and store it in a variable)
const movementsDesc = movements.map(
  (mov, i) =>
    `Movement ${i + 1}: You ${mov > 0 ? 'depostited' : 'withdrew'} ${Math.abs(
      mov
    )}`

  // if (mov > 0) {
  //   return `Movement ${i + 1}: You deposited ${mov}`;
  // } else {
  //   return `Movement ${i + 1}: You withdrew ${Math.abs(mov)}`;
  // }
);
console.log(movementsDesc);

///
//DATA TRANSFORMATION -----Filter
//only takes the positive values
const deposits1 = movements.filter(function (mov) {
  return mov > 0;
});
console.log(deposits1);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);
//only take the negative values
const withdrawals1 = movements.filter(mov => mov < 0);
console.log(movements);
console.log(withdrawals1);

//DATA TRANSFORMATION ---------REDUCE
//boil down to one number, Call-bakck function: order of the parameter: accumulator, currentValue, index, array;
//reduce parameter order: callback function, the number we want to start adding up with;
//accumlator => SNOWBALL
// const balance = movements.reduce(function(acc, cur, i, arr){
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
//arrow function for the above
const balance = movements.reduce((acc, cur) => acc + cur, 0);
console.log(balance);
let accm = 0;
for (const mov of movements) accm += mov;
console.log(accm);

//coding challenge 2
// let humanAge = 0;
console.log('----CODING CHALLENGE-------');
// const calcAverageHumanAge = function (ages) {
//   // const humanAge = ages.map(function (age) {
//   //   if (age <= 2) {
//   //     return 2 * age;
//   //   } else if (age > 2) {
//   //     return 16 + age * 4;
//   //   }
//   // });

//   // console.log(humanAge);
//   const humanAge = ages.map(age => age <= 2? 2* age: 16+age*4);
//   console.log('----huamnage----');
//   console.log(humanAge);

//   const adultDogs = humanAge.filter(age => age > 18);
//   console.log(adultDogs);

//   // const averageDogAge =
//   //   adultDogs.reduce((acc, age) => acc + age, 0) / adultDogs.length;
//   // return averageDogAge;
//   //solution 2 invoving the arr parameter
//   const averageDogAge = adultDogs.reduce(
//     (acc, age, i, arr) => acc + age / arr.length,
//     0
//   );
//   return averageDogAge;
//   // console.log(arr.length);
//   // console.log(averageDogAge/adultDogs.length);
// };

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

//CODING CHALLENGE
const calcAverageHumanAge = function (ages) {
  const humanAge = ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age > 18)
    .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
  console.log(humanAge);
};

const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// const calcAverageHumanAge = ages =>
//   ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4)).filter(age => age >= 18).reduce((acc, age, i, arr) => acc+age/arr.length, 0);

// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);

// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// Chaining Methods
// const eurToUsd1 = 1.1;
// console.log(movements);

// // PIPELINE
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     // console.log(arr);
//     return mov * eurToUsd;
//   })
//   // .map(mov => mov * eurToUsd1)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

//The FIND Method, Loop over the array and find

const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

//FIND Methods with array objects
console.log(accounts);
//FIND the array object using the property
const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

//USING THE FOR OF LOOP
for (const acc of accounts) {
  if (acc.owner === 'Jessica Davis') {
    console.log(acc);
  }
}

//includes method
console.log(movements);
console.log(movements.includes(-130)); //this checks for equality

//condition check using some method
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

// EVERY METHOD, only returns true when all matched the condition
console.log(movements.every(mov => mov > 0));
console.log(account4.movements.every(mov => mov > 0));

//separate callback, the DRY principle - DONT REPEAT YOURSELF
const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));
// console.log(movements.some(deposit));

//---FLAT METHOD-----FLATTEN THE NESTED ARRAYS
const arr1 = [[1, 2, 3], [4, 5, 6], 7, 8];
console.log(arr1.flat());

const arr2 = [[[1, 2], 3], [4, [5, 6]], 7, 8];
//second level of nesting with a parameter
console.log(arr2.flat(2));

// const accountmovements = accounts.map(acc => acc.movements);
// console.log(accountmovements);
// //flatten the movements
// const allMovemments = accountmovements.flat();
// console.log(allMovemments);

// //adding all the movements togethter
// const overallBalance = allMovemments.reduce((acc, mov) => acc+mov, 0);
// console.log(overallBalance);

//using the chaining to achieve the above steps
const overallBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance);

//---FLAT MAP-------map and flat the array, only one level of nested array
const overallBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
console.log(overallBalance2);

//-------------SORTING ARRAYS
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
//SORT ---- MUTATES THE ARRAY
console.log(owners.sort());
console.log(owners);

// Numbers
console.log(movements);
console.log(movements.sort);

//sort ascending order
//return < 0, a will before b (keep order)
//return > 0, b will before a (switch order)
// movements.sort((a, b) => {
//   if(a > b)
//   return 1;
//   if(b>a)
//   return -1;
// });
// console.log(movements);

//if a = b, and it returns 0, then the position would
//just remain unchange
movements.sort((a, b) => a - b);
console.log(movements);

//descending order
// movements.sort((a, b) => {
//   if(a > b)
//   return -1;
//   if(b>a)
//   return 1;
// });
// console.log(movements);
movements.sort((a, b) => b - a);
console.log(movements);

// 164. MORE WAYS OF CREATING AND FILLING ARRAYS
//manually creating arrays
console.log([1, 2, 3, 4, 5, 6]);
console.log(new Array(1, 2, 3, 4, 5, 6));

// EMPTY ARRAYS ( AUTO GENERATE )
const x = new Array(7);
console.log(x);
// FILL Method, mutates the array
x.fill(1, 3, 5);
console.log(x);

//RECREATE [1,2,3,4,5,6,7] AUTOMATICALLY
//Array.from
// const y = Array.from({length:7},() => 1);
// console.log(y);

// const z = Array.from({length: 7}, (_, i) => i+1);
// console.log(z);

const y = Array.from({ length: 7 }, () => 1);
console.log(y);

const z = Array.from({ length: 7 }, (_, i) => i + 1);

//extract the movement numbers from movements UI
labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
});

// console.log(movementsUI);

// //Function to generate a random integer between min and max (inclusive)

// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// //generate an array of 100 random dice roll numbers
// const numberOfRolls = 100;
// const randomDiceRolls = Array.from({length: numberOfRolls}, () => getRandomInt(1, 6));

// console.log(randomDiceRolls);

//-----------Array Methods Practice---------------
//1. adding up all deposits of all accounts
const bankDepositSum = accounts
  .map(acc => acc.movements)
  .flat()
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);

console.log(bankDepositSum);

//using FLATMAP() + reduce()
const bankDepositSum2 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum2);

//2. count deposits that are at least $1000
const deposit$1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;
console.log(deposit$1000);

// question 2 another solution using reduce to do the count
const deposit1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);
console.log(deposit1000);

//--FOR question 2 Prefixed ++ operator
let a = 10;
console.log(++a);
console.log(a);

// question 3 ADVANCE USE CASE OF REDUCE
//create an object that contains the sum
//of deposits and withdrawals (using REDUCE)
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      //using the brackets notation instead of the dot notation
      sums[cur > 0 ? 'deposits' : 'withdrawals'] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// question 4
//create a function that converts strings to a title case.

const convertTitleCase = function (title) {
  //first create an array of exceptions
  const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

  //create a function to capitalize words
  const capitalize = function (str) {
    return str[0].toUpperCase() + str.slice(1);
  };

  //1. first we need to make every word lowercase.
  //and when we need to work on each word we need an array
  //capitalize the first letter of each word
  //except the exception words
  //whenever we need a new array of the same size as before we use MAP
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');

  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG nice title but not too long'));
console.log(convertTitleCase('and this is another title with an EXAMPLE'));
