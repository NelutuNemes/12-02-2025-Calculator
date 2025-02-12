//debug tool
let debug = true;
let log = (message) => {
    if (debug) {
        console.log(message);
    }
}
log(`Debuging is activ !`);

//get reference to the DOM elements
let display = document.getElementById("display");
let buttons = document.querySelectorAll(".btn");

function startDeviceSimulator() {
    display.classList.add("smallFont")
    display.textContent = "... initalizing device"
    setTimeout(() => {
        display.classList.remove("smallFont")
        display.textContent = "0"
    },1000)
}
startDeviceSimulator();

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
    "/":(a,b)=>(b>0) ? a / b : "Error"
}

//function to set first and second operand

//function to set operator

//function to update UI
function updateUi() {
    display.textContent =
        (firstOperand !== null ? firstOperand.toString() : "") +
        (operator !== null ? operator : "") +
        (currentInput || (secondOperand !== null ? secondOperand.toString():""))
}

//main function for calculation

//aditional function

function handleNumberInput(value) {
    if (value === "." && currentInput.includes(".")) return//prevent double decimals
    currentInput =
        (currentInput === "" && value === ".")
            ? "0."
            : currentInput + value;
    updateUi();
}

//add event listener to buttons
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        let value = button.getAttribute("data-value");
        log(`Button presed is: ${value}`)


        switch (true) {
            case !isNaN(value):
            case value === ".":
                handleNumberInput(value);
                break;
            
            
            
            
            
            
            
            default:
                log(`Unkdown button value${value}`);
                break;
        }
    });
})