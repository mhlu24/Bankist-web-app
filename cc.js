const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

//Q1

// const createRecFood = function (dogs) {
//   //loop over the object
//   dogs.forEach(function (dog) {
//     dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
//   });
// };

// createRecFood(dogs);
// console.log(dogs);

dogs.forEach(dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28)));
console.log(dogs);

//Q2
//below is
//curFood > (recommendedFood * 0.9) && current < (recommendedFood*1.10);

const sarahDog = dogs.find(dog => dog.owners.includes('Sarah'));
console.log(sarahDog);

// const sarahDogEat = sarahDog.recommendedFood < sarahDog.curFood ? 'Eats too much' : 'Eats too little';

// console.log(sarahDogEat);

console.log(`Sarah's dog is eating too ${sarahDog.recommendedFood < sarahDog.curFood ? 'much' : 'little'}`);

//Q3
//Create an array containing all owners of dogs who eat too much(ownereattoomuch) and an array with all owners of dogs who eat too little('ownerseattoolittle). 

const ownerEatTooMuch = dogs
.filter(dog => dog.curFood > dog.recommendedFood)
.flatMap(dog => dog.owners);
console.log(ownerEatTooMuch);


const ownerEatTooLittle = dogs
.filter(dog => dog.curFood < dog.recommendedFood)
.flatMap(dog => dog.owners);
console.log(ownerEatTooLittle);
// console.log(dogs);

// Q4 
// Log a string to the console for each array created in 3., like this: "Matilda and 
// Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat 
// too little!"
console.log(`${ownerEatTooMuch.join(' and ' )}'s dogs are eating too much!`);
console.log(`${ownerEatTooLittle.join(' and ' )}'s dogs are eating too little!`);

//Q5 log to the console whether there is any dog eating exactly
//the amount of food that is recommended
const dogEatExAmount = dogs.some(dog => dog.curFood === dog.recommendedFood);
console.log(dogEatExAmount);
//& Q6 log to the console whether there is any dog eating an okay amount of food (just true or false)
//OK amount = curFood > (recommendedFood * 0.9) && current < (recommendedFood*1.10)

const checkEatOk = dog => dog.curFood > dog.recommendedFood && dog.curFood < dog.recommendedFood *1.1;

console.log(dogs.some(checkEatOk));

// Q7 create an array containing   dogs taht are eating an okay amount of food (try to reuse the condition used in 6). 
const dogEatOkAmountList = dogs.filter(checkEatOk);

console.log(dogEatOkAmountList);

// Q8 Create a shallow copy of the 'dogs' array and sort it by 
//recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)
const dogsSorted = dogs.slice().sort((a,b) => a.recommendedFood - b.recommendedFood);
console.log(dogsSorted);

//const dogsSorted = dogs.slice().sort((a, b) => a.recommendedFood - b.recommendedFood);
//console.log(dogsSorted);