let numberInput;
let rangeInput;

function decInputHandler(event) {

	// Get value
	let value = event.target.value;

	// Set the other input to the same value
	if (event.target.type === "number") rangeInput.value = value;
	else numberInput.value = value;
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
