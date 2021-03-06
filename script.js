const calculatorDisplay = document.querySelector("h1");
const inputBtns = document.querySelectorAll("button");
const clearBtn = document.getElementById("clear-btn");

let values = [];
let operatorValue = "";
let awaitingNextValue = false;
let resultIsShowed = false;

//

Number.prototype.countDecimals = function () {
  if (Math.floor(this.valueOf()) === this.valueOf()) return 0;
  return this.toString().split(".")[1].length || 0;
};

///
function calculate() {
  let result;
  switch (operatorValue) {
    case "+":
      result = values[0] + values[1];
      break;
    case "-":
      result = values[0] - values[1];
      break;
    case "*":
      result = values[0] * values[1];
      break;
    case "/":
      result = values[0] / values[1];
      break;
  }
  resetAll();
  resultIsShowed = true;
  if (result.countDecimals() > 5) result = result.toFixed(5);
  calculatorDisplay.textContent = result + "=";
}
///

function clearResult() {
  resultIsShowed = false;
  resetAll();
}

function sendNumberValue(number) {
  if (resultIsShowed) clearResult();
  if (awaitingNextValue) {
    calculatorDisplay.textContent = number;
    awaitingNextValue = false;
  } else {
    const displayValue = calculatorDisplay.textContent;
    calculatorDisplay.textContent =
      displayValue === "0" ? number : displayValue + number;
    calculatorDisplay.scrollTo(calculatorDisplay.scrollWidth, 0);
  }
}

function addDecimal() {
  if (resultIsShowed) {
    clearResult();
    return;
  }
  //if operator pressed

  if (awaitingNextValue) {
    calculatorDisplay.textContent = calculatorDisplay.textContent.slice(0, -1);
    operatorValue = "";
    values.pop();
    awaitingNextValue = false;
  }
  //if no decimal add one
  if (!calculatorDisplay.textContent.includes("."))
    calculatorDisplay.textContent = `${calculatorDisplay.textContent}.`;
  calculatorDisplay.scrollTo(calculatorDisplay.scrollWidth, 0);
  console.log(values, operatorValue);
}

function updateOperator(char, slice = false) {
  if (slice)
    calculatorDisplay.textContent = calculatorDisplay.textContent.slice(0, -1);
  if (char === "*") calculatorDisplay.textContent += "×";
  else calculatorDisplay.textContent += char;
}

function useOperator(operator) {
  if (resultIsShowed) {
    clearResult();
    return;
  }
  if (awaitingNextValue) {
    updateOperator(operator, true);
    operatorValue = operator;
    return;
  }
  values.push(Number(calculatorDisplay.textContent));
  if (values.length === 2) {
    calculate();
    return;
  }
  updateOperator(operator);
  awaitingNextValue = true;
  operatorValue = operator;
  // if (!awaitingNextValue) {
  //   firstValue = currentValue;
  //
  // }

  calculatorDisplay.scrollTo(calculatorDisplay.scrollWidth, 0);

  console.log(values, operator);
}

//eventlisteners for numbers,operators, decimal

inputBtns.forEach(btn => {
  if (btn.classList.length === 0)
    btn.addEventListener("click", () => sendNumberValue(btn.value));
  else if (btn.classList.contains("operator"))
    btn.addEventListener("click", () => useOperator(btn.value));
  else if (btn.classList.contains("decimal"))
    btn.addEventListener("click", addDecimal);
});

//reset dispay

function resetAll() {
  calculatorDisplay.textContent = "0";
  values = [];
  operatorValue = "";
  awaitingNextValue = false;
}

clearBtn.addEventListener("click", resetAll);
