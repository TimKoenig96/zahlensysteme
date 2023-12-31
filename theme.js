var current_theme = "dark";

function setThemeString() {
	document.getElementById("theme_switcher").innerText = ([
		current_theme.charAt(0).toUpperCase(),
		current_theme.slice(1),
		" theme nutzen?"
	]).join("");
}

function switchTheme() {
	setThemeString();
	if (current_theme === "dark") {
		current_theme = "light";
		localStorage.setItem("theme", "light");
	} else {
		current_theme = "dark";
		localStorage.removeItem("theme");
	}
	document.documentElement.dataset.theme = current_theme;
}

document.addEventListener("DOMContentLoaded", function() {
	if (localStorage.getItem("theme") === "light") {
		this.documentElement.dataset.theme = "light";
		setThemeString();
		current_theme = "light";
	}

	this.getElementById("theme_switcher").addEventListener("click", switchTheme);
});
