let numberInput;
let rangeInput;

let inputValue = 0;
let timeout;

function updateHandsCanvas() {

	// Convert input to binary
	const binary = inputValue.toString(2).padStart(12, "0");

	// Extract required binary sections
	let rightHandBinary, leftHandBinary, leftExtra, rightExtra;

	rightHandBinary = binary.slice(-5);

	if (inputValue < 1024) {
		leftHandBinary = binary.slice(2, 7);
	} else if (inputValue < 2048) {
		leftHandBinary = binary.slice(1, 6);
		rightExtra = binary[6];
	} else {
		leftHandBinary = binary.slice(0, 5);
		leftExtra = binary[5];
		rightExtra = binary[6];
	}
}

function decInputHandler(event) {

	// Get value
	inputValue = parseInt(event.target.value);

	// Set the other input to the same value
	if (event.target.type === "number") rangeInput.value = inputValue;
	else numberInput.value = inputValue;

	// Clear timeout
	clearTimeout(timeout);

	// Set timeout
	timeout = setTimeout(updateHandsCanvas, 250);
}

export function setupInputHandlers() {

	// Get inputs
	numberInput = document.getElementById("dec_number_input");
	rangeInput = document.getElementById("dec_range_input");

	// Set both inputs to 0
	numberInput.value = 0;
	rangeInput.value = 0;

	// Add event listeners
	numberInput.addEventListener("input", decInputHandler);
	rangeInput.addEventListener("input", decInputHandler);
}
