// Debug tool
let debug = true;
let log = (message) => {
    if (debug) console.log(message);
};
log(`Debug is active!`);

// Get reference to the DOM elements
let extendedDisplay = document.getElementById("extendedDisplay");
let display = document.getElementById("display");
let buttons = document.querySelectorAll(".btn");
let toggleSoundBtn = document.getElementById("toggle-sound-btn");
let title = document.getElementById("title");
let labelBasic = document.getElementById("label-basic");
let labelExtraOps = document.getElementById("label-extra-ops");
let vatHandler = document.getElementById("vat-handler");
let percentBtnPlus = document.getElementById("percent-btn-plus");
let percentBtnMinus = document.getElementById("percent-btn-minus");



let amount = document.getElementById("amount");
let vat = document.getElementById("vat");
let vatValue = document.getElementById("vat-value");
let amountPlusVat = document.getElementById("amountPlusVat");

//let soundEnable = true;

// Initialize display
(() => {
    display.classList.add("smallFont");
    display.textContent = "... initializing device";

    setTimeout(() => {
        display.classList.remove("smallFont");
        display.textContent = "0";
    }, 1000);
})();

extendedDisplay.classList.add("hidden");

log(`Find: ${buttons.length} buttons.`);
log(`All buttons: ${Array.from(buttons).map((button) => button.getAttribute("data-value"))}`);

// Toggle extra operations visibility
document.getElementById("basic").addEventListener("change", () => {
    document.querySelector(".extra-operations").classList.remove("show-extras");
    document.querySelector(".percent").classList.remove("show-extras");
    document.querySelector(".extendedDisplay").classList.remove("visible");

});

document.getElementById("show-extra-ops").addEventListener("change", () => {
    document.querySelector(".extra-operations").classList.add("show-extras");
    document.querySelector(".percent").classList.remove("show-extras");
    document.querySelector(".extendedDisplay").classList.remove("visible");

});

document.getElementById("vat-handler").addEventListener("change", () => {
    document.querySelector(".extra-operations").classList.remove("show-extras");
    document.querySelector(".percent").classList.add("show-extras");
    if (!extendedDisplay.classList.contains("visible")) {
        extendedDisplay.style.display = "flex";
        setTimeout(() => extendedDisplay.classList.add("visible"), 10); 
    } else {
        extendedDisplay.classList.remove("visible");
        setTimeout(() => extendedDisplay.style.display = "none", 600);
    }
});

// Global variables
let firstOperand = null;
let secondOperand = null;
let operator = null;
let currentInput = "";
let detailedResult = "";
let tempFirstOperand = "";
let calculatedVatValue = "";
let calculatedVatValue2 = "";


// Object for mathematical operations
let operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => (b !== 0 ? a / b : "Error"),
    "^^": (a) => a ** 2,
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
        (firstOperand !== null ? firstOperand.toFixed(2).toString() : "") +
        (operator !== null ? operator : "") +
        (currentInput || (secondOperand !== null ? secondOperand.toFixed(2).toString() : ""));
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
    amount.textContent = `- Amount : ${"0.00"}`;
    vat.textContent = `- VAT  : ${"0"} %`;
    vatValue.textContent = `- VAT value : ${"0.00"}`;
    amountPlusVat.textContent = `- Final result : ${"0.00"}`;


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
//function for detailed result for VAT helper
function updateDetailedResults() {
    amount.textContent = `- ${i18next.t("amount")} : ${tempFirstOperand}`;
    vat.textContent = `- ${i18next.t("ivaPercent")} : ${secondOperand} %`;
    vatValue.textContent = `- ${i18next.t("ivaValue")} : ${calculatedVatValue}`;
    amountPlusVat.textContent = `- ${i18next.t("finalResult")} : ${firstOperand.toFixed(2)}`;
}

function updateDetailedResults2() {
    amount.textContent = `- ${i18next.t("amount")} : ${tempFirstOperand}`;
    vat.textContent = `- ${i18next.t("ivaPercent")} : ${secondOperand} %`;
    vatValue.textContent = `- ${i18next.t("ivaValue")} : ${calculatedVatValue2}`;
    amountPlusVat.textContent = `- ${i18next.t("finalResult")} : ${firstOperand.toFixed(2)}`;
}



// Function to handle +PRC operation
function handlePlusPRC() {
    if (firstOperand !== null && currentInput !== "") {
        log(`First operand: ${firstOperand}`);

        tempFirstOperand = firstOperand.toFixed(2);

        secondOperand = parseFloat(currentInput);
        log(`Second operand: ${secondOperand}`);

        let currentPercent = secondOperand / 100;
        firstOperand += (currentPercent) * firstOperand;
        

        log(`Current percent value: ${currentPercent} value`);

        log(`Result after aplied "+PRC": ${firstOperand}`);

        log(detailedResult);

        calculatedVatValue = (firstOperand - tempFirstOperand).toFixed(2);
        log(`Calculated Iva Value is : ${calculatedVatValue}`)
        
        updateDetailedResults();
        secondOperand = null;
        operator = null;
        currentInput = "";
        updateUi();
    }
}

// Function to handle -PRC operation
function handleMinusPRC() {
    if (firstOperand !== null && currentInput !== "") {
        tempFirstOperand = firstOperand.toFixed(2);

        secondOperand = parseFloat(currentInput);
        let percentValue = (secondOperand / 100) * firstOperand; // Calculation of percent value
        log(`First operand before -PRC: ${firstOperand}`);
        log(`Second operand (percent): ${percentValue}`);
        firstOperand = firstOperand / (1 + secondOperand / 100); // Calculation formula
        log(`First operand after -PRC: ${firstOperand}`);

        calculatedVatValue2 = (tempFirstOperand-firstOperand).toFixed(2);

        updateDetailedResults2();
        secondOperand = null;
        operator = null;
        currentInput = "";
        updateUi();
    }
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
                if (value === "SQUARE2" || value === "SQUARE3" ||value ==="^^") {
                    applySingleOperandOperation(value);
                } else  {
                    setOperator(value);
                }
                break;
            case value === "+PRC":
                handlePlusPRC();
                break;
            case value === "-PRC":
                handleMinusPRC();
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

// toggle lang function
i18next.init({
    lng: "ro", // Default language

    resources: {
        ro: {
            translation: {
                appTitle: "myMiniCalculator",
                basic: "Simplu",
                advanced: "Avansat",
                ivaButton: "ajutor-TVA ",
                amount: "Suma",
                ivaPercent: "TVA",
                ivaValue: "Valoare TVA",
                finalResult: "Suma Finala(cu TVA)",
                percentBtnPlus: "+ T.V.A",
                percentBtnMinus: "- T.V.A"

            }
        },
        en: {
            translation: {
                appTitle: "myMiniCalculator",
                basic: "Basic",
                advanced: "Advanced Ops",
                ivaButton: "VAT Helpper ",
                amount: "Amount",
                ivaPercent: "VAT",
                ivaValue: "VAT Value",
                finalResult: "New amount(with VAT)",
                percentBtnPlus: "+ V.A.T",
                percentBtnMinus: "- V.A.T"                
            }
        }
    }
});

function changeLanguage(lang) {
    i18next.changeLanguage(lang, () => {
        document.getElementById("title").textContent = i18next.t("appTitle");
        document.getElementById("label-basic").textContent = i18next.t("basic");
        document.getElementById("label-extra-ops").textContent = i18next.t("advanced");
        document.getElementById("vat-handler").textContent = i18next.t("ivaButton");

        // Retrieve values directly from the interface, if they exist
        let currentAmount = document.getElementById("amount").textContent.split(":")[1]?.trim() || "0.00";
        let currentVat = document.getElementById("vat").textContent.split(":")[1]?.trim() || "0";
        let currentVatValue = document.getElementById("vat-value").textContent.split(":")[1]?.trim() || "0.00";
        let currentTotal = document.getElementById("amountPlusVat").textContent.split(":")[1]?.trim() || "0.00";

        // Update the interface without losing calculated values
        document.getElementById("amount").textContent = `- ${i18next.t("amount")} : ${currentAmount}`;
        document.getElementById("vat").textContent = `- ${i18next.t("ivaPercent")} : ${currentVat}`;
        document.getElementById("vat-value").textContent = `- ${i18next.t("ivaValue")} : ${currentVatValue}`;
        document.getElementById("amountPlusVat").textContent = `- ${i18next.t("finalResult")} : ${currentTotal}`;

        percentBtnPlus.textContent = `${i18next.t("percentBtnPlus")}`;
        percentBtnMinus.textContent = `${i18next.t("percentBtnMinus")}`;
    });
}

document.getElementById("lang-ro").addEventListener("click", () => changeLanguage("ro"));
document.getElementById("lang-en").addEventListener("click", () => changeLanguage("en"));

changeLanguage("ro"); // Setarea implicită




//function toggle sound on / sound off
/* toggleSoundBtn.addEventListener("click", () => {
    soundEnable = !soundEnable; //switch variable value
    toggleSoundBtn.textContent = soundEnable ? "🔊" : "🔇";
})
//function to apply button sound
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        if (soundEnable) {
        new Audio("sounds/minimal-pop-click-ui-1-198301.mp3").play();
        }
    })
}); */

