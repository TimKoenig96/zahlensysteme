const HANDS_WIDTH = 451;
const HANDS_HEIGHT = 485;

let numberInput;
let rangeInput;

let inputValue = 0;

let spritesheetImg, fingersRetractedSpritesheet, fingersExtendedSpritesheet;
let canvasCtx;

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
	if (inputValue < 1024) leftHandIndex = parseInt(binary.slice(2, 7).split("").reverse().join(""), 2);

	// One extra finger required: Left hand indexes 1 to 6
	else if (inputValue < 2048) leftHandIndex = parseInt(binary.slice(1, 6).split("").reverse().join(""), 2);

	// Both extra fingers required: Left hand indexes 0 to 5
	else leftHandIndex = parseInt(binary.slice(0, 5).split("").reverse().join(""), 2);

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

function updateHandsCanvas(leftHandIndex, leftFingerStatus, rightFingerStatus, rightHandIndex) {

	// Save current canvas state
	canvasCtx.save();

	// Scale canvas
	canvasCtx.scale(-1, 1);

	// Draw left hand
	canvasCtx.drawImage(
		spritesheetImg,                 // Source image
		leftHandIndex * HANDS_WIDTH, 0, // Source X/Y
		HANDS_WIDTH, HANDS_HEIGHT,      // Source width/height
		-HANDS_WIDTH, 0,                // Destination X/Y
		HANDS_WIDTH, HANDS_HEIGHT       // Destination width/height
	);

	// Draw left finger if required
	if (leftFingerStatus !== -1) {
		canvasCtx.drawImage(
			leftFingerStatus === 0 ? fingersRetractedSpritesheet : fingersExtendedSpritesheet,
			leftHandIndex * HANDS_WIDTH, 0, // Source X/Y
			HANDS_WIDTH, HANDS_HEIGHT,      // Source width/height
			-HANDS_WIDTH, 0,                // Destination X/Y
			HANDS_WIDTH, HANDS_HEIGHT       // Destination width/height
		);
	}

	// Restore canvas state before scaling
	canvasCtx.restore();

	// Draw right hand
	canvasCtx.drawImage(
		spritesheetImg,                  // Source image
		rightHandIndex * HANDS_WIDTH, 0, // Source X/Y
		HANDS_WIDTH, HANDS_HEIGHT,       // Source width/height
		HANDS_WIDTH, 0,                  // Destination X/Y
		HANDS_WIDTH, HANDS_HEIGHT        // Destination width/height
	);

	// Draw right finger if required
	if (rightFingerStatus !== -1) {
		canvasCtx.drawImage(
			rightFingerStatus === 0 ? fingersRetractedSpritesheet : fingersExtendedSpritesheet,
			rightHandIndex * HANDS_WIDTH, 0, // Source X/Y
			HANDS_WIDTH, HANDS_HEIGHT,       // Source width/height
			HANDS_WIDTH, 0,                  // Destination X/Y
			HANDS_WIDTH, HANDS_HEIGHT        // Destination width/height
		);
	}
}

function prepareHandsCanvasUpdate() {

	// Convert input to binary
	const binary = inputValue.toString(2).padStart(12, "0");

	// Get image indexes for hands
	const { leftHandIndex, rightHandIndex } = getHandsSpritesheetIndexes(binary);

	// Get optional finger on/off/hidden status
	const { leftFingerStatus, rightFingerStatus } = getOptionalFingersStatuses(binary);

	// Run the update
	updateHandsCanvas(leftHandIndex, leftFingerStatus, rightFingerStatus, rightHandIndex);
}

function decInputHandler(event) {

	// Get value
	inputValue = parseInt(event.target.value);

	// Set the other input to the same value
	if (event.target.type === "number") rangeInput.value = inputValue;
	else numberInput.value = inputValue;

	// Run update
	prepareHandsCanvasUpdate();
}

function requestRequiredImages() {

	// Spritesheet
	const spritesheetPromise = new Promise((resolve, reject) => {
		spritesheetImg = new Image(14432, 485);

		spritesheetImg.onload = resolve;
		spritesheetImg.onerror = reject;

		spritesheetImg.src = "media/spritesheet.webp";
	});

	// Retracted fingers
	const retractedFingersPromise = new Promise((resolve, reject) => {
		fingersRetractedSpritesheet = new Image(14432, 485);

		fingersRetractedSpritesheet.onload = resolve;
		fingersRetractedSpritesheet.onerror = reject;

		fingersRetractedSpritesheet.src = "media/spritesheet_retracted.webp";
	});

	// Extended fingers
	const extendedFingersPromise = new Promise((resolve, reject) => {
		fingersExtendedSpritesheet = new Image(14432, 485);

		fingersExtendedSpritesheet.onload = resolve;
		fingersExtendedSpritesheet.onerror = reject;

		fingersExtendedSpritesheet.src = "media/spritesheet_extended.webp";
	});

	return Promise.all([spritesheetPromise, retractedFingersPromise, extendedFingersPromise]);
}

export function setupIllustration() {

	// Get canvas context
	canvasCtx = document.getElementById("hands_canvas").getContext("2d");

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
		prepareHandsCanvasUpdate();
	}).catch((error) => {
		console.error(error);
		// TODO: Inform user
	});
}
