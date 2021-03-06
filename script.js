const calculatorDisplay = document.getElementById("calcDisplay");
const equationDisplay = document.getElementById("eqDisplay");

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

function showEquation() {
  equationDisplay.textContent = `${values[0]} ${
    operatorValue === "*" ? "×" : operatorValue
  }${values[1] ? " " + values[1] : ""}`;
}

///
function calculate() {
  showEquation();
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
  if (resultIsShowed) {
    equationDisplay.textContent = "\u00A0";
    clearResult();
  }
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
function newOperation(operator) {
  //clear '=' sign
  updateOperator("", true);
  values = [];
  resultIsShowed = false;
  if (operator === ".") {
    operatorValue = "";
    awaitingNextValue = false;
    addDecimal();
    return;
  }
  values.push(Number(calculatorDisplay.textContent));
  updateOperator(operator);
  operatorValue = operator;
  showEquation();
  awaitingNextValue = true;
}

function addDecimal() {
  if (resultIsShowed) {
    newOperation(".");
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
}

function updateOperator(char, slice = false) {
  if (slice)
    calculatorDisplay.textContent = calculatorDisplay.textContent.slice(0, -1);
  if (char === "*") calculatorDisplay.textContent += "×";
  else calculatorDisplay.textContent += char;
}

function useOperator(operator) {
  if (resultIsShowed) {
    newOperation(operator);
    return;
  }
  if (awaitingNextValue) {
    updateOperator(operator, true);
    operatorValue = operator;
    showEquation();
    return;
  }
  if (calculatorDisplay.textContent.slice(-1) === ".") updateOperator("", true);
  values.push(Number(calculatorDisplay.textContent));

  //check if maxint exceeded
  if (!(String(values[values.length - 1]) === calculatorDisplay.textContent)) {
    equationDisplay.textContent = "err";
    resetAll();
    return;
  }
  if (values.length === 2) {
    calculate();
    return;
  }
  updateOperator(operator);
  awaitingNextValue = true;
  operatorValue = operator;

  showEquation();
  calculatorDisplay.scrollTo(calculatorDisplay.scrollWidth, 0);
}
//reset dispay

function resetAll() {
  calculatorDisplay.textContent = "0";
  values = [];
  operatorValue = "";
  awaitingNextValue = false;
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

clearBtn.addEventListener("click", () => {
  equationDisplay.textContent = "\u00A0";
  resetAll();
});
