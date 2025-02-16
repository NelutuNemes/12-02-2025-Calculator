// Debug tool
let debug = true;
let log = (message) => {
    if (debug) console.log(message);
};
log(`Debug is active!`);

// Get reference to the DOM elements
let display = document.getElementById("display");
let buttons = document.querySelectorAll(".btn");

// Initialize display
(() => {
    display.classList.add("smallFont");
    display.textContent = "... initializing device";
    setTimeout(() => {
        display.classList.remove("smallFont");
        display.textContent = "0";
    }, 1000);
})();

log(`Find: ${buttons.length} buttons.`);
log(`All buttons: ${Array.from(buttons).map((button) => button.getAttribute("data-value"))}`);

// Toggle extra operations visibility
document.getElementById("basic").addEventListener("change", () => {
    document.querySelector(".extra-operations").classList.remove("show-extras");
    document.querySelector(".percent").classList.remove("show-extras");
});

document.getElementById("show-extra-ops").addEventListener("change", () => {
    document.querySelector(".extra-operations").classList.add("show-extras");
    document.querySelector(".percent").classList.add("show-extras");
});

// Global variables
let firstOperand = null;
let secondOperand = null;
let operator = null;
let currentInput = "";

// Object for mathematical operations
let operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => (b !== 0 ? a / b : "Error"),
    "+PRC": (a, b) => a + (b * a / 100), 
    "-PRC": (a, b) => a - (b * a / 100),
    "^": (a, b) => Math.pow(a, b),
    "SQUARE2": (a) => Math.sqrt(a),
    "SQUARE3": (a) => Math.cbrt(a),
};

// Function to set first and second operand
function setOperand() {
    if (firstOperand === null && currentInput === "") return;
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

// Function to set operator
function setOperator(value) {
    if (firstOperand === null && currentInput === "") return;
    if (currentInput) setOperand();

    if (firstOperand !== null && operator !== null && secondOperand !== null) {
        calculate();
    }

    operator = value;
    log(`Operator set: ${operator}`);
    updateUi();
}

// Function to update UI
function updateUi() {
    display.textContent =
        (firstOperand !== null ? firstOperand.toString() : "") +
        (operator !== null ? operator : "") +
        (currentInput || (secondOperand !== null ? secondOperand.toString() : ""));
}

// Main function for calculation
function calculate() {
    if (operator === "SQUARE2" || operator === "SQUARE3") {
        if (firstOperand !== null) {
            firstOperand = operations[operator](firstOperand);
            log(`Result: ${firstOperand}`);
            operator = null;
        }
    } else if (firstOperand !== null && secondOperand !== null) {
        if (operator === "+PRC" || operator === "-PRC") {
            secondOperand = (firstOperand * secondOperand / 100);
        }
        firstOperand = operations[operator](firstOperand, secondOperand);
        log(`Result: ${firstOperand}`);
        operator = null;
    }

    secondOperand = null;
    currentInput = "";
    operator = null;
    updateUi();
}
// Function to apply single operand operations
function applySingleOperandOperation(operation) {
    if (firstOperand === null && currentInput !== "") {
        firstOperand = parseFloat(currentInput);
    }
    if (firstOperand !== null) {
        firstOperand = operations[operation](firstOperand);
        log(`Applied ${operation}: Result = ${firstOperand}`);
        operator = null;
        currentInput = "";
        updateUi();
    }
}

// Reset calculator
function resetCalculator() {
    firstOperand = null;
    secondOperand = null;
    operator = null;
    currentInput = "";
    display.textContent = "0";
    log(`Reset calculator!`);
}

// Delete last character
function deleteLastChar() {
    if (currentInput !== "") {
        currentInput = currentInput.slice(0, -1);
        if (currentInput === "") {
            resetCalculator();
            return;
        }
    } else if (firstOperand !== null && operator === null) {
        currentInput = firstOperand.toString();
        firstOperand = null;
        if (currentInput.length > 1) {
            currentInput = currentInput.slice(0, -1);
        } else {
            resetCalculator();
            return;
        }
    }
    updateUi();
}

// Handle number input
function handleNumberInput(value) {
    if (value === "." && currentInput.includes(".")) return;
    currentInput = (currentInput === "" && value === ".") ? "0." : currentInput + value;
    updateUi();
}

// Add event listeners for buttons
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        let value = button.getAttribute("data-value") || "";
        log(`Button pressed is: ${value}`);

        switch (true) {
            case !isNaN(value):
            case value === ".":
                handleNumberInput(value);
                break;
            case value in operations:
                if (value === "SQUARE2" || value === "SQUARE3") {
                    applySingleOperandOperation(value);
                } else if (value === "+PRC") {
                    if (firstOperand !== null && currentInput !== "") {
                        secondOperand = parseFloat(currentInput);
                        firstOperand += (secondOperand / 100) * firstOperand;
                        log(`First operand after +PRC: ${firstOperand}`);
                        secondOperand = null;
                        operator = null;
                        currentInput = "";
                        updateUi();
                    }
                } else if (value === "-PRC") {
                    if (firstOperand !== null && currentInput !== "") {
                        secondOperand = parseFloat(currentInput);
                        let percentValue = (secondOperand / 100) * firstOperand;
                        log(`First operand before -PRC: ${firstOperand}`);
                        log(`Second operand (percent): ${percentValue}`);
                        firstOperand = firstOperand / (1 + secondOperand / 100);
                        log(`First operand after -PRC: ${firstOperand}`);
                        secondOperand = null;
                        operator = null;
                        currentInput = "";
                        updateUi();
                    }
                } else {
                    setOperator(value);
                }
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
                log(`Unknown button value: ${value}`);
                break;
        }
    });
});
