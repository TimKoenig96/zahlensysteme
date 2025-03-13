let toggleButton;

function toggleTheme() {
	document.documentElement.classList.toggle("light_theme");
}

export function setupThemeHandler() {

	// Detect if light theme is preferred
	if (window.matchMedia("(prefers-color-scheme: light)").matches) toggleTheme();

	// Button setup
	toggleButton = document.getElementById("theme_toggle");
	toggleButton.addEventListener("click", toggleTheme);
}
