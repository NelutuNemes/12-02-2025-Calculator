//debug tool
let debug = true;
let log = (message) => {
    if (debug) {
        console.log(message);
    }
}
log(`Debug is active !`);

//get reference to the DOM elements
let display = document.getElementById("display");
let buttons = document.querySelectorAll(".btn");

(()=> {
    display.classList.add("smallFont")
    display.textContent = "... initalizing device"
    setTimeout(() => {
        display.classList.remove("smallFont")
        display.textContent = "0"
    },1000)
})();

log(`Find:${buttons.length} buttons.`);
log(`All buttons:${Array.from(buttons).map((button)=>button.getAttribute("data-value"))}`)

//global variable
let firstOperand = null;
let secondOperand = null;
let operator = null;
let currentInput = "";


//object for mapping operator to their mathematical function
let operations = {
    "+": (a, b) => a + b,
    "-":(a,b)=> a - b,
    "*":(a,b)=> a * b,
    "/":(a,b)=>(b!== 0) ? a / b : "Error"
}

//function to set first and second operand
function setOperand() {
    if (firstOperand === null && currentInput === "") return;//prevent set an empty operand
    if (firstOperand === null) {
        firstOperand = parseFloat(currentInput);
        log(`First operand is: ${firstOperand}`);
    } else if (operator !== null && currentInput !== "") {
        secondOperand = parseFloat(currentInput);
        log(`Second operand is: ${secondOperand}`);
    }
    currentInput = "";
    updateUi();
}

//function to set operator
function setOperator(value) {
    if (firstOperand === null && currentInput === "") return;
    if (currentInput) setOperand();

    if (firstOperand !== null && currentInput !== null && secondOperand !== null) {
        calculate()
    }
    operator = value;
    log(`Operator set: ${operator}`);
    updateUi();
}

//function to update UI
function updateUi() {
    display.textContent =
        (firstOperand !== null ? firstOperand.toString() : "") +
        (operator !== null ? operator : "") +
        (currentInput || (secondOperand !== null ? secondOperand.toString():""))
}

//main function for calculation
function calculate(){
    if (firstOperand !== null && operator !== null && secondOperand !== null)  {
        let result = operations[operator](firstOperand, secondOperand);
        firstOperand = result;
        secondOperand = null;
        currentInput = "";
        operator = null;
        log(`Result : ${firstOperand}`);
        updateUi();
}
}
//aditional function
function resetCalculator() {
    firstOperand = null;
    secondOperand = null;
    operator = null;
    currentInput = "";
    display.textContent = "0";
    log(`Reset calculator !`);
}

function deleteLastChar() {
    if (currentInput !== "") {
        //if there is a current input, delete last digit
        currentInput = currentInput.slice(0, -1);
        if (currentInput === "") {
            resetCalculator();
            return;
        }
    } else if (firstOperand !== null && operator === null) {
        currentInput = firstOperand.toString();
        firstOperand = null;
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);//remove last digit of displayed result
        } else {
            resetCalculator();
            return;
    }
    }
    updateUi();
}


function handleNumberInput(value) {
    if (value === "." && currentInput.includes(".")) return//prevent double decimals
    currentInput =
        (currentInput === "" && value === ".")
            ? "0."
            : currentInput + value;
    updateUi();
}

// Add a click event listener to each button and handle the user's input
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        let value = button.getAttribute("data-value") ||"";
        log(`Button pressed is: ${value}`)


        switch (true) {
            case !isNaN(value):
            case value === ".":
                handleNumberInput(value);
                break;
            case value in operations:
                setOperator(value);
                break;
            case value === "=":
                setOperand();
                calculate();
                break;
            case value === "C":
                resetCalculator();
                break;
            case value === "DEL":
                deleteLastChar();
                break;
            
            default:
                log(`Unknown button value${value}`);
                break;
        }
    });
})