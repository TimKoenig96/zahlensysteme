let numberInput;
let rangeInput;

let inputValue = 0;
let timeout;

let spritesheetImg, fingerRetractedImg, fingerExtendedImg;

/**
 * Get hand indexes on spritesheet.
 * @param {String} binary Input as binary string
 * @returns {Object} Left and right hand indexes
 */
function getHandsSpritesheetIndexes(binary) {
	let leftHandIndex;

	// Right hand is always the last 5 characters
	let rightHandIndex = parseInt(binary.slice(-5), 2);

	// No extra fingers required: Left hand indexes 2 to 7
	if (inputValue < 1024) leftHandIndex = parseInt(binary.slice(2, 7));

	// One extra finger required: Left hand indexes 1 to 6
	else if (inputValue < 2048) leftHandIndex = parseInt(binary.slice(1, 6));

	// Both extra fingers required: Left hand indexes 0 to 5
	else leftHandIndex = parseInt(binary.slice(0, 5));

	return { leftHandIndex, rightHandIndex };
}

/**
 * Get optional fingers statuses. -1 for hidden, 0 for retracted, 1 for extended.
 * @param {String} binary Input as binary string
 * @returns {Object} Left and right finger statuses
 */
function getOptionalFingersStatuses(binary) {

	// Hidden by default
	let leftFingerStatus = -1;
	let rightFingerStatus = -1;

	// Two extra fingers required
	if (inputValue >= 2048) {
		leftFingerStatus = parseInt(binary[5], 2);
		rightFingerStatus = parseInt(binary[6], 2);
	}

	// One extra finger required
	else if (inputValue >= 1024) rightFingerStatus = parseInt(binary[6], 2);

	return { leftFingerStatus, rightFingerStatus };
}

function updateHandsCanvas() {

	// Convert input to binary
	const binary = inputValue.toString(2).padStart(12, "0");

	// Get image indexes for hands
	const { leftHandIndex, rightHandIndex } = getHandsSpritesheetIndexes(binary);

	// Get optional finger on/off/hidden status
	const { leftFingerStatus, rightFingerStatus } = getOptionalFingersStatuses(binary);
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

function requestRequiredImages() {

	// Spritesheet
	const spritesheetPromise = new Promise((resolve, reject) => {
		spritesheetImg = new Image(14432, 485);

		spritesheetImg.onload = resolve;
		spritesheetImg.onerror = reject;

		spritesheetImg.src = "media/spritesheet.jpg";
	});

	// Retracted finger
	const retractedFingerPromise = new Promise((resolve, reject) => {
		fingerRetractedImg = new Image(451, 485);

		fingerRetractedImg.onload = resolve;
		fingerRetractedImg.onerror = reject;

		fingerRetractedImg.src = "media/0.png";
	});

	// Extended finger
	const extendedFingerPromise = new Promise((resolve, reject) => {
		fingerExtendedImg = new Image(451, 485);

		fingerExtendedImg.onload = resolve;
		fingerExtendedImg.onerror = reject;

		fingerExtendedImg.src = "media/1.png";
	});

	return Promise.all([spritesheetPromise, retractedFingerPromise, extendedFingerPromise]);
}

export function setupIllustration() {

	// Request all images before setup
	requestRequiredImages().then(() => {

		// Get inputs
		numberInput = document.getElementById("dec_number_input");
		rangeInput = document.getElementById("dec_range_input");

		// Set both inputs to 0
		numberInput.value = 0;
		rangeInput.value = 0;

		// Add event listeners
		numberInput.addEventListener("input", decInputHandler);
		rangeInput.addEventListener("input", decInputHandler);

		// Set canvas hands for first time
		updateHandsCanvas();
	}).catch((error) => {
		console.error(error);
		// TODO: Inform user
	});
}
