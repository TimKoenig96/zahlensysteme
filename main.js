// #region | Variables and elements
var decimal_input_number;
var decimal_input_slider;
var simple_output_table;
var old_decimal = 0;
// #endregion



// #region | Functions
function updateAllExamples(decimal) {

	// Convert to binary and hex
	const binary = decimal.toString(2).padStart(12, "0");
	const hexadecimal = decimal.toString(16).padStart(3, "0");

	// Adjust table visible parts
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

	// Update binary fields
	for (i = 0; i < 12; i++) simple_output_table.rows[1].cells[i + 1].innerText = binary.charAt(i);

	// Update hexadecimal fields
	for (i = 0; i < 3; i++) simple_output_table.rows[2].cells[i + 1].innerText = hexadecimal.charAt(i);
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

	decimal_input_slider.addEventListener("input", updateDecimalInputs);
	decimal_input_number.addEventListener("input", updateDecimalInputs);
	this.getElementById("simple_view").addEventListener("change", toggleSimpleView);
});
// #endregion
