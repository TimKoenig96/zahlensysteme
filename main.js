// #region | Variables and elements
var sticky_inputs;
var decimal_input_number;
var decimal_input_slider;
var simple_output_table;
var current_rhand_e;
var current_rhand = "right_0";
var current_lhand_e;
var current_lhand = "left_0";
var to_binary_table;
var binary_result;
var old_decimal = 0;
var decimal_inputs_offset;
// #endregion



// #region | Functions
function updateAllExamples(decimal) {

	// Convert to binary and hex
	const binary = decimal.toString(2).padStart(12, "0");
	const hexadecimal = decimal.toString(16).padStart(3, "0");

	// Update simple table visible parts
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

	// Get IDs of next image elements
	var lhand_e, lhand, rhand_e, rhand;
	if (decimal <= 1023) {
		rhand = `right_${parseInt(binary.substr(7, 5), 2)}`;
		lhand = `left_${parseInt(binary.substr(2, 5).split("").reverse().join(""), 2)}`;
	} else if (decimal <= 2047) {
		var rhand_num = parseInt(binary.substr(7, 5), 2);
		rhand_e = `right_${rhand_num}_${binary.substr(6, 1)}`;
		rhand = `right_${rhand_num}`;
		lhand = `left_${parseInt(binary.substr(1, 5).split("").reverse().join(""), 2)}`;
	} else {
		var rhand_num = parseInt(binary.substr(7, 5), 2);
		var lhand_num = parseInt(binary.substr(0, 5).split("").reverse().join(""), 2);
		rhand_e = `right_${rhand_num}_${binary.substr(6, 1)}`;
		lhand_e = `left_${lhand_num}_${binary.substr(5, 1)}`;
		rhand = `right_${rhand_num}`;
		lhand = `left_${lhand_num}`;
	}

	// Check if they need to be updated
	if (rhand !== current_rhand) {
		document.getElementById(rhand).classList.remove("hand_hidden");
		document.getElementById(current_rhand).classList.add("hand_hidden");
		current_rhand = rhand;
	}
	if (rhand_e !== current_rhand_e) {
		if (current_rhand_e === undefined) {
			document.getElementById(rhand_e).classList.remove("hand_hidden");
		} else {
			if (rhand_e === undefined) {
				document.getElementById(current_rhand_e).classList.add("hand_hidden");
			} else {
				document.getElementById(rhand_e).classList.remove("hand_hidden");
				document.getElementById(current_rhand_e).classList.add("hand_hidden");
			}
		}
		current_rhand_e = rhand_e;
	}
	if (lhand !== current_lhand) {
		document.getElementById(lhand).classList.remove("hand_hidden");
		document.getElementById(current_lhand).classList.add("hand_hidden");
		current_lhand = lhand;
	}
	if (lhand_e !== current_lhand_e) {
		if (current_lhand_e === undefined) {
			document.getElementById(lhand_e).classList.remove("hand_hidden");
		} else {
			if (lhand_e === undefined) {
				document.getElementById(current_lhand_e).classList.add("hand_hidden");
			} else {
				document.getElementById(lhand_e).classList.remove("hand_hidden");
				document.getElementById(current_lhand_e).classList.add("hand_hidden");
			}
		}
		current_lhand_e = lhand_e;
	}

	// Update decimal to binary calculation table visible parts and binary result
	if (decimal <= 15) {
		to_binary_table.querySelectorAll("[data-table_visibility]").forEach(function(element) {
			element.classList.add("table_hidden");
		});
		to_binary_table.rows[0].cells[1].setAttribute("rowspan", "5");
		binary_result.innerText = binary.slice(8);
	} else if (decimal <= 255) {
		to_binary_table.querySelectorAll("[data-table_visibility='2']").forEach(function(element) {
			element.classList.add("table_hidden");
		});
		to_binary_table.querySelectorAll("[data-table_visibility='1']").forEach(function(element) {
			element.classList.remove("table_hidden");
		});
		to_binary_table.rows[0].cells[1].setAttribute("rowspan", "9");
		binary_result.innerText = binary.slice(4).match(/.{1,4}/g).join(" ");
	} else {
		to_binary_table.querySelectorAll("[data-table_visibility]").forEach(function(element) {
			element.classList.remove("table_hidden");
		});
		to_binary_table.rows[0].cells[1].setAttribute("rowspan", "13");
		binary_result.innerText = binary.match(/.{1,4}/g).join(" ");
	}

	// Update decimal to binary calculation table fields
	var remaining_decimal = decimal;
	for (i = 0; i < 12; i++) {

		// Update decimal field
		to_binary_table.rows[i + 1].cells[0].innerText = remaining_decimal;

		// Update rest field
		to_binary_table.rows[i + 1].cells[2].innerHTML = (remaining_decimal % 2 == 1 ? "Ja (1)" : "Nein (0)");

		// Update remaining decimal number
		remaining_decimal = Math.floor(remaining_decimal / 2);

		// Update result field
		to_binary_table.rows[i + 1].cells[1].innerText = remaining_decimal;
	}
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
	to_binary_table = this.getElementById("to_binary_table");
	binary_result = this.getElementById("binary_result");

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
