// #region | Variables and elements
var sticky_inputs;
var decimal_input_number;
var decimal_input_slider;
var simple_output_table;
var hand_left_e;
var hand_left;
var hand_right_e;
var hand_right;

var old_decimal = 0;
var decimal_inputs_offset;
// #endregion



// #region | Functions
function updateAllExamples(decimal) {

	// Convert to binary and hex
	const binary = decimal.toString(2).padStart(12, "0");
	const hexadecimal = decimal.toString(16).padStart(3, "0");

	// Adjust simple table visible parts
	if (decimal <= 15) {
		simple_output_table.querySelectorAll("[data-table_visibility]").forEach(function(element) {
			element.classList.add("table_hidden");
		});
	} else if (decimal <= 255) {
		simple_output_table.querySelectorAll("[data-table_visibility='2']").forEach(function(element) {
			element.classList.add("table_hidden");
		});
		simple_output_table.querySelectorAll("[data-table_visibility='1']").forEach(function(element) {
			element.classList.remove("table_hidden");
		});
	} else {
		simple_output_table.querySelectorAll("[data-table_visibility]").forEach(function(element) {
			element.classList.remove("table_hidden");
		});
	}

	// Update simple table fields
	for (i = 0; i < 12; i++) simple_output_table.rows[1].cells[i + 1].innerText = binary.charAt(i);
	for (i = 0; i < 3; i++) simple_output_table.rows[2].cells[i + 1].innerText = hexadecimal.charAt(i);

	// Update hand images
	var lhand_e, lhand, rhand_e, rhand = "";
	if (decimal <= 1023) {
		rhand_e = "/zahlensysteme/media/empty.png";
		lhand_e = "/zahlensysteme/media/empty.png";
		rhand = `/zahlensysteme/media/${parseInt(binary.substr(7, 5), 2)}.jpg`;
		lhand = `/zahlensysteme/media/${parseInt(binary.substr(2, 5).split("").reverse().join(""), 2)}.jpg`;
	} else if (decimal <= 2047) {
		var rhand_num = parseInt(binary.substr(7, 5), 2);
		rhand_e = `/zahlensysteme/media/${rhand_num}_${binary.substr(6, 1)}.png`;
		lhand_e = `/zahlensysteme/media/empty.png`;
		rhand = `/zahlensysteme/media/${rhand_num}.jpg`;
		lhand = `/zahlensysteme/media/${parseInt(binary.substr(1, 5).split("").reverse().join(""), 2)}.jpg`;
	} else {
		var rhand_num = parseInt(binary.substr(7, 5), 2);
		var lhand_num = parseInt(binary.substr(0, 5).split("").reverse().join(""), 2);
		rhand_e = `/zahlensysteme/media/${rhand_num}_${binary.substr(6, 1)}.png`;
		lhand_e = `/zahlensysteme/media/${lhand_num}_${binary.substr(5, 1)}.png`;
		rhand = `/zahlensysteme/media/${rhand_num}.jpg`;
		lhand = `/zahlensysteme/media/${lhand_num}.jpg`;
	}

	if (hand_left_e.src !== lhand_e) hand_left_e.src = lhand_e;
	if (hand_left.src !== lhand) hand_left.src = lhand;
	if (hand_right_e.src !== rhand_e) hand_right_e.src = rhand_e;
	if (hand_right.src !== rhand) hand_right.src = rhand;
}

function updateDecimalInputs() {
	// TODO: Think about using regex due to Firefox allowing letters
	var new_dec_value = Math.min(Math.max(Number(this.value), 0), 4095);
	if (this.id === "decimal_input_slider") {
		document.getElementById("decimal_input_number").value = new_dec_value;
	} else {
		document.getElementById("decimal_input_slider").value = new_dec_value;
	}

	updateAllExamples(new_dec_value);
}

function toggleSimpleView() {
	document.querySelectorAll(".simple_view").forEach(function(element) {
		element.classList.toggle("show_simple");
	});
	document.querySelectorAll(".complicated_view").forEach(function(element) {
		element.classList.toggle("show_simple");
	});
}
// #endregion



// #region | On content loaded
document.addEventListener("DOMContentLoaded", function() {
	decimal_input_slider = this.getElementById("decimal_input_slider");
	decimal_input_number = this.getElementById("decimal_input_number");
	simple_output_table = this.getElementById("simple_output_table");
	sticky_inputs = this.getElementById("sticky_inputs");

	hand_left_e = this.getElementById("output_hand_left_e");
	hand_left = this.getElementById("output_hand_left");
	hand_right_e = this.getElementById("output_hand_right_e");
	hand_right = this.getElementById("output_hand_right");

	decimal_input_slider.addEventListener("input", updateDecimalInputs);
	decimal_input_number.addEventListener("input", updateDecimalInputs);
	this.getElementById("simple_view").addEventListener("change", toggleSimpleView);

	// Make inputs stick once scrolled past
	decimal_inputs_offset = sticky_inputs.offsetTop;
	window.addEventListener("scroll", function() {
		if (window.scrollY > decimal_inputs_offset) {
			sticky_inputs.style = "top: 0; box-shadow: 0 0 5px black";
		} else {
			sticky_inputs.removeAttribute("style");
		}
	});
});
// #endregion
