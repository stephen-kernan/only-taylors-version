"use strict";

function validateCC(num) {
  let numString = num.toString();
  // Validate the number is the right length
  if (![13, 15, 16].includes(numString.length)) return "INVALID";
  // Validate the number passes the Luhn algorithm
  else if (!validateNum(numString)) return "INVALID";
  else {
    const firstDigit = Number(numString.charAt(0));
    const firstTwoDigits = Number(numString.charAt(0) + numString.charAt(1));
    // Check to see which brand of card it is
    if (firstTwoDigits === 34 || firstTwoDigits === 37) {
      return "AMEX";
    } else if (51 <= firstTwoDigits && firstTwoDigits <= 55) {
      return "MASTERCARD";
    } else if (firstDigit === 4) {
      return "VISA";
    } else return "INVALID";
  }
}

console.log(validateCC(4003600000000014));

// Check to see if the number is a valid CC number
function validateNum(string) {
  const arr = string.split("");
  const operatorArr = [];
  const sumArr = [];

  // Add every other digit to a different array
  for (let i = string.length; i >= 0; i -= 2) {
    if (arr[i]) {
      operatorArr.push(`${arr[i]}`);
      sumArr.push(`${arr[i + 1]}`);
    }
  }

  // Double each value in the operator array
  const doubledArr = getSplitDoubledArr(operatorArr);

  // Get the sum of the split array
  const sum1 = getArraySum(doubledArr);

  // Get the sum of all the unused digits
  const sum2 = getArraySum(sumArr);

  // Get the sum of both sets of digits
  const finalSum = sum1 + sum2;

  console.log(finalSum);

  //Check to see if the final sum ends in a 0; if so, it could be a valid CC number
  if (finalSum % 10 !== 0) return false;
  else return true;
}

// Helper functions, used inside validateNum function
function getSplitDoubledArr(array) {
  return array.reduce(
    (reducer, x) => [...reducer, ...String(x * 2).split("")],
    []
  );
}

function getArraySum(array) {
  return array.reduce((accumulator, value) => {
    return Number(accumulator) + Number(value);
  }, 0);
}
